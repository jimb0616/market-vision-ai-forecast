
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, Cpu, Lock, Shield, LineChart, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StockPredictionCard from "@/components/StockPredictionCard";
import StockChart from "@/components/StockChart";
import { popularStocks, generateChartData } from "@/lib/mockData";

const testimonials = [
  {
    id: 1,
    content: "Market Oracle's predictions have been astonishingly accurate. I've seen a 27% increase in my portfolio since subscribing just 3 months ago.",
    author: "Sarah J.",
    role: "Day Trader",
  },
  {
    id: 2,
    content: "The AI prediction models are incredibly sophisticated. As a professional fund manager, I've integrated Market Oracle into our daily analysis workflow.",
    author: "Michael T.",
    role: "Hedge Fund Manager",
  },
  {
    id: 3,
    content: "As a beginner investor, the intuitive interface and clear predictions gave me the confidence to make my first trades. The results speak for themselves!",
    author: "Alex K.",
    role: "Retail Investor",
  },
];

const Index = () => {
  const [chartData, setChartData] = useState({});
  
  useEffect(() => {
    // Generate mock chart data for each stock
    const stockChartData = {};
    
    popularStocks.forEach(stock => {
      stockChartData[stock.symbol] = generateChartData(stock.currentPrice, 0.03);
    });
    
    setChartData(stockChartData);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-market-navy">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
        <div className="data-line animate-pulse-slow absolute top-1/4 left-0 right-0"></div>
        <div className="data-line animate-pulse-slow absolute top-3/4 left-0 right-0"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="text-gradient glow">AI-Powered</span> Stock Market Predictions
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
                Predict Tomorrow, Trade Today. Our advanced AI algorithms analyze market patterns to forecast stock movements with unprecedented accuracy.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/plans">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-900/20">
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
              <div className="mt-6 text-sm text-gray-400">
                No credit card required for trial. Cancel anytime.
              </div>
            </div>
            
            <div className="flex-1 glass-card rounded-xl overflow-hidden p-4 w-full max-w-xl">
              {chartData['AAPL'] && (
                <StockChart 
                  data={chartData['AAPL']} 
                  symbol="AAPL" 
                  color="#3B82F6" 
                  height={350}
                  showFullData={true}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-market-darkBlue">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Powered by Advanced Technology
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with comprehensive market data to deliver accurate stock predictions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 rounded-xl backdrop-blur-md">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Predictive Analytics</h3>
              <p className="text-gray-400">
                Our AI models analyze thousands of data points to predict market movements with high confidence.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl backdrop-blur-md">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Machine Learning</h3>
              <p className="text-gray-400">
                Self-improving algorithms that learn from market patterns and continuously enhance prediction accuracy.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl backdrop-blur-md">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time Data</h3>
              <p className="text-gray-400">
                Instant access to live market data, news sentiment analysis, and price movements.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl backdrop-blur-md">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Risk Assessment</h3>
              <p className="text-gray-400">
                Sophisticated risk evaluation tools to help you make informed trading decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stock Predictions Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Recent Stock Predictions
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              See how our AI models are performing with these recent predictions from top stocks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularStocks.slice(0, 3).map((stock) => (
              <StockPredictionCard key={stock.id} stock={stock} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Access All Predictions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-market-darkBlue">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How Market Oracle Works
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform simplifies stock prediction in three easy steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart2 className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Data Analysis</h3>
              <p className="text-gray-400">
                Our system continuously analyzes market data, news, and historical patterns to identify potential trends.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cpu className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. AI Prediction</h3>
              <p className="text-gray-400">
                Advanced machine learning algorithms generate predictions with confidence scores for future price movements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Smart Trading</h3>
              <p className="text-gray-400">
                Use our predictions to inform your trading decisions, with detailed insights to support each forecast.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Trusted by Traders Worldwide
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              See what our users are saying about our AI-powered stock predictions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="glass-card p-6 rounded-xl backdrop-blur-md"
              >
                <div className="space-y-4">
                  <p className="text-gray-300 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-blue-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Start Predicting the Market?
            </h2>
            <p className="mt-6 text-xl text-gray-300">
              Join thousands of traders who are already leveraging our AI-powered predictions to make smarter investment decisions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/plans">
                <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-900/20">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Start with a 7-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
