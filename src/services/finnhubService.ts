
const FINNHUB_API_KEY = 'cvpd97hr01qve7io7tpgcvpd97hr01qve7io7tq0';
const BASE_URL = 'https://finnhub.io/api/v1';

// Types for Finnhub API responses
export interface StockQuote {
  o: number;  // Open price of the day
  h: number;  // High price of the day
  l: number;  // Low price of the day
  c: number;  // Current price
  pc: number; // Previous close price
  d: number;  // Change
  dp: number; // Percent change
}

export interface CompanyProfile {
  name: string;
  ticker: string;
  logo: string;
  marketCapitalization: number;
  currency: string;
  exchange: string;
  industry: string;
  sector: string;
}

export interface CandleData {
  c: number[];  // Close prices
  h: number[];  // High prices
  l: number[];  // Low prices
  o: number[];  // Open prices
  s: string;    // Status
  t: number[];  // Timestamps
  v: number[];  // Volumes
}

// Import ChartDataPoint from mockData to ensure we're using the same type
import { ChartDataPoint } from "@/lib/mockData";

// Cache control to improve performance and avoid rate limiting
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minute cache

// Helper function to get data with caching
const getWithCache = async <T>(url: string, cacheKey: string): Promise<T> => {
  const now = Date.now();
  const cachedData = cache.get(cacheKey);
  
  // Return cached data if valid
  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    return cachedData.data as T;
  }
  
  try {
    // Fetch fresh data
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} for URL: ${url}`);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API-level errors
    if (data.error) {
      console.error(`API returned error: ${data.error}`);
      throw new Error(data.error);
    }
    
    // Update cache
    cache.set(cacheKey, { data, timestamp: now });
    
    return data as T;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

// Get current stock quote
export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const url = `${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const cacheKey = `quote_${symbol}`;
    
    return await getWithCache<StockQuote>(url, cacheKey);
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

// Get company profile
export const getCompanyProfile = async (symbol: string): Promise<CompanyProfile> => {
  try {
    const url = `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const cacheKey = `profile_${symbol}`;
    
    return await getWithCache<CompanyProfile>(url, cacheKey);
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error);
    throw error;
  }
};

// Generate mock candle data when API limits are hit
const generateMockCandleData = (symbol: string, days: number = 90): ChartDataPoint[] => {
  // Get quote for the last price
  let startPrice = 150; // Default start price
  let lastPrice = 150;
  
  try {
    // Try to get the actual quote first
    const quote = cache.get(`quote_${symbol}`)?.data as StockQuote;
    if (quote) {
      lastPrice = quote.c;
      startPrice = quote.pc;
    }
  } catch (e) {
    console.log("Using default prices for mock data");
  }
  
  const today = new Date();
  const result: ChartDataPoint[] = [];
  
  // Generate past data
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Create some randomness but trend toward the last price
    const randomWalk = Math.random() * 2 - 1; // Between -1 and 1
    const priceChange = (randomWalk * 2) + ((lastPrice - startPrice) / days) * (days - i) / 5;
    const dayPrice = startPrice + ((lastPrice - startPrice) * (days - i) / days) + priceChange;
    
    result.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(1, parseFloat(dayPrice.toFixed(2)))
      // Don't include volume as it's not in the ChartDataPoint interface
    });
  }
  
  // Generate future data as predictions
  const lastRealPrice = result[result.length - 1].price;
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Simple random walk for predictions
    const randomChange = (Math.random() * 0.04 - 0.02) * lastRealPrice; // -2% to +2%
    const predictedPrice = lastRealPrice * (1 + (Math.random() * 0.01 - 0.005) * i) + randomChange;
    
    result.push({
      date: date.toISOString().split('T')[0],
      prediction: parseFloat(predictedPrice.toFixed(2))
    });
  }
  
  return result;
};

// Get stock candles (historical data) and format to ChartDataPoint array
export const getStockCandles = async (
  symbol: string, 
  resolution: string = 'D', // D for daily
  from: number = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000), // 90 days ago
  to: number = Math.floor(Date.now() / 1000) // Now
): Promise<ChartDataPoint[]> => {
  try {
    const url = `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
    const cacheKey = `candles_${symbol}_${resolution}_${from}_${to}`;
    
    // First, try to get from cache
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return cachedData.data as ChartDataPoint[];
    }
    
    // Fetch from API
    try {
      const response = await fetch(url);
      
      // If API returns an error, fall back to mock data
      if (!response.ok || response.status === 403) {
        console.log(`API limit reached or access denied for ${symbol}, using mock data`);
        const mockData = generateMockCandleData(symbol);
        cache.set(cacheKey, { data: mockData, timestamp: Date.now() });
        return mockData;
      }
      
      const data = await response.json() as CandleData;
      
      // Format data for the chart component
      if (data.s === 'ok' && data.t && data.c) {
        const formattedData = data.t.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          price: data.c[index]
          // Don't include volume as it's not in the ChartDataPoint interface
        }));
        
        // Add prediction data for future dates
        const lastPrice = formattedData[formattedData.length - 1].price;
        const today = new Date();
        
        for (let i = 1; i <= 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          
          // Simple random walk for predictions
          const randomChange = (Math.random() * 0.04 - 0.02) * lastPrice; // -2% to +2%
          const predictedPrice = lastPrice * (1 + (Math.random() * 0.01 - 0.005) * i) + randomChange;
          
          formattedData.push({
            date: date.toISOString().split('T')[0],
            prediction: parseFloat(predictedPrice.toFixed(2))
          });
        }
        
        cache.set(cacheKey, { data: formattedData, timestamp: Date.now() });
        return formattedData;
      }
      
      // If data is not in expected format, fall back to mock data
      const mockData = generateMockCandleData(symbol);
      cache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      return mockData;
    } catch (error) {
      console.error(`Error fetching candles for ${symbol}:`, error);
      // Fall back to mock data on error
      const mockData = generateMockCandleData(symbol);
      cache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      return mockData;
    }
  } catch (error) {
    console.error(`Error in getStockCandles for ${symbol}:`, error);
    return generateMockCandleData(symbol);
  }
};

// Get company news
export const getCompanyNews = async (
  symbol: string,
  from: string = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 30 days ago
  to: string = new Date().toISOString().slice(0, 10) // Today
) => {
  try {
    const url = `${BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
    const cacheKey = `news_${symbol}_${from}_${to}`;
    
    return await getWithCache(url, cacheKey);
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    throw error;
  }
};

// Get market sentiment
export const getMarketSentiment = async (symbol: string) => {
  try {
    const url = `${BASE_URL}/news-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const cacheKey = `sentiment_${symbol}`;
    
    return await getWithCache(url, cacheKey);
  } catch (error) {
    console.error(`Error fetching sentiment for ${symbol}:`, error);
    return { sentiment: { bullishPercent: 50 } }; // Return fallback data
  }
};

// Get stock recommendation trends
export const getRecommendationTrends = async (symbol: string) => {
  try {
    const url = `${BASE_URL}/stock/recommendation?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const cacheKey = `recommendations_${symbol}`;
    
    return await getWithCache(url, cacheKey);
  } catch (error) {
    console.error(`Error fetching recommendations for ${symbol}:`, error);
    throw error;
  }
};

// Force refresh cached data
export const refreshStockData = (symbol: string) => {
  // Clear all cached data for this symbol
  const keysToDelete: string[] = [];
  
  cache.forEach((_, key) => {
    if (key.includes(symbol)) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => cache.delete(key));
  
  // Return a promise that resolves when all data is refreshed
  return Promise.all([
    getStockQuote(symbol).catch(() => null),
    getCompanyProfile(symbol).catch(() => null),
    getStockCandles(symbol).catch(() => generateMockCandleData(symbol))
  ]);
};
