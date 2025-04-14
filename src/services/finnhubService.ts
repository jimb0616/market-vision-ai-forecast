
import { mockCandles as importedMockCandles } from "@/lib/mockData";

// Chart data interface
export interface ChartDataPoint {
  date: string;
  price?: number;
  prediction?: number; // Optional prediction field
  volume?: number;     // Add volume field
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

// Stock quote interface
export interface StockQuote {
  c: number;   // Current price
  d: number;   // Change
  dp: number;  // Percent change
  h: number;   // High price of the day
  l: number;   // Low price of the day
  o: number;   // Open price of the day
  pc: number;  // Previous close price
  t: number;   // Timestamp
}

// API error type
export interface ApiError {
  message: string;
  code: number;
}

// Mock API response delay
const MOCK_API_DELAY = 750;

// Create a copy of the imported mock candles to avoid modification issues
export const mockCandles = importedMockCandles;

/**
 * Fetch stock quote data
 */
export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
  
  // Mock data for different symbols
  const mockQuotes: Record<string, StockQuote> = {
    'AAPL': {
      c: 180.25,  // Current price
      d: 2.58,    // Change
      dp: 1.45,   // Percent change
      h: 181.32,  // High price of the day
      l: 178.46,  // Low price of the day
      o: 179.54,  // Open price of the day
      pc: 177.67, // Previous close price
      t: Math.floor(Date.now() / 1000) // Timestamp
    },
    'TSLA': {
      c: 235.78,
      d: -3.25,
      dp: -1.36,
      h: 241.23,
      l: 234.18,
      o: 239.85,
      pc: 239.03,
      t: Math.floor(Date.now() / 1000)
    },
    'MSFT': {
      c: 372.45,
      d: 5.32,
      dp: 1.45,
      h: 374.12,
      l: 368.75,
      o: 369.23,
      pc: 367.13,
      t: Math.floor(Date.now() / 1000)
    },
    'AMZN': {
      c: 182.34,
      d: 1.87,
      dp: 1.04,
      h: 183.25,
      l: 180.43,
      o: 181.12,
      pc: 180.47,
      t: Math.floor(Date.now() / 1000)
    },
    'GOOG': {
      c: 145.87,
      d: 0.95,
      dp: 0.66,
      h: 146.75,
      l: 144.32,
      o: 145.21,
      pc: 144.92,
      t: Math.floor(Date.now() / 1000)
    }
  };
  
  return mockQuotes[symbol] || mockQuotes['AAPL'];
};

/**
 * Fetch stock candles from the API or return mock data
 */
export const getStockCandles = async (symbol: string): Promise<ChartDataPoint[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
    // Safely fetch mock data for symbol or default to 'AAPL'
    const candles = mockCandles[symbol] || mockCandles['AAPL'];
    const chartData = processStockCandles(candles);
    const withPredictions = appendPredictionData(chartData);
    
    // Filter to only keep the most recent 10 days of historical data and 5 days of prediction
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);
    
    const filteredData = withPredictions.filter(point => {
      const pointDate = new Date(point.date);
      // Keep historical data from the last 10 days and predictions for the next 5 days
      if (point.prediction) {
        // For prediction data, only keep 5 days worth
        return pointDate <= new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
      } else {
        // For historical data, only keep the last 10 days
        return pointDate >= tenDaysAgo;
      }
    });
    
    // Ensure dates are in ascending order
    return filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error(`Error fetching ${symbol} candles:`, error);
    const candles = mockCandles[symbol] || mockCandles['AAPL'];
    const chartData = processStockCandles(candles);
    const withPredictions = appendPredictionData(chartData);
    
    // Apply the same filtering here too
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);
    
    const filteredData = withPredictions.filter(point => {
      const pointDate = new Date(point.date);
      if (point.prediction) {
        return pointDate <= new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
      } else {
        return pointDate >= tenDaysAgo;
      }
    });
    
    // Ensure dates are in ascending order
    return filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
      volume: candles.v[index]
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
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const priceChange = (Math.random() - 0.5) * volatility;
    const price = basePrice + priceChange * (30 - i) / 3;
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      volume: volume
    });
  }
  
  return dataPoints;
};

/**
 * Append prediction data to historical chart data
 */
const appendPredictionData = (chartData: ChartDataPoint[]): ChartDataPoint[] => {
  if (!chartData || chartData.length === 0) return [];

  const data = [...chartData];
  const lastPoint = data[data.length - 1];
  const lastPrice = lastPoint.price || 0;
  
  // Create more dynamic prediction trends
  // Randomly determine if we'll have an upward or downward trend
  const trendDirection = Math.random() > 0.5 ? 1 : -1;
  const trendStrength = 0.5 + Math.random() * 1.5; // Stronger trend factor
  const volatility = 1 + Math.random() * 3; // Increase volatility for more interesting patterns
  
  // Get the average daily change from the last few days to create predictions that follow the trend
  const recentPrices = data.slice(-5).map(d => d.price || 0);
  const avgDailyChange = recentPrices.length > 1 
    ? (recentPrices[recentPrices.length-1] - recentPrices[0]) / (recentPrices.length - 1)
    : 0;
  
  // Use a blend of the recent trend and random variation
  const baseChange = avgDailyChange * 0.7 + (trendDirection * trendStrength * lastPrice * 0.01);
  
  // Only add 5 days of prediction data
  let currentPrice = lastPrice;
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayString = date.toISOString().split('T')[0];
    
    // Create more realistic and varied prediction patterns
    // Use noise that varies day to day for more interesting patterns
    const noise = (Math.random() - 0.5) * volatility;
    const dailyChange = baseChange + noise;
    
    // Apply the daily change to current price
    currentPrice += dailyChange;
    
    // Make sure predictions never go below 10% of the last price or above 200% of the last price
    if (currentPrice <= lastPrice * 0.1) {
      currentPrice = lastPrice * 0.15 + Math.random() * lastPrice * 0.1;
    } else if (currentPrice >= lastPrice * 2) {
      currentPrice = lastPrice * 1.9 - Math.random() * lastPrice * 0.1;
    }
    
    const volume = Math.floor(Math.random() * 800000) + 200000;
    
    data.push({
      date: dayString,
      price: undefined, // Set price to undefined for prediction data points
      prediction: Math.round(currentPrice * 100) / 100,
      volume: volume
    });
  }
  
  return data;
};

/**
 * Refresh stock data (simulated)
 */
export const refreshStockData = async (symbol: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
  return true;
};

/**
 * Get market sentiment data (mock)
 */
export const getMarketSentiment = async (): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
  
  // Return mock sentiment data
  return {
    sectors: [
      { name: "Technology", sentiment: 0.8 },
      { name: "Healthcare", sentiment: 0.65 },
      { name: "Financial", sentiment: 0.45 },
      { name: "Energy", sentiment: 0.3 },
      { name: "Consumer", sentiment: 0.6 },
      { name: "Industrial", sentiment: 0.5 },
      { name: "Utilities", sentiment: 0.4 },
      { name: "Materials", sentiment: 0.55 },
      { name: "Real Estate", sentiment: 0.35 },
      { name: "Communication", sentiment: 0.7 }
    ]
  };
};
