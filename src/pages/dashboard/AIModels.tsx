
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const AIModels = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">AI Models</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-market-charcoal/60 border-blue-900/30">
            <CardHeader>
              <CardTitle>Standard Model</CardTitle>
              <CardDescription>Basic prediction capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Our standard AI model provides basic predictions for major market indicators and popular stocks.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-market-charcoal/60 border-blue-900/30">
            <CardHeader>
              <CardTitle>Intermediate Model</CardTitle>
              <CardDescription>Enhanced accuracy and features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                The intermediate model offers more detailed analysis with higher accuracy rates and broader market coverage.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-market-charcoal/60 border-blue-900/30 md:col-span-2">
            <CardHeader>
              <CardTitle>Advanced Model</CardTitle>
              <CardDescription>Premium AI prediction system</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Our flagship advanced model leverages deep learning algorithms to provide the highest accuracy predictions with detailed analysis of market trends and individual stocks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIModels;
