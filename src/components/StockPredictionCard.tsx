
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StockData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface StockPredictionCardProps {
  stock: StockData;
  showActions?: boolean;
}

const StockPredictionCard = ({ stock, showActions = true }: StockPredictionCardProps) => {
  const isPositive = stock.percentChange > 0;
  const isPredictionPositive = stock.predictionDirection === 'up';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-market-charcoal/60 border-blue-900/30 hover:border-blue-500/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
              <span className="ml-2 text-xs text-gray-400">{stock.name}</span>
            </div>
            <div className="flex items-center mt-1">
              <p className="text-xl font-bold">${stock.currentPrice.toFixed(2)}</p>
              <div className={cn(
                "flex items-center ml-2 text-sm",
                isPositive ? "text-market-green" : "text-market-red"
              )}>
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isPositive ? "+" : ""}{stock.percentChange.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className={cn(
            "flex items-center p-2 rounded-lg",
            isPredictionPositive ? "bg-green-500/10" : "bg-red-500/10"
          )}>
            {isPredictionPositive ? 
              <ArrowUpCircle className="w-8 h-8 text-market-green" /> : 
              <ArrowDownCircle className="w-8 h-8 text-market-red" />
            }
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="bg-market-darkBlue rounded-lg p-3">
            <p className="text-sm text-gray-400 mb-1">AI Prediction</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={cn(
                  "font-bold",
                  isPredictionPositive ? "text-market-green" : "text-market-red"
                )}>
                  {isPredictionPositive ? "Upward" : "Downward"} movement
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <span className="text-sm font-bold">{stock.predictionConfidence}%</span>
                </div>
                <span className="ml-2 text-sm text-gray-400">confidence</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-market-darkBlue rounded-lg p-2">
              <p className="text-xs text-gray-400">Market Cap</p>
              <p className="text-sm font-semibold">{stock.marketCap}</p>
            </div>
            <div className="bg-market-darkBlue rounded-lg p-2">
              <p className="text-xs text-gray-400">Volume</p>
              <p className="text-sm font-semibold">{stock.volume}</p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex justify-between mt-4">
              <button className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <ExternalLink className="w-4 h-4 mr-1" />
                Full Analysis
              </button>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Add to Watchlist
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockPredictionCard;
