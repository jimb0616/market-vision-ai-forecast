
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingPlanProps {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  limitations?: string[];
  recommended?: boolean;
  onSelect?: (id: string) => void;
}

const PricingPlan = ({ 
  id,
  name, 
  price, 
  description, 
  features, 
  limitations = [], 
  recommended = false,
  onSelect 
}: PricingPlanProps) => {
  return (
    <Card className={cn(
      "h-full transition-all duration-300 flex flex-col border-blue-900/30",
      recommended ? "shadow-xl shadow-blue-500/10 scale-[1.02] border-blue-500/50 bg-market-charcoal" : "bg-market-charcoal/60"
    )}>
      {recommended && (
        <div className="bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded-b-md absolute top-0 left-1/2 transform -translate-x-1/2">
          Most Popular
        </div>
      )}
      
      <CardHeader className="pt-8">
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-300">What's included:</p>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex">
                <Check className="h-5 w-5 text-market-green mr-2 shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          
          {limitations.length > 0 && (
            <>
              <p className="text-sm font-medium text-gray-300 mt-6">Limitations:</p>
              <ul className="space-y-3">
                {limitations.map((limitation, index) => (
                  <li key={index} className="flex">
                    <X className="h-5 w-5 text-market-red mr-2 shrink-0" />
                    <span className="text-sm text-gray-400">{limitation}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-6">
        <Button 
          className={cn(
            "w-full", 
            recommended ? "bg-blue-600 hover:bg-blue-700" : "bg-market-darkBlue hover:bg-market-darkGray"
          )}
          onClick={() => onSelect && onSelect(id)}
        >
          Subscribe Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingPlan;
