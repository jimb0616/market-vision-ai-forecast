
import { mockCandles as importedMockCandles } from "@/lib/mockData";

// Chart data interface
export interface ChartDataPoint {
  date: string;
  price: number;
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
    return withPredictions;
  } catch (error) {
    console.error(`Error fetching ${symbol} candles:`, error);
    const candles = mockCandles[symbol] || mockCandles['AAPL'];
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
  const lastPrice = data[data.length - 1].price;
  const trendFactor = 0.5 + Math.random();
  const volatility = 2 + Math.random() * 3;
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayString = date.toISOString().split('T')[0];
    const priceChange = (Math.random() - 0.3) * volatility;
    const predictedPrice = lastPrice * (1 + (priceChange / 100) * i * trendFactor);
    const volume = Math.floor(Math.random() * 800000) + 200000;
    
    data.push({
      date: dayString,
      price: Math.round(predictedPrice * 100) / 100,
      prediction: Math.round(predictedPrice * 100) / 100,
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
