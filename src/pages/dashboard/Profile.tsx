
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        <Card className="bg-market-charcoal/60 border-blue-900/30">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" htmlFor="firstName">First Name</label>
                  <Input id="firstName" placeholder="John" defaultValue="John" className="bg-market-darkBlue border-blue-900/30" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" htmlFor="lastName">Last Name</label>
                  <Input id="lastName" placeholder="Doe" defaultValue="Doe" className="bg-market-darkBlue border-blue-900/30" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" defaultValue="john.doe@example.com" className="bg-market-darkBlue border-blue-900/30" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" htmlFor="plan">Subscription Plan</label>
                  <Input id="plan" defaultValue="Advanced" readOnly className="bg-market-darkBlue border-blue-900/30" />
                </div>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700 mt-4">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
