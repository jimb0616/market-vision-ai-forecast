
import { mockCandles } from "@/lib/mockData";

// Chart data interface
export interface ChartDataPoint {
  date: string;
  price: number;
  prediction?: number; // Make prediction optional
}

// Define the stock candle data structure
export interface StockCandle {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string;   // Status
  t: number[]; // Timestamps
  v: number[]; // Volumes
}

// API error type
export interface ApiError {
  message: string;
  code: number;
}

// Mock API response delay
const MOCK_API_DELAY = 750;

/**
 * Fetch stock candles from the API or return mock data
 */
export const getStockCandles = async (symbol: string): Promise<ChartDataPoint[]> => {
  try {
    // In a real app, we would fetch from a real API
    // For demo purposes, we'll simulate an API call with a delay
    await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
    
    // Use mock data for demo purposes
    const candles = mockCandles[symbol as keyof typeof mockCandles] || mockCandles['AAPL'];
    
    // Process the candle data into chart points
    const chartData = processStockCandles(candles);
    
    // Generate and append prediction data
    const withPredictions = appendPredictionData(chartData);
    
    return withPredictions;
  } catch (error) {
    console.error(`Error fetching ${symbol} candles:`, error);
    // Return mock data in case of error
    const candles = mockCandles[symbol as keyof typeof mockCandles] || mockCandles['AAPL'];
    const chartData = processStockCandles(candles);
    const withPredictions = appendPredictionData(chartData);
    return withPredictions;
  }
};

/**
 * Process raw candle data into formatted chart points
 */
const processStockCandles = (candles: StockCandle): ChartDataPoint[] => {
  if (!candles || !candles.c || !candles.t || candles.s !== 'ok') {
    return generateMockChartData();
  }

  return candles.t.map((timestamp, index) => {
    const date = new Date(timestamp * 1000).toISOString().split('T')[0];
    return {
      date,
      price: candles.c[index],
    };
  });
};

/**
 * Generate random chart data when no data is available
 */
const generateMockChartData = (): ChartDataPoint[] => {
  const basePrice = 150 + Math.random() * 50;
  const volatility = 2 + Math.random() * 5;
  const dataPoints: ChartDataPoint[] = [];
  
  // Generate 30 days of data
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const priceChange = (Math.random() - 0.5) * volatility;
    const price = basePrice + priceChange * (30 - i) / 3;
    
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    });
  }
  
  return dataPoints;
};

/**
 * Append prediction data to historical chart data
 */
const appendPredictionData = (chartData: ChartDataPoint[]): ChartDataPoint[] => {
  if (!chartData || chartData.length === 0) {
    return [];
  }

  // Copy the data first
  const data = [...chartData];
  
  // Get the last actual price
  const lastPrice = data[data.length - 1].price;
  
  // Generate prediction trend (slightly upward bias)
  const trendFactor = 0.5 + Math.random(); // 0.5 to 1.5
  const volatility = 2 + Math.random() * 3;
  
  // Generate 7 days of future predictions
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const dayString = date.toISOString().split('T')[0];
    const priceChange = (Math.random() - 0.3) * volatility; // Slight upward bias
    const predictedPrice = lastPrice * (1 + (priceChange / 100) * i * trendFactor);
    
    // Add prediction to existing data points
    data.push({
      date: dayString,
      price: Math.round(predictedPrice * 100) / 100,
      prediction: Math.round(predictedPrice * 100) / 100
    });
  }
  
  return data;
};

/**
 * Refresh stock data (simulated)
 */
export const refreshStockData = async (symbol: string): Promise<boolean> => {
  // In a real app, this would force a fresh API call
  // For the demo, we'll just add some delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
  return true;
};
