
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

// Get current stock quote
export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const response = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock quote: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

// Get company profile
export const getCompanyProfile = async (symbol: string): Promise<CompanyProfile> => {
  try {
    const response = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch company profile: ${response.status}`);
    }
    
    return await response.json();
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
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock candles: ${response.status}`);
    }
    
    const data: CandleData = await response.json();
    
    // Format data for the chart component
    if (data.s === 'ok' && data.t && data.c) {
      return data.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        price: data.c[index],
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
    const response = await fetch(
      `${BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch company news: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    throw error;
  }
};

// Get market sentiment
export const getMarketSentiment = async (symbol: string) => {
  try {
    const response = await fetch(`${BASE_URL}/news-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch market sentiment: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching sentiment for ${symbol}:`, error);
    throw error;
  }
};

// Get stock recommendation trends
export const getRecommendationTrends = async (symbol: string) => {
  try {
    const response = await fetch(`${BASE_URL}/stock/recommendation?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recommendation trends: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recommendations for ${symbol}:`, error);
    throw error;
  }
};
