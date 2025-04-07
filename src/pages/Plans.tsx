import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingPlan from "@/components/PricingPlan";
import { subscriptionPlans } from "@/lib/mockData";
import { useToast } from "@/components/ui/use-toast";

const Plans = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();
  
  const yearlyDiscount = 0.2; // 20% discount for yearly billing
  
  const handleSelectPlan = (planId: string) => {
    // Simulate subscription process
    toast({
      title: "Subscription process started",
      description: `You selected the ${planId} plan. In a real app, this would take you to the payment page.`,
    });
    
    // In a real app, you would:
    // 1. Redirect to a checkout page
    // 2. Process payment
    // 3. Redirect to dashboard after successful payment
    
    // For demo, redirect to dashboard after a delay
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-market-navy">
      <Navbar />
      
      <main className="flex-grow py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-400 mb-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">Choose Your Subscription Plan</h1>
            <p className="text-xl text-gray-300">
              Select the perfect plan to unlock powerful AI stock market predictions and trading insights.
            </p>
          </div>
          
          {/* Billing toggle */}
          <div className="flex justify-center mb-12">
            <Tabs 
              defaultValue="monthly" 
              value={billingPeriod}
              onValueChange={(value) => setBillingPeriod(value as "monthly" | "yearly")}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly Billing
                  <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Pricing plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <PricingPlan
                key={plan.id}
                id={plan.id}
                name={plan.name}
                price={billingPeriod === "yearly" 
                  ? Math.round(plan.price * 12 * (1 - yearlyDiscount)) 
                  : plan.price}
                description={plan.description}
                features={plan.features}
                limitations={plan.limitations}
                recommended={plan.recommended}
                billingPeriod={billingPeriod}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
          
          {/* Features comparison */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Detailed Features Comparison
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-market-darkBlue/60 rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-blue-900/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">Standard</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">Intermediate</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">Advanced</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-blue-900/30">
                    <td className="px-6 py-4 text-sm text-gray-300">Stock predictions</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">Top 10 stocks</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">50 stocks</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">200+ stocks</td>
                  </tr>
                  <tr className="border-b border-blue-900/30">
                    <td className="px-6 py-4 text-sm text-gray-300">AI prediction models</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">Basic</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">Intermediate</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">Advanced</td>
                  </tr>
                  <tr className="border-b border-blue-900/30">
                    <td className="px-6 py-4 text-sm text-gray-300">Prediction window</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">24 hours</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">72 hours</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">7 days</td>
                  </tr>
                  <tr className="border-b border-blue-900/30">
                    <td className="px-6 py-4 text-sm text-gray-300">Market sentiment analysis</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">
                      <CheckCircle className="inline-block h-5 w-5 text-market-green" />
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">
                      <CheckCircle className="inline-block h-5 w-5 text-market-green" />
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">
                      <CheckCircle className="inline-block h-5 w-5 text-market-green" />
                    </td>
                  </tr>
                  <tr className="border-b border-blue-900/30">
                    <td className="px-6 py-4 text-sm text-gray-300">Custom alerts</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">—</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">
                      <CheckCircle className="inline-block h-5 w-5 text-market-green" />
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">
                      <CheckCircle className="inline-block h-5 w-5 text-market-green" />
                    </td>
                  </tr>
                  <tr className="border-b border-blue-900/30">
                    <td className="px-6 py-4 text-sm text-gray-300">API access</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">—</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">Limited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">Full access</td>
                  </tr>
                  <tr className="border-b border-blue-900/30">
                    <td className="px-6 py-4 text-sm text-gray-300">Historical prediction analysis</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">—</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">—</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">
                      <CheckCircle className="inline-block h-5 w-5 text-market-green" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-300">Portfolio integration</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">—</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">—</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-300">
                      <CheckCircle className="inline-block h-5 w-5 text-market-green" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* FAQ section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-market-darkBlue/60 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Can I switch plans later?</h3>
                <p className="text-gray-300">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              
              <div className="bg-market-darkBlue/60 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-300">
                  We accept all major credit cards, PayPal, and cryptocurrency payments.
                </p>
              </div>
              
              <div className="bg-market-darkBlue/60 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
                <p className="text-gray-300">
                  Yes, all plans come with a 7-day free trial. You can cancel anytime during the trial period without being charged.
                </p>
              </div>
              
              <div className="bg-market-darkBlue/60 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">How accurate are the predictions?</h3>
                <p className="text-gray-300">
                  Our AI models have historically shown accuracy rates between 75-92% depending on market conditions and the specific stocks. Each prediction comes with a confidence score to help you assess reliability.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="text-xl text-gray-300 mb-6">
              Not sure which plan is right for you?
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Contact Sales for Custom Solutions
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Plans;
