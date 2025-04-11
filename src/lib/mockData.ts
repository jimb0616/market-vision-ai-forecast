
// Define ChartDataPoint interface
export interface ChartDataPoint {
  date: string;
  price?: number;
  prediction?: number;
  volume?: number;
}

// Define Stock Data interface
export interface StockData {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
  percentChange: number;
  marketCap: string;
  volume: string;
  predictionDirection: 'up' | 'down';
  predictionConfidence: number;
  sector: string;
  industry: string;
}

// Define popular stocks
export const popularStocks: StockData[] = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 180.25,
    percentChange: 1.32,
    marketCap: '$2.9T',
    volume: '68.2M',
    predictionDirection: 'up',
    predictionConfidence: 85,
    sector: 'Technology',
    industry: 'Consumer Electronics'
  },
  {
    id: 2,
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currentPrice: 235.78,
    percentChange: -1.36,
    marketCap: '$748.4B',
    volume: '103.5M',
    predictionDirection: 'down',
    predictionConfidence: 76,
    sector: 'Automotive',
    industry: 'Electric Vehicles'
  },
  {
    id: 3,
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 372.45,
    percentChange: 1.45,
    marketCap: '$2.8T',
    volume: '25.7M',
    predictionDirection: 'up',
    predictionConfidence: 91,
    sector: 'Technology',
    industry: 'Software'
  },
  {
    id: 4,
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    currentPrice: 182.34,
    percentChange: 1.04,
    marketCap: '$1.9T',
    volume: '42.1M',
    predictionDirection: 'up',
    predictionConfidence: 78,
    sector: 'Consumer Services',
    industry: 'E-Commerce'
  },
  {
    id: 5,
    symbol: 'GOOG',
    name: 'Alphabet Inc.',
    currentPrice: 145.87,
    percentChange: 0.66,
    marketCap: '$1.85T',
    volume: '18.3M',
    predictionDirection: 'up',
    predictionConfidence: 82,
    sector: 'Technology',
    industry: 'Internet Content'
  },
  {
    id: 6,
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    currentPrice: 512.74,
    percentChange: 2.35,
    marketCap: '$1.3T',
    volume: '15.7M',
    predictionDirection: 'up',
    predictionConfidence: 87,
    sector: 'Technology',
    industry: 'Social Media'
  }
];

// Define generateChartData function here
export function generateChartData(basePrice: number, volatility: number = 0.02, daysCount: number = 30): ChartDataPoint[] {
  let currentPrice = basePrice;
  const data: ChartDataPoint[] = [];
  
  const today = new Date();
  
  for (let i = daysCount; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random price movement
    const change = currentPrice * (Math.random() * volatility * 2 - volatility);
    currentPrice += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
  }
  
  // Add predictions for future days
  const lastPrice = data[data.length - 1].price as number;
  let predictionPrice = lastPrice;
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Random price movement with a slight upward bias
    const change = predictionPrice * (Math.random() * volatility * 2 - volatility * 0.8);
    predictionPrice += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: undefined,
      prediction: parseFloat(predictionPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 800000) + 200000
    });
  }
  
  return data;
}

// Define mockCandles object using generateChartData
export const mockCandles = {
  AAPL: {
    c: generateChartData(180).map((d) => d.price ?? 0),
    h: generateChartData(180).map((d) => (d.price ?? 0) + 2),
    l: generateChartData(180).map((d) => (d.price ?? 0) - 2),
    o: generateChartData(180).map((d) => (d.price ?? 0) - 1),
    s: "ok",
    t: generateChartData(180).map((_, i) => Math.floor(Date.now() / 1000) - (30 - i) * 86400),
    v: generateChartData(180).map(() => Math.floor(Math.random() * 1000000)),
  },
  TSLA: {
    c: generateChartData(230).map((d) => d.price ?? 0),
    h: generateChartData(230).map((d) => (d.price ?? 0) + 2),
    l: generateChartData(230).map((d) => (d.price ?? 0) - 2),
    o: generateChartData(230).map((d) => (d.price ?? 0) - 1),
    s: "ok",
    t: generateChartData(230).map((_, i) => Math.floor(Date.now() / 1000) - (30 - i) * 86400),
    v: generateChartData(230).map(() => Math.floor(Math.random() * 1000000)),
  },
  MSFT: {
    c: generateChartData(372).map((d) => d.price ?? 0),
    h: generateChartData(372).map((d) => (d.price ?? 0) + 3),
    l: generateChartData(372).map((d) => (d.price ?? 0) - 3),
    o: generateChartData(372).map((d) => (d.price ?? 0) - 1),
    s: "ok",
    t: generateChartData(372).map((_, i) => Math.floor(Date.now() / 1000) - (30 - i) * 86400),
    v: generateChartData(372).map(() => Math.floor(Math.random() * 1000000)),
  },
  AMZN: {
    c: generateChartData(182).map((d) => d.price ?? 0),
    h: generateChartData(182).map((d) => (d.price ?? 0) + 2),
    l: generateChartData(182).map((d) => (d.price ?? 0) - 2),
    o: generateChartData(182).map((d) => (d.price ?? 0) - 1),
    s: "ok",
    t: generateChartData(182).map((_, i) => Math.floor(Date.now() / 1000) - (30 - i) * 86400),
    v: generateChartData(182).map(() => Math.floor(Math.random() * 1000000)),
  },
  GOOG: {
    c: generateChartData(145).map((d) => d.price ?? 0),
    h: generateChartData(145).map((d) => (d.price ?? 0) + 1.5),
    l: generateChartData(145).map((d) => (d.price ?? 0) - 1.5),
    o: generateChartData(145).map((d) => (d.price ?? 0) - 0.5),
    s: "ok",
    t: generateChartData(145).map((_, i) => Math.floor(Date.now() / 1000) - (30 - i) * 86400),
    v: generateChartData(145).map(() => Math.floor(Math.random() * 1000000)),
  },
  META: {
    c: generateChartData(512).map((d) => d.price ?? 0),
    h: generateChartData(512).map((d) => (d.price ?? 0) + 4),
    l: generateChartData(512).map((d) => (d.price ?? 0) - 4),
    o: generateChartData(512).map((d) => (d.price ?? 0) - 2),
    s: "ok",
    t: generateChartData(512).map((_, i) => Math.floor(Date.now() / 1000) - (30 - i) * 86400),
    v: generateChartData(512).map(() => Math.floor(Math.random() * 1000000)),
  }
};
