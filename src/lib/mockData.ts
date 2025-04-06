
export interface StockData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  previousClose: number;
  percentChange: number;
  predictionConfidence: number;
  predictionDirection: 'up' | 'down';
  marketCap: string;
  volume: string;
}

export interface ChartDataPoint {
  date: string;
  price: number;
  prediction?: number;
}

// Generate random chart data for the last 30 days
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
    });
  }
  
  // Add predictions for future days
  const lastPrice = data[data.length - 1].price;
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
    });
  }
  
  return data;
}

export const popularStocks: StockData[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    currentPrice: 182.89,
    previousClose: 180.25,
    percentChange: 1.46,
    predictionConfidence: 87,
    predictionDirection: 'up',
    marketCap: '$2.87T',
    volume: '56.7M',
  },
  {
    id: '2',
    name: 'Tesla, Inc.',
    symbol: 'TSLA',
    currentPrice: 232.46,
    previousClose: 241.83,
    percentChange: -3.87,
    predictionConfidence: 74,
    predictionDirection: 'down',
    marketCap: '$738.5B',
    volume: '112.3M',
  },
  {
    id: '3',
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    currentPrice: 388.47,
    previousClose: 385.85,
    percentChange: 0.68,
    predictionConfidence: 91,
    predictionDirection: 'up',
    marketCap: '$2.89T',
    volume: '23.1M',
  },
  {
    id: '4',
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    currentPrice: 178.15,
    previousClose: 176.53,
    percentChange: 0.92,
    predictionConfidence: 82,
    predictionDirection: 'up',
    marketCap: '$1.84T',
    volume: '45.6M',
  },
  {
    id: '5',
    name: 'Nvidia Corp.',
    symbol: 'NVDA',
    currentPrice: 896.48,
    previousClose: 911.29,
    percentChange: -1.62,
    predictionConfidence: 68,
    predictionDirection: 'down',
    marketCap: '$2.21T',
    volume: '51.2M',
  },
  {
    id: '6',
    name: 'Meta Platforms Inc.',
    symbol: 'META',
    currentPrice: 478.22,
    previousClose: 473.32,
    percentChange: 1.04,
    predictionConfidence: 76,
    predictionDirection: 'up',
    marketCap: '$1.22T',
    volume: '18.7M',
  },
];

export const subscriptionPlans = [
  {
    id: 'standard',
    name: 'Standard',
    price: 100,
    description: 'Perfect for beginners looking to explore stock predictions.',
    features: [
      'Access to basic predictions for top 10 stocks',
      'Daily market summaries',
      'Basic technical indicators',
      'Email alerts for significant movements',
      '24-hour prediction window',
    ],
    limitations: [
      'Limited to 10 stock predictions',
      'Basic AI model only',
      'No custom alerts',
    ],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    price: 200,
    description: 'For active traders who need more comprehensive data.',
    features: [
      'All Standard features',
      'Access to 50 stock predictions',
      'Intermediate prediction models',
      'Market sector analysis',
      '72-hour prediction window',
      'Custom watchlists',
      'API access (limited)',
    ],
    limitations: [
      'Limited to 50 stocks',
      'No advanced AI models',
    ],
    recommended: true,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 300,
    description: 'Professional-grade predictions for serious investors.',
    features: [
      'All Intermediate features',
      'Full access to all prediction models',
      'Premium data visualizations',
      '200+ stock predictions',
      'Custom alerts and notifications',
      'One-week prediction window',
      'Full API access',
      'Portfolio integration',
      'Historical prediction analysis',
    ],
    limitations: [],
  },
];

export const marketSentiment = [
  { sector: 'Technology', sentiment: 0.75 },
  { sector: 'Healthcare', sentiment: 0.62 },
  { sector: 'Energy', sentiment: -0.32 },
  { sector: 'Financial', sentiment: 0.48 },
  { sector: 'Consumer Discretionary', sentiment: 0.21 },
  { sector: 'Consumer Staples', sentiment: 0.54 },
  { sector: 'Utilities', sentiment: -0.14 },
  { sector: 'Real Estate', sentiment: -0.22 },
  { sector: 'Materials', sentiment: 0.37 },
  { sector: 'Industrials', sentiment: 0.29 },
  { sector: 'Communication Services', sentiment: 0.68 },
];
