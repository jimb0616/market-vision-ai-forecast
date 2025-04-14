
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
 * Fetch stock candles from the API or return mock data based on time range
 */
export const getStockCandles = async (symbol: string, days: number = 30): Promise<ChartDataPoint[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
    
    // Create historical data for the specified number of days
    const today = new Date();
    
    // Adjust based on time range
    let numPredictionDays = 5; // Default prediction days
    
    // For 1D view, use hours instead of days and fewer prediction points
    if (days === 1) {
      return generateIntradayData(symbol);
    }
    
    // If very short time period, reduce prediction days
    if (days <= 7) {
      numPredictionDays = 3;
    }
    
    const historicalData: ChartDataPoint[] = [];
    
    // Generate base price based on the stock symbol
    let basePrice = 180; // Default for AAPL
    if (symbol === 'TSLA') basePrice = 235;
    if (symbol === 'MSFT') basePrice = 372;
    if (symbol === 'AMZN') basePrice = 182;
    if (symbol === 'GOOG') basePrice = 145;
    if (symbol === 'META') basePrice = 512;
    
    // Create daily historical data with slight randomization
    const volatility = 2 + Math.random() * 3;
    
    // Create a more realistic price history with trends
    const trendCycles = Math.floor(days / 30) || 1; // Create trends that last roughly a month
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Create more realistic price movements - add some trending patterns
      // Use sine waves with varying periods and random noise for more realistic movement
      const trendFactor = Math.sin((i / 30) * Math.PI * trendCycles) * volatility * 1.5;
      const randomNoise = (Math.random() - 0.5) * volatility;
      const dailyChange = trendFactor + randomNoise;
      
      currentPrice += dailyChange;
      
      // Ensure price never goes below minimum threshold
      if (currentPrice < basePrice * 0.7) {
        currentPrice = basePrice * 0.7 + Math.random() * 5;
      }
      
      // And never too high
      if (currentPrice > basePrice * 1.3) {
        currentPrice = basePrice * 1.3 - Math.random() * 5;
      }
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(currentPrice * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    // Now add prediction data (5 days into the future)
    // Get the last historical price to ensure continuity
    const lastHistoricalDataPoint = historicalData[historicalData.length - 1];
    const lastPrice = lastHistoricalDataPoint.price as number;
    
    // Generate prediction starting exactly from the last historical price
    const predictionData = generatePredictionData(lastPrice, numPredictionDays, lastHistoricalDataPoint.date);
    
    // Combine historical and prediction data
    const combinedData = [...historicalData, ...predictionData];
    
    // Ensure dates are in ascending order
    return combinedData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error(`Error generating ${symbol} candles:`, error);
    
    // Fallback to fully random data if something goes wrong
    const basePrice = 150 + Math.random() * 50;
    const historicalData = generateRandomChartData(basePrice, days);
    const lastPrice = historicalData[historicalData.length - 1].price || basePrice;
    const lastDate = historicalData[historicalData.length - 1].date;
    const predictionData = generatePredictionData(lastPrice, 5, lastDate);
    
    const combinedData = [...historicalData, ...predictionData];
    
    return combinedData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
};

/**
 * Generate intraday data (hourly) for 1D view
 */
const generateIntradayData = (symbol: string): ChartDataPoint[] => {
  const dataPoints: ChartDataPoint[] = [];
  const now = new Date();
  const marketOpen = new Date(now);
  const hoursOffset = now.getHours() >= 16 ? 0 : 1; // If after market close, use today's data, otherwise yesterday
  
  marketOpen.setDate(marketOpen.getDate() - hoursOffset);
  marketOpen.setHours(9, 30, 0, 0); // Market opens at 9:30 AM
  
  // Generate a base price
  let basePrice = 180; // Default for AAPL
  if (symbol === 'TSLA') basePrice = 235;
  if (symbol === 'MSFT') basePrice = 372;
  if (symbol === 'AMZN') basePrice = 182;
  if (symbol === 'GOOG') basePrice = 145;
  if (symbol === 'META') basePrice = 512;
  
  // Add small random variation to base price
  basePrice = basePrice * (0.98 + Math.random() * 0.04);
  
  // Generate hourly data points from market open (9:30 AM) to market close (4:00 PM)
  let currentPrice = basePrice;
  const openPrice = currentPrice;
  const volatility = basePrice * 0.005; // 0.5% hourly volatility
  
  // Create data for each 30-min period
  for (let i = 0; i <= 13; i++) { // 9:30 AM to 4:00 PM (13 half-hour intervals)
    const time = new Date(marketOpen);
    time.setMinutes(time.getMinutes() + (i * 30));
    
    // More realistic intraday pattern - often dips mid-day and recovers
    // Create a slight U-shape pattern with noise
    const timeProgress = i / 13;
    const patternFactor = Math.cos((timeProgress - 0.5) * Math.PI) * -0.5; // U-shape pattern
    const randomNoise = (Math.random() - 0.5);
    const priceChange = (patternFactor + randomNoise) * volatility;
    
    currentPrice += priceChange;
    
    // Ensure price doesn't go too low
    if (currentPrice < basePrice * 0.99) {
      currentPrice = basePrice * 0.99;
    }
    
    // Format date for intraday view
    const formattedDateTime = time.toISOString();
    
    dataPoints.push({
      date: formattedDateTime,
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 500000) + 100000
    });
  }
  
  // Add prediction points for next 2 hours (4 30-min intervals after market close)
  const lastDataPoint = dataPoints[dataPoints.length - 1];
  const lastDateTime = new Date(lastDataPoint.date);
  const lastPrice = lastDataPoint.price as number;
  
  // Generate predictions
  for (let i = 1; i <= 4; i++) {
    const time = new Date(lastDateTime);
    time.setMinutes(time.getMinutes() + (i * 30));
    
    // Generate a random prediction with slight bias toward closing price
    const randomFactor = (Math.random() - 0.4) * volatility; // Slight upward bias
    const newPrediction = lastPrice + randomFactor;
    
    dataPoints.push({
      date: time.toISOString(),
      price: undefined,
      prediction: Math.round(newPrediction * 100) / 100,
      volume: Math.floor(Math.random() * 300000) + 50000
    });
  }
  
  return dataPoints;
};

/**
 * Generate random chart data
 */
const generateRandomChartData = (basePrice: number, days: number): ChartDataPoint[] => {
  const volatility = 2 + Math.random() * 3;
  const dataPoints: ChartDataPoint[] = [];
  let currentPrice = basePrice;
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Add random price movement
    const priceChange = (Math.random() - 0.45) * volatility;
    currentPrice += priceChange;
    
    // Ensure price never goes below minimum threshold
    if (currentPrice < basePrice * 0.9) {
      currentPrice = basePrice * 0.9 + Math.random() * 5;
    }
    
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      volume
    });
  }
  
  return dataPoints;
};

/**
 * Generate prediction data based on the last known price
 */
const generatePredictionData = (lastPrice: number, days: number, lastDate?: string): ChartDataPoint[] => {
  const predictions: ChartDataPoint[] = [];
  const startDate = lastDate ? new Date(lastDate) : new Date();
  
  // Randomly determine if we'll have an upward or downward trend
  const trendDirection = Math.random() > 0.5 ? 1 : -1;
  const trendStrength = 0.5 + Math.random() * 1.5; // Trend factor
  const volatility = 1 + Math.random() * 2; // Daily volatility
  
  let currentPrice = lastPrice;
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayString = date.toISOString().split('T')[0];
    
    // Create reasonable prediction pattern
    const baseChange = trendDirection * trendStrength * currentPrice * 0.01;
    const noise = (Math.random() - 0.5) * volatility;
    const dailyChange = baseChange + noise;
    
    // Apply the daily change
    currentPrice += dailyChange;
    
    // Ensure prediction never goes below 80% of last price
    if (currentPrice < lastPrice * 0.8) {
      currentPrice = lastPrice * 0.85 + Math.random() * lastPrice * 0.05;
    }
    
    // Ensure prediction never goes above 120% of last price (keep it realistic)
    if (currentPrice > lastPrice * 1.2) {
      currentPrice = lastPrice * 1.15 + Math.random() * lastPrice * 0.05;
    }
    
    // Make sure we never have zero or negative values
    if (currentPrice <= 0) {
      currentPrice = lastPrice * 0.9;
    }
    
    const volume = Math.floor(Math.random() * 800000) + 200000;
    
    predictions.push({
      date: dayString,
      price: undefined, // Undefined price for prediction data points
      prediction: Math.round(currentPrice * 100) / 100,
      volume
    });
  }
  
  return predictions;
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
