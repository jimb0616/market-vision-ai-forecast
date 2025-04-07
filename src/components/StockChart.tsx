import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartDataPoint } from "@/lib/mockData";
import { useQuery } from "@tanstack/react-query";
import { getStockCandles, ChartDataPoint as FinnhubChartDataPoint } from "@/services/finnhubService";

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
  color?: string;
  height?: number;
  showFullData?: boolean;
}

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
    if (stockCandles) {
      // Add prediction data (last 7 days)
      const lastPrice = stockCandles.length > 0 ? stockCandles[stockCandles.length - 1].price || 0 : 0;
      const predictionStartDate = new Date();
      
      const predictionData: ChartDataPoint[] = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(predictionStartDate);
        date.setDate(date.getDate() + i + 1);
        const dateString = date.toISOString().split('T')[0];
        
        // Simple random walk prediction for demo purposes
        const randomFactor = 1 + (Math.random() * 0.04 - 0.02); // -2% to +2%
        const predictedPrice = lastPrice * Math.pow(randomFactor, i + 1);
        
        return {
          date: dateString,
          price: undefined,
          prediction: predictedPrice,
        };
      });
      
      setChartData([...stockCandles, ...predictionData]);
    }
  }, [stockCandles, symbol]);

  // Find the index where predictions start (where price becomes undefined)
  const predictionStartIndex = chartData.findIndex(point => point.price === undefined && point.prediction !== undefined);
  
  // Today's date (last real data point)
  const today = predictionStartIndex > 0 ? chartData[predictionStartIndex - 1].date : chartData[chartData.length - 1].date;
  
  // Custom tooltip formatter
  const formatTooltip = (value: number) => {
    return [`$${value.toFixed(2)}`, ''];
  };
  
  // Format data for display
  const formattedData = chartData.map(item => {
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
  
  // Determine min and max values for Y axis
  const allValues = formattedData.map(item => item.value).filter(Boolean) as number[];
  const minValue = Math.min(...allValues) * 0.98;
  const maxValue = Math.max(...allValues) * 1.02;
  
  if (isLoading) {
    return (
      <div className="relative" ref={chartRef}>
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
    // Fall back to mock data if API fails
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
              interval={showFullData ? "preserveEnd" : 4}
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
                color: 'white',
              }}
            />
            
            {/* Historical Price Area */}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              fillOpacity={1}
              fill="url(#colorPrice)"
              activeDot={{ r: 6, fill: "white", stroke: color, strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1500}
              dot={false}
              // Render only up to the prediction start
              isRange={true}
              baseValue={minValue}
            />
            
            {/* Prediction Area - rendered as a separate area for visual distinction */}
            {predictionStartIndex > 0 && (
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#7E22CE"
                fillOpacity={0.8}
                fill="url(#colorPrediction)"
                isAnimationActive={true}
                animationDuration={1500}
                activeDot={{ r: 6, fill: "white", stroke: "#7E22CE", strokeWidth: 2 }}
                dot={showFullData ? { r: 2, fill: "#7E22CE", stroke: "#7E22CE" } : false}
                strokeDasharray="5 5"
                // Only render from prediction start to end
                isRange={true}
                baseValue={minValue}
                data={formattedData.slice(predictionStartIndex)}
              />
            )}
            
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
  }
  
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
            interval={showFullData ? "preserveEnd" : 4}
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
              color: 'white',
            }}
          />
          
          {/* Historical Price Area */}
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            fillOpacity={1}
            fill="url(#colorPrice)"
            activeDot={{ r: 6, fill: "white", stroke: color, strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1500}
            dot={false}
            // Render only up to the prediction start
            isRange={true}
            baseValue={minValue}
          />
          
          {/* Prediction Area - rendered as a separate area for visual distinction */}
          {predictionStartIndex > 0 && (
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#7E22CE"
              fillOpacity={0.8}
              fill="url(#colorPrediction)"
              isAnimationActive={true}
              animationDuration={1500}
              activeDot={{ r: 6, fill: "white", stroke: "#7E22CE", strokeWidth: 2 }}
              dot={showFullData ? { r: 2, fill: "#7E22CE", stroke: "#7E22CE" } : false}
              strokeDasharray="5 5"
              // Only render from prediction start to end
              isRange={true}
              baseValue={minValue}
              data={formattedData.slice(predictionStartIndex)}
            />
          )}
          
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
