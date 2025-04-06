
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, Activity, ChevronRight
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StockChart from "@/components/StockChart";
import StockPredictionCard from "@/components/StockPredictionCard";
import MarketSentimentHeatmap from "@/components/MarketSentimentHeatmap";
import { popularStocks, generateChartData, marketSentiment } from "@/lib/mockData";

const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  const [selectedStock, setSelectedStock] = useState(popularStocks[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStocks, setFilteredStocks] = useState(popularStocks);
  
  // Generate chart data on component mount
  useEffect(() => {
    // Generate mock chart data for each stock
    const stockChartData = {};
    
    popularStocks.forEach(stock => {
      stockChartData[stock.symbol] = generateChartData(stock.currentPrice, 0.03);
    });
    
    setChartData(stockChartData);
  }, []);
  
  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStocks(popularStocks);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = popularStocks.filter(
      stock => 
        stock.name.toLowerCase().includes(query) || 
        stock.symbol.toLowerCase().includes(query)
    );
    
    setFilteredStocks(filtered);
  }, [searchQuery]);
  
  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };
  
  // Calculate summary statistics
  const totalPredictions = popularStocks.length;
  const positiveCount = popularStocks.filter(s => s.predictionDirection === 'up').length;
  const negativeCount = totalPredictions - positiveCount;
  const positivePercentage = (positiveCount / totalPredictions) * 100;
  const negativePercentage = (negativeCount / totalPredictions) * 100;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's your market prediction overview.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="hidden md:flex border-blue-500 text-blue-500 hover:bg-blue-500/10">
              Export Data
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              New Predictions
            </Button>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-market-charcoal/60 border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalPredictions}</div>
                  <p className="text-xs text-gray-400">Active predictions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-market-charcoal/60 border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Bullish Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-market-green" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-market-green">{positiveCount}</div>
                  <p className="text-xs text-gray-400">{positivePercentage.toFixed(0)}% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-market-charcoal/60 border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Bearish Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mr-4">
                  <TrendingDown className="h-6 w-6 text-market-red" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-market-red">{negativeCount}</div>
                  <p className="text-xs text-gray-400">{negativePercentage.toFixed(0)}% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-market-charcoal/60 border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg. Prediction Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4">
                  <Activity className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">82%</div>
                  <p className="text-xs text-gray-400">+2.5% from last week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main charts and predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main chart */}
          <div className="lg:col-span-2">
            <Card className="bg-market-charcoal/60 border-blue-900/30">
              <CardHeader>
                <CardTitle>Stock Performance</CardTitle>
                <CardDescription>Detailed view with AI prediction overlay</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData[selectedStock?.symbol] && (
                  <StockChart 
                    data={chartData[selectedStock.symbol]} 
                    symbol={selectedStock.symbol} 
                    color="#3B82F6"
                    height={350}
                    showFullData={true}
                  />
                )}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">AI Prediction Analysis</h3>
                  <p className="text-sm text-gray-300">
                    Our AI predicts a <span className={selectedStock?.predictionDirection === 'up' ? 'text-market-green font-medium' : 'text-market-red font-medium'}>
                      {selectedStock?.predictionDirection === 'up' ? 'bullish' : 'bearish'} trend
                    </span> for {selectedStock?.name} ({selectedStock?.symbol}) with {selectedStock?.predictionConfidence}% confidence. This prediction is based on technical indicators, market sentiment, and historical patterns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top predictions */}
          <div>
            <Card className="bg-market-charcoal/60 border-blue-900/30">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Top Predictions</CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white -mr-2">
                    See all <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStocks.slice(0, 3).map((stock) => (
                    <div 
                      key={stock.id}
                      className={`rounded-lg p-3 cursor-pointer transition-colors ${selectedStock?.id === stock.id ? 'bg-blue-900/30 border border-blue-500/30' : 'hover:bg-blue-900/20 border border-transparent'}`}
                      onClick={() => handleStockSelect(stock)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-bold text-white mr-2">{stock.symbol}</h3>
                            <span className="text-xs text-gray-400">{stock.name}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <p className="font-medium">${stock.currentPrice.toFixed(2)}</p>
                            <div className={`flex items-center ml-2 text-sm ${stock.percentChange > 0 ? 'text-market-green' : 'text-market-red'}`}>
                              {stock.percentChange > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                              {stock.percentChange > 0 ? "+" : ""}{stock.percentChange.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center p-2 rounded-lg ${stock.predictionDirection === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {stock.predictionDirection === 'up' ? 
                            <TrendingUp className="w-6 h-6 text-market-green" /> : 
                            <TrendingDown className="w-6 h-6 text-market-red" />
                          }
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-market-darkBlue rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${stock.predictionDirection === 'up' ? 'bg-market-green' : 'bg-market-red'}`} 
                            style={{width: `${stock.predictionConfidence}%`}}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-400">Confidence</span>
                          <span className="text-xs font-medium">{stock.predictionConfidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Additional charts and data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market sentiment heatmap */}
          <div className="lg:col-span-1">
            <MarketSentimentHeatmap data={marketSentiment} />
          </div>
          
          {/* Recent predictions */}
          <div className="lg:col-span-2">
            <Card className="bg-market-charcoal/60 border-blue-900/30">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Recent Predictions</CardTitle>
                  <Tabs defaultValue="all" className="w-[300px]">
                    <TabsList className="bg-market-darkBlue">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="bullish">Bullish</TabsTrigger>
                      <TabsTrigger value="bearish">Bearish</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularStocks.slice(3, 7).map((stock) => (
                    <StockPredictionCard 
                      key={stock.id} 
                      stock={stock} 
                      showActions={false}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
