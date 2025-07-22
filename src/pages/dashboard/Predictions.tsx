
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import StockChart from "@/components/StockChart";
import { popularStocks } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { refreshStockData, getStockCandles } from "@/services/finnhubService";
import { useQuery } from "@tanstack/react-query";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ErrorBoundary from "@/components/ErrorBoundary";

// Define time range type
type TimeRange = "1D" | "1W" | "1M";

const Predictions = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  
  // Get days count based on selected time range
  const getDaysCount = useCallback((range: TimeRange): number => {
    switch (range) {
      case "1D": return 1;
      case "1W": return 7;
      case "1M": return 30;
      default: return 30;
    }
  }, []);
  
  // Fetch chart data with time range
  const { data: chartData, isLoading, refetch } = useQuery({
    queryKey: ['stockCandles', selectedStock, timeRange],
    queryFn: () => getStockCandles(selectedStock, getDaysCount(timeRange)),
    staleTime: 300000, // 5 minutes
  });
  
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refreshStockData(selectedStock);
      await refetch();
      toast({
        title: "Data refreshed",
        description: `${selectedStock} prediction data has been updated.`,
      });
    } catch (err) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh prediction data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, selectedStock, refetch, toast]);
  
  const handleStockChange = useCallback((symbol: string) => {
    setSelectedStock(symbol);
  }, []);
  
  const handleTimeRangeChange = useCallback((value: TimeRange) => {
    setTimeRange(value);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Predictions</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-blue-400 hover:text-blue-300 hover-scale"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
        
        <ErrorBoundary>
          <Card className="bg-market-charcoal/60 border-blue-900/30">
            <CardHeader>
              <CardTitle>Stock Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {popularStocks.slice(0, 6).map((stock) => (
                  <Button
                    key={stock.symbol}
                    variant={selectedStock === stock.symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStockChange(stock.symbol)}
                    className={`hover-scale transition-all duration-200 ${
                      selectedStock === stock.symbol 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "hover:bg-blue-500/10"
                    }`}
                  >
                    {stock.symbol}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-400">Time Range:</h3>
                <ToggleGroup 
                  type="single" 
                  value={timeRange} 
                  onValueChange={(value) => value && handleTimeRangeChange(value as TimeRange)}
                  className="flex items-center"
                >
                  <ToggleGroupItem value="1D" size="sm" className="h-7 text-xs hover-scale">1D</ToggleGroupItem>
                  <ToggleGroupItem value="1W" size="sm" className="h-7 text-xs hover-scale">1W</ToggleGroupItem>
                  <ToggleGroupItem value="1M" size="sm" className="h-7 text-xs hover-scale">1M</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="h-[400px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
                    <p className="text-blue-400">Loading chart data...</p>
                  </div>
                ) : (
                  <ErrorBoundary>
                    <StockChart 
                      data={chartData || []} 
                      symbol={selectedStock} 
                      height={350} 
                      showFullData={true}
                    />
                  </ErrorBoundary>
                )}
              </div>
              
              <div className="mt-6 bg-market-navy/50 p-4 rounded-lg hover:bg-market-navy/70 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-white mb-2">Prediction Analysis</h3>
                <p className="text-gray-300 mb-3">
                  Our AI model is predicting {selectedStock} stock will likely 
                  {Math.random() > 0.5 ? 
                    " increase over the next 5 trading days with moderate confidence." : 
                    " show slight volatility but maintain an overall positive trend."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-market-darkBlue/50 p-3 rounded-lg hover:bg-market-darkBlue/70 transition-colors duration-200">
                    <p className="text-sm text-gray-400">Confidence Level</p>
                    <p className="text-xl font-bold text-blue-400">{Math.floor(70 + Math.random() * 25)}%</p>
                  </div>
                  <div className="bg-market-darkBlue/50 p-3 rounded-lg hover:bg-market-darkBlue/70 transition-colors duration-200">
                    <p className="text-sm text-gray-400">Expected Movement</p>
                    <p className="text-xl font-bold text-green-400">+{(Math.random() * 3).toFixed(2)}%</p>
                  </div>
                  <div className="bg-market-darkBlue/50 p-3 rounded-lg hover:bg-market-darkBlue/70 transition-colors duration-200">
                    <p className="text-sm text-gray-400">Market Sentiment</p>
                    <p className="text-xl font-bold text-purple-400">Bullish</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default Predictions;
