
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
  
  // Fetch fresh data
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Update cache
  cache.set(cacheKey, { data, timestamp: now });
  
  return data as T;
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
    
    const data = await getWithCache<CandleData>(url, cacheKey);
    
    // Format data for the chart component
    if (data.s === 'ok' && data.t && data.c) {
      return data.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        price: data.c[index],  // Price is now required as per mockData.ts definition
        volume: data.v ? data.v[index] : undefined
      }));
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error);
    throw error;
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
    throw error;
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
    getStockQuote(symbol),
    getCompanyProfile(symbol),
    getStockCandles(symbol)
  ]);
};
