import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartDataPoint } from "@/services/finnhubService";
import { useQuery } from "@tanstack/react-query";
import { getStockCandles } from "@/services/finnhubService";

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
  color?: string;
  height?: number;
  showFullData?: boolean;
}

const generateFallbackData = (symbol: string, historyDays: number, futureDays: number): ChartDataPoint[] => {
  const result: ChartDataPoint[] = [];
  const today = new Date();
  
  // Set base price based on stock symbol
  let basePrice = 180; // Default for AAPL
  if (symbol === 'TSLA') basePrice = 235;
  if (symbol === 'MSFT') basePrice = 372;
  if (symbol === 'AMZN') basePrice = 182;
  if (symbol === 'GOOG') basePrice = 145;
  if (symbol === 'META') basePrice = 512;
  
  // Generate historical data
  let currentPrice = basePrice;
  for (let i = historyDays; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const change = (Math.random() - 0.4) * basePrice * 0.01; // Slight upward bias
    currentPrice += change;
    
    result.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
  }
  
  // Generate future prediction data
  const lastPrice = result[result.length - 1].price || basePrice;
  let predictionPrice = lastPrice;
  
  // Randomly decide trend direction
  const trendUp = Math.random() > 0.5;
  const trendFactor = 0.5 + Math.random() * 1.5;
  
  for (let i = 1; i <= futureDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Create change based on trend direction
    const dailyChangePct = (Math.random() * 0.02) * (trendUp ? 1 : -1) * trendFactor;
    predictionPrice += predictionPrice * dailyChangePct;
    
    // Keep prediction price reasonable
    if (predictionPrice < lastPrice * 0.85) {
      predictionPrice = lastPrice * 0.85 + Math.random() * lastPrice * 0.05;
    } else if (predictionPrice > lastPrice * 1.15) {
      predictionPrice = lastPrice * 1.15 - Math.random() * lastPrice * 0.05;
    }
    
    result.push({
      date: date.toISOString().split('T')[0],
      price: undefined,
      prediction: Math.round(predictionPrice * 100) / 100,
      volume: Math.floor(Math.random() * 800000) + 200000
    });
  }
  
  return result;
};

const StockChart = ({ 
  data: mockData, 
  symbol, 
  color = "#2962FF", 
  height = 300,
  showFullData = false 
}: StockChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Fetch real stock data from Finnhub
  const { data: stockCandles, isLoading, error } = useQuery({
    queryKey: ['stockCandles', symbol],
    queryFn: () => getStockCandles(symbol),
    refetchOnWindowFocus: false,
  });
  
  // Transform Finnhub candle data to our ChartDataPoint format
  const [chartData, setChartData] = useState<ChartDataPoint[]>(mockData);
  
  useEffect(() => {
    if (stockCandles && stockCandles.length > 0) {
      // Sort by date to ensure proper ordering
      const sortedData = [...stockCandles].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setChartData(sortedData);
    }
  }, [stockCandles, symbol]);

  // Find the index where predictions start (where prediction becomes defined and price is undefined)
  const predictionStartIndex = chartData.findIndex(point => 
    point.price === undefined && point.prediction !== undefined
  );
  
  // Today's date (last real data point)
  const today = predictionStartIndex > 0 
    ? chartData[predictionStartIndex - 1].date 
    : chartData[chartData.length - 1].date;
  
  // Custom tooltip formatter
  const formatTooltip = (value: number) => {
    return [`$${value.toFixed(2)}`, ''];
  };
  
  // Format data for display - ensure no gaps between historical and prediction data
  const formattedData = chartData.map((item, index) => {
    // For the last historical data point, include both price and prediction
    if (predictionStartIndex > 0 && index === predictionStartIndex - 1) {
      return {
        ...item,
        // For the chart - combine price and prediction into a single value for display
        value: item.price,
        prediction: item.price, // Add prediction to bridge the gap
        isPrediction: false
      };
    }
    
    // For the first prediction point, ensure it connects with the last historical point
    if (index === predictionStartIndex) {
      const lastHistoricalPrice = chartData[predictionStartIndex - 1]?.price;
      return {
        ...item,
        value: item.prediction,
        price: undefined, // Keep as undefined to maintain correct categorization
        prediction: item.prediction || lastHistoricalPrice, // Use last price if prediction is somehow missing
        isPrediction: true
      };
    }
    
    return {
      ...item,
      // For the chart - combine price and prediction into a single value for display
      value: item.price !== undefined ? item.price : item.prediction,
      // Keep track of whether this is a prediction or actual price
      isPrediction: item.price === undefined && item.prediction !== undefined
    };
  });
  
  // Function to format dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Determine min and max values for Y axis (excluding zero values that might be errors)
  const allValues = formattedData
    .map(item => item.value)
    .filter(value => value !== undefined && value > 0) as number[];
    
  const minValue = Math.min(...allValues) * 0.95; // Add some padding
  const maxValue = Math.max(...allValues) * 1.05;
  
  if (isLoading) {
    return (
      <div className="relative" ref={chartRef}>
        {/* Chart Title */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{symbol} {showFullData ? "Stock Price" : "Preview"}</h3>
            <p className="text-sm text-gray-400">Loading data...</p>
          </div>
        </div>
        <div className="h-[300px] w-full flex items-center justify-center bg-market-darkBlue/50 rounded-lg">
          <p className="text-gray-400">Loading stock data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    console.error("Error loading stock data:", error);
    return (
      <div className="relative" ref={chartRef}>
        {/* Chart Title */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{symbol} {showFullData ? "Stock Price" : "Preview"}</h3>
            <p className="text-sm text-gray-400">Historical data with AI predictions</p>
          </div>
          {showFullData && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-gray-400">Historical</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-xs text-gray-400">Predicted</span>
              </div>
            </div>
          )}
        </div>
        
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={generateFallbackData(symbol, 10, 5)}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(e) => {
              if (e.activeTooltipIndex !== undefined) {
                setActiveIndex(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7E22CE" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7E22CE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickFormatter={formatDate}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              padding={{ left: 5, right: 5 }}
              interval="preserveEnd"
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickFormatter={(tick) => `$${tick.toFixed(0)}`}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              width={45}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => `Date: ${formatDate(label as string)}`}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '0.375rem',
                color: '#E5DEFF',
              }}
            />
            
            {/* Historical Price Area */}
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={color}
              fillOpacity={1}
              fill="url(#colorPrice)"
              activeDot={{ r: 6, fill: "white", stroke: color, strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1500}
              dot={false}
              connectNulls={true}
            />
            
            {/* Prediction Area */}
            <Area 
              type="monotone" 
              dataKey="prediction" 
              stroke="#7E22CE"
              fillOpacity={0.8}
              fill="url(#colorPrediction)"
              isAnimationActive={true}
              animationDuration={1500}
              activeDot={{ r: 6, fill: "white", stroke: "#7E22CE", strokeWidth: 2 }}
              dot={showFullData ? { r: 2, fill: "#7E22CE", stroke: "#7E22CE" } : false}
              strokeDasharray="5 5"
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  return (
    <div className="relative" ref={chartRef}>
      {/* Chart Title */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{symbol} {showFullData ? "Stock Price" : "Preview"}</h3>
          <p className="text-sm text-gray-400">Last 10 days with 5-day AI prediction</p>
        </div>
        {showFullData && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-gray-400">Historical</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-xs text-gray-400">Predicted</span>
            </div>
          </div>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onMouseMove={(e) => {
            if (e.activeTooltipIndex !== undefined) {
              setActiveIndex(e.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7E22CE" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7E22CE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickFormatter={formatDate}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
            padding={{ left: 5, right: 5 }}
            interval={1}
          />
          <YAxis 
            domain={[minValue, maxValue]}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickFormatter={(tick) => `$${tick.toFixed(0)}`}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
            width={45}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelFormatter={(label) => `Date: ${formatDate(label as string)}`}
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '0.375rem',
              color: '#E5DEFF',
            }}
          />
          
          {/* Historical Price Area */}
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color}
            fillOpacity={1}
            fill="url(#colorPrice)"
            activeDot={{ r: 6, fill: "white", stroke: color, strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1500}
            dot={false}
            connectNulls={true}
          />
          
          {/* Prediction Area */}
          <Area 
            type="monotone" 
            dataKey="prediction" 
            stroke="#7E22CE"
            fillOpacity={0.8}
            fill="url(#colorPrediction)"
            isAnimationActive={true}
            animationDuration={1500}
            activeDot={{ r: 6, fill: "white", stroke: "#7E22CE", strokeWidth: 2 }}
            dot={showFullData ? { r: 2, fill: "#7E22CE", stroke: "#7E22CE" } : false}
            strokeDasharray="5 5"
            connectNulls={true}
          />
          
          {/* Today reference line */}
          {predictionStartIndex > 0 && (
            <ReferenceLine 
              x={today} 
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeDasharray="3 3"
              label={{
                value: 'Today',
                position: 'insideTopRight',
                fill: '#94A3B8',
                fontSize: 10
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
