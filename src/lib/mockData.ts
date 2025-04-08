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
  }
};
