
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStockCandles, getStockQuote, StockQuote } from "@/services/finnhubService";
import { useQuery } from "@tanstack/react-query";
import { StockData } from "@/lib/mockData";
import StockChart from "./StockChart";
import { Calendar, DollarSign, BarChart2, Layers, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface StockAnalysisDialogProps {
  stock: StockData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define time range options
export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

const StockAnalysisDialog = ({ stock, open, onOpenChange }: StockAnalysisDialogProps) => {
  const [selectedTab, setSelectedTab] = useState("chart");
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  
  // Get days count based on selected time range
  const getDaysCount = (range: TimeRange): number => {
    switch (range) {
      case "1D": return 1;
      case "1W": return 7;
      case "1M": return 30;
      case "3M": return 90;
      case "1Y": return 365;
      case "ALL": return 730; // 2 years max for "ALL"
      default: return 30;
    }
  };
  
  // Fetch stock candle data with the selected time range
  const { data: chartData, isLoading: chartLoading, refetch: refetchChart } = useQuery({
    queryKey: ['stockCandles', stock.symbol, timeRange],
    queryFn: () => getStockCandles(stock.symbol, getDaysCount(timeRange)),
    enabled: open,
    staleTime: 300000, // 5 minutes
  });
  
  // Fetch stock quote data
  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ['stockQuote', stock.symbol],
    queryFn: () => getStockQuote(stock.symbol),
    enabled: open,
    staleTime: 60000, // 1 minute
  });
  
  // Handle time range change
  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
  };
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return num ? num.toLocaleString() : "N/A";
  };
  
  // Format price with $ and 2 decimal places
  const formatPrice = (price: number) => {
    return price ? `$${price.toFixed(2)}` : "N/A";
  };
  
  // Format percent change
  const formatPercentChange = (change: number) => {
    if (change === undefined || change === null) return "N/A";
    return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] bg-market-charcoal border-blue-900/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="font-bold text-white">{stock.symbol}</span>
            <span className="text-gray-400">{stock.name}</span>
            {quote && !quoteLoading && (
              <div className={cn(
                "ml-auto text-base font-normal flex items-center",
                quote.dp > 0 ? "text-market-green" : "text-market-red"
              )}>
                {formatPrice(quote.c)} 
                <span className="ml-2 flex items-center">
                  {quote.dp > 0 ? "+" : ""}{formatPercentChange(quote.dp)}
                  {quote.dp > 0 ? 
                    <Activity className="ml-1 w-4 h-4 text-market-green" /> : 
                    <Activity className="ml-1 w-4 h-4 text-market-red" />
                  }
                </span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="chart" 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-4 bg-market-darkBlue">
            <TabsTrigger value="chart" className="data-[state=active]:bg-blue-900/30">
              <BarChart2 className="w-4 h-4 mr-2" />
              Chart
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900/30">
              <Layers className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="prediction" className="data-[state=active]:bg-blue-900/30">
              <Activity className="w-4 h-4 mr-2" />
              Prediction
            </TabsTrigger>
            <TabsTrigger value="financials" className="data-[state=active]:bg-blue-900/30">
              <DollarSign className="w-4 h-4 mr-2" />
              Financials
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-4">
            <Card className="border-none bg-market-darkBlue/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  Price History & Prediction
                  <ToggleGroup 
                    type="single" 
                    value={timeRange} 
                    onValueChange={(value) => value && handleTimeRangeChange(value as TimeRange)}
                    className="flex items-center space-x-1"
                  >
                    <ToggleGroupItem value="1D" size="sm" className="h-7 text-xs">1D</ToggleGroupItem>
                    <ToggleGroupItem value="1W" size="sm" className="h-7 text-xs">1W</ToggleGroupItem>
                    <ToggleGroupItem value="1M" size="sm" className="h-7 text-xs">1M</ToggleGroupItem>
                    <ToggleGroupItem value="3M" size="sm" className="h-7 text-xs">3M</ToggleGroupItem>
                    <ToggleGroupItem value="1Y" size="sm" className="h-7 text-xs">1Y</ToggleGroupItem>
                    <ToggleGroupItem value="ALL" size="sm" className="h-7 text-xs">All</ToggleGroupItem>
                  </ToggleGroup>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Historical data with {timeRange === "1D" ? "1-day" : timeRange === "1W" ? "7-day" : "7-day"} AI prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chartLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="animate-pulse text-blue-400">Loading chart data...</div>
                  </div>
                ) : chartData ? (
                  <StockChart 
                    data={chartData} 
                    symbol={stock.symbol} 
                    color="#3B82F6" 
                    height={400}
                    showFullData={true}
                    timeRange={timeRange}
                  />
                ) : (
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-red-400">No chart data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overview" className="mt-4">
            <Card className="border-none bg-market-darkBlue/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Company Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Key information about {stock.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm text-gray-400 mb-1">Company Description</h4>
                      <p className="text-gray-200">
                        {stock.name} is a leading technology company focused on {stock.sector.toLowerCase()} 
                        products and services. The company has established a strong market presence and 
                        continues to innovate in its field.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <h4 className="text-xs text-gray-400 mb-1">Sector</h4>
                        <p className="text-sm text-white">{stock.sector}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-400 mb-1">Industry</h4>
                        <p className="text-sm text-white">{stock.industry}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-400 mb-1">Market Cap</h4>
                        <p className="text-sm text-white">{stock.marketCap}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-400 mb-1">Average Volume</h4>
                        <p className="text-sm text-white">{stock.volume}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-market-navy/50 rounded-lg p-4">
                    <h4 className="text-sm text-gray-400 mb-3">Latest Quote</h4>
                    {quoteLoading ? (
                      <div className="animate-pulse text-blue-400">Loading quote data...</div>
                    ) : quote ? (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                          <h5 className="text-xs text-gray-400 mb-1">Current Price</h5>
                          <p className="text-sm font-semibold text-white">{formatPrice(quote.c)}</p>
                        </div>
                        <div>
                          <h5 className="text-xs text-gray-400 mb-1">Previous Close</h5>
                          <p className="text-sm text-white">{formatPrice(quote.pc)}</p>
                        </div>
                        <div>
                          <h5 className="text-xs text-gray-400 mb-1">Open</h5>
                          <p className="text-sm text-white">{formatPrice(quote.o)}</p>
                        </div>
                        <div>
                          <h5 className="text-xs text-gray-400 mb-1">Day High</h5>
                          <p className="text-sm text-white">{formatPrice(quote.h)}</p>
                        </div>
                        <div>
                          <h5 className="text-xs text-gray-400 mb-1">Day Low</h5>
                          <p className="text-sm text-white">{formatPrice(quote.l)}</p>
                        </div>
                        <div>
                          <h5 className="text-xs text-gray-400 mb-1">Change</h5>
                          <p className={cn(
                            "text-sm",
                            quote.d > 0 ? "text-market-green" : "text-market-red"
                          )}>
                            {quote.d > 0 ? "+" : ""}{quote.d.toFixed(2)} ({formatPercentChange(quote.dp)})
                          </p>
                        </div>
                        <div className="col-span-2">
                          <h5 className="text-xs text-gray-400 mb-1">Last Updated</h5>
                          <p className="text-sm text-white flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {formatDate(quote.t)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-400">No quote data available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prediction" className="mt-4">
            <Card className="border-none bg-market-darkBlue/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">AI Prediction Analysis</CardTitle>
                <CardDescription className="text-gray-400">
                  Our AI model's forecast for {stock.symbol}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-4">
                    <div>
                      <h4 className="text-sm text-gray-400 mb-1">Prediction Summary</h4>
                      <div className={cn(
                        "p-4 rounded-lg border",
                        stock.predictionDirection === 'up' 
                          ? "bg-green-950/20 border-green-800/30" 
                          : "bg-red-950/20 border-red-800/30"
                      )}>
                        <div className="flex items-center">
                          <Activity className={cn(
                            "w-5 h-5 mr-2",
                            stock.predictionDirection === 'up' ? "text-market-green" : "text-market-red"
                          )} />
                          <span className="font-semibold text-white">
                            {stock.predictionDirection === 'up' ? 'Bullish Prediction' : 'Bearish Prediction'}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-300">
                          Our AI models predict a {stock.predictionDirection === 'up' ? 'positive' : 'negative'} trend 
                          for {stock.symbol} over the next 7 days with {stock.predictionConfidence}% confidence.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Key Factors Influencing Prediction</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2"></span>
                          <span className="text-sm text-gray-200">
                            {stock.predictionDirection === 'up' ? 'Strong' : 'Weak'} technical indicators based on recent price movements
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2"></span>
                          <span className="text-sm text-gray-200">
                            {stock.predictionDirection === 'up' ? 'Positive' : 'Negative'} sentiment analysis from financial news and social media
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2"></span>
                          <span className="text-sm text-gray-200">
                            {stock.predictionDirection === 'up' ? 'Favorable' : 'Challenging'} market conditions for the {stock.sector} sector
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2"></span>
                          <span className="text-sm text-gray-200">
                            Historical patterns indicate a likely {stock.predictionDirection === 'up' ? 'upward' : 'downward'} movement
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Confidence Metrics</h4>
                    <div className="bg-market-navy/50 rounded-lg p-4 space-y-4">
                      <div className="text-center p-4">
                        <div className="w-24 h-24 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto">
                          <span className="text-2xl font-bold text-white">{stock.predictionConfidence}%</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">Overall Confidence</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Technical Score</span>
                          <span>{65 + Math.floor(Math.random() * 20)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Sentiment Score</span>
                          <span>{60 + Math.floor(Math.random() * 25)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Historical Score</span>
                          <span>{70 + Math.floor(Math.random() * 20)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financials" className="mt-4">
            <Card className="border-none bg-market-darkBlue/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Financial Summary</CardTitle>
                <CardDescription className="text-gray-400">
                  Key financial metrics for {stock.symbol}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Valuation Metrics</h4>
                    <div className="bg-market-navy/50 rounded-lg p-4">
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Market Cap</dt>
                          <dd className="text-sm text-white font-medium">{stock.marketCap}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">P/E Ratio</dt>
                          <dd className="text-sm text-white font-medium">{(15 + Math.random() * 10).toFixed(2)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">EPS (TTM)</dt>
                          <dd className="text-sm text-white font-medium">${(3 + Math.random() * 5).toFixed(2)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Dividend Yield</dt>
                          <dd className="text-sm text-white font-medium">{(Math.random() * 2).toFixed(2)}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">52 Week High</dt>
                          <dd className="text-sm text-white font-medium">${(quote?.c * 1.2).toFixed(2) || "N/A"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">52 Week Low</dt>
                          <dd className="text-sm text-white font-medium">${(quote?.c * 0.8).toFixed(2) || "N/A"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Performance Metrics</h4>
                    <div className="bg-market-navy/50 rounded-lg p-4">
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Return on Equity</dt>
                          <dd className="text-sm text-white font-medium">{(20 + Math.random() * 15).toFixed(2)}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Profit Margin</dt>
                          <dd className="text-sm text-white font-medium">{(15 + Math.random() * 10).toFixed(2)}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Operating Margin</dt>
                          <dd className="text-sm text-white font-medium">{(20 + Math.random() * 12).toFixed(2)}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Revenue Growth (YoY)</dt>
                          <dd className="text-sm text-white font-medium">{(8 + Math.random() * 12).toFixed(2)}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Debt to Equity</dt>
                          <dd className="text-sm text-white font-medium">{(0.3 + Math.random() * 0.5).toFixed(2)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Free Cash Flow</dt>
                          <dd className="text-sm text-white font-medium">${(5 + Math.random() * 10).toFixed(2)}B</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StockAnalysisDialog;
