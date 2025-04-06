
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketSentimentItem {
  sector: string;
  sentiment: number;
}

interface MarketSentimentHeatmapProps {
  data: MarketSentimentItem[];
}

const MarketSentimentHeatmap = ({ data }: MarketSentimentHeatmapProps) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.sentiment - a.sentiment);
  }, [data]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return 'bg-market-green/30 border-market-green/30 text-market-green';
    if (sentiment > 0) return 'bg-market-green/20 border-market-green/20 text-green-400';
    if (sentiment > -0.3) return 'bg-market-red/20 border-market-red/20 text-red-400';
    return 'bg-market-red/30 border-market-red/30 text-market-red';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.7) return 'Very Bullish';
    if (sentiment > 0.3) return 'Bullish';
    if (sentiment > 0) return 'Slightly Bullish';
    if (sentiment > -0.3) return 'Slightly Bearish';
    if (sentiment > -0.7) return 'Bearish';
    return 'Very Bearish';
  };

  return (
    <Card className="bg-market-charcoal/60 border-blue-900/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span>Market Sentiment Heatmap</span>
          <span className="text-xs font-normal text-gray-400">Updated 5m ago</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedData.map((item) => (
            <div 
              key={item.sector}
              className={`rounded-lg border px-3 py-2 ${getSentimentColor(item.sentiment)}`}
            >
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm truncate mr-2">{item.sector}</span>
                  <span className="text-xs whitespace-nowrap">{getSentimentLabel(item.sentiment)}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.sentiment > 0 ? 'bg-market-green' : 'bg-market-red'}`}
                    style={{ width: `${Math.abs(item.sentiment) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSentimentHeatmap;
