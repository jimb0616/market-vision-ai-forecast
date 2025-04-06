
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <Card className="bg-market-charcoal/60 border-blue-900/30">
          <CardHeader>
            <CardTitle>Market Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Explore advanced analytics and market trends to inform your investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
