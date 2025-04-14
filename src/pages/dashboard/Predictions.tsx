
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import StockChart from "@/components/StockChart";
import { popularStocks } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { refreshStockData } from "@/services/finnhubService";

const Predictions = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStock, setSelectedStock] = useState("AAPL");
  
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refreshStockData(selectedStock);
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
  };
  
  const handleStockChange = (symbol: string) => {
    setSelectedStock(symbol);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Predictions</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-blue-400 hover:text-blue-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
        
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
                  className={selectedStock === stock.symbol ? "bg-blue-600" : ""}
                >
                  {stock.symbol}
                </Button>
              ))}
            </div>
            
            <div className="h-[400px]">
              <StockChart 
                data={[]} 
                symbol={selectedStock} 
                height={350} 
                showFullData={true} 
              />
            </div>
            
            <div className="mt-6 bg-market-navy/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Prediction Analysis</h3>
              <p className="text-gray-300 mb-3">
                Our AI model is predicting {selectedStock} stock will likely 
                {Math.random() > 0.5 ? 
                  " increase over the next 5 trading days with moderate confidence." : 
                  " show slight volatility but maintain an overall positive trend."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-market-darkBlue/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Confidence Level</p>
                  <p className="text-xl font-bold text-blue-400">{Math.floor(70 + Math.random() * 25)}%</p>
                </div>
                <div className="bg-market-darkBlue/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Expected Movement</p>
                  <p className="text-xl font-bold text-green-400">+{(Math.random() * 3).toFixed(2)}%</p>
                </div>
                <div className="bg-market-darkBlue/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Market Sentiment</p>
                  <p className="text-xl font-bold text-purple-400">Bullish</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Predictions;
