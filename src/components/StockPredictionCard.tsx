
import { useState, memo, useCallback } from "react";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StockData } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { getStockQuote, StockQuote, refreshStockData } from "@/services/finnhubService";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import StockAnalysisDialog from "./StockAnalysisDialog";

interface StockPredictionCardProps {
  stock: StockData;
  showActions?: boolean;
}

const StockPredictionCard = memo(({ stock, showActions = true }: StockPredictionCardProps) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  
  // Use a short stale time to ensure data updates frequently
  const { data: quote, isLoading, error, refetch } = useQuery({
    queryKey: ['stockQuote', stock.symbol],
    queryFn: () => getStockQuote(stock.symbol),
    staleTime: 30000, // 30 seconds before data is considered stale
    refetchInterval: 60000, // Auto-refresh every minute
  });
  
  // Function to manually refresh data
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refreshStockData(stock.symbol);
      await refetch();
      toast({
        title: "Data refreshed",
        description: `${stock.symbol} data has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh stock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, stock.symbol, refetch, toast]);
  
  // Use live data if available, otherwise fall back to mock data
  const currentPrice = quote?.c || stock.currentPrice;
  const percentChange = quote?.dp || stock.percentChange;
  const isPositive = percentChange > 0;
  const isPredictionPositive = stock.predictionDirection === 'up';

  // Handler to open the analysis dialog
  const handleOpenAnalysis = useCallback(() => {
    setAnalysisOpen(true);
  }, []);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-market-charcoal/60 border-blue-900/30 hover:border-blue-500/50 animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
                <span className="ml-2 text-xs text-gray-400">{stock.name}</span>
              </div>
              <div className="flex items-center mt-1">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                    <p className="text-xl font-bold text-gray-400">Loading...</p>
                  </div>
                ) : error ? (
                  <p className="text-xl font-bold">${stock.currentPrice.toFixed(2)}</p>
                ) : (
                  <p className="text-xl font-bold">${currentPrice.toFixed(2)}</p>
                )}
                <div className={cn(
                  "flex items-center ml-2 text-sm transition-colors duration-200",
                  isPositive ? "text-market-green" : "text-market-red"
                )}>
                  {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {isPositive ? "+" : ""}{Math.abs(percentChange).toFixed(2)}%
                </div>
                <button 
                  className="ml-2 text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-blue-500/10 transition-colors"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh data"
                >
                  <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                </button>
              </div>
            </div>
            <div className={cn(
              "flex items-center p-2 rounded-lg transition-all duration-200",
              isPredictionPositive ? "bg-green-500/10 hover:bg-green-500/20" : "bg-red-500/10 hover:bg-red-500/20"
            )}>
              {isPredictionPositive ? 
                <ArrowUpCircle className="w-8 h-8 text-market-green" /> : 
                <ArrowDownCircle className="w-8 h-8 text-market-red" />
              }
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="bg-market-darkBlue rounded-lg p-3 transition-all duration-200 hover:bg-market-darkBlue/80">
              <p className="text-sm text-gray-400 mb-1">AI Prediction</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={cn(
                    "font-bold transition-colors duration-200",
                    isPredictionPositive ? "text-market-green" : "text-market-red"
                  )}>
                    {isPredictionPositive ? "Upward" : "Downward"} movement
                  </span>
                  <span className="ml-1 text-xs text-gray-400">(future trend)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center hover:bg-blue-900/50 transition-colors duration-200">
                    <span className="text-sm font-bold">{stock.predictionConfidence}%</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-400">confidence</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-market-darkBlue rounded-lg p-2 hover:bg-market-darkBlue/80 transition-colors duration-200">
                <p className="text-xs text-gray-400">Market Cap</p>
                <p className="text-sm font-semibold">{stock.marketCap}</p>
              </div>
              <div className="bg-market-darkBlue rounded-lg p-2 hover:bg-market-darkBlue/80 transition-colors duration-200">
                <p className="text-xs text-gray-400">Volume</p>
                <p className="text-sm font-semibold">{stock.volume}</p>
              </div>
            </div>
            
            {showActions && (
              <div className="flex justify-between mt-4">
                <Button 
                  variant="link" 
                  className="flex items-center text-sm text-blue-400 hover:text-blue-300 p-0 h-auto story-link"
                  onClick={handleOpenAnalysis}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Full Analysis
                </Button>
                <Button 
                  variant="link" 
                  className="text-sm text-blue-400 hover:text-blue-300 p-0 h-auto story-link"
                >
                  Add to Watchlist
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <StockAnalysisDialog 
        stock={stock} 
        open={analysisOpen} 
        onOpenChange={setAnalysisOpen} 
      />
    </>
  );
});

StockPredictionCard.displayName = 'StockPredictionCard';

export default StockPredictionCard;
