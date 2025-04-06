
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Menu, X, Search, BellRing, User, LogOut, 
  BarChart2, LineChart, Activity, PieChart, TrendingUp,
  Settings
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-market-navy flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-market-charcoal border-r border-blue-900/30">
        <div className="p-4 border-b border-blue-900/30">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart2 className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">Market<span className="text-blue-500">Oracle</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Dashboard
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/dashboard') ? 'bg-blue-900/20 text-blue-400' : 'text-gray-300 hover:bg-blue-900/10 hover:text-blue-400'}`}
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  Overview
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard/predictions" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/dashboard/predictions') ? 'bg-blue-900/20 text-blue-400' : 'text-gray-300 hover:bg-blue-900/10 hover:text-blue-400'}`}
                >
                  <LineChart className="mr-3 h-5 w-5" />
                  Predictions
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard/analytics" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/dashboard/analytics') ? 'bg-blue-900/20 text-blue-400' : 'text-gray-300 hover:bg-blue-900/10 hover:text-blue-400'}`}
                >
                  <Activity className="mr-3 h-5 w-5" />
                  Analytics
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard/portfolio" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/dashboard/portfolio') ? 'bg-blue-900/20 text-blue-400' : 'text-gray-300 hover:bg-blue-900/10 hover:text-blue-400'}`}
                >
                  <PieChart className="mr-3 h-5 w-5" />
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              AI Models
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard/models" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/dashboard/models') ? 'bg-blue-900/20 text-blue-400' : 'text-gray-300 hover:bg-blue-900/10 hover:text-blue-400'} ${isActive('/dashboard/models') ? '' : 'relative'}`}
                >
                  <TrendingUp className="mr-3 h-5 w-5" />
                  AI Models
                  {!isActive('/dashboard/models') && <span className="absolute right-2 top-2 w-2 h-2 bg-blue-600 rounded-full"></span>}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Account
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard/profile" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/dashboard/profile') ? 'bg-blue-900/20 text-blue-400' : 'text-gray-300 hover:bg-blue-900/10 hover:text-blue-400'}`}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard/settings" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/dashboard/settings') ? 'bg-blue-900/20 text-blue-400' : 'text-gray-300 hover:bg-blue-900/10 hover:text-blue-400'}`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-blue-900/10 hover:text-blue-400"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-blue-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-gray-400">Advanced Plan</p>
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-market-charcoal border-b border-blue-900/30">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center md:hidden">
              <Link to="/" className="flex items-center space-x-2">
                <BarChart2 className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white">Market<span className="text-blue-500">Oracle</span></span>
              </Link>
            </div>
            
            <div className="w-full max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for stocks..."
                  className="pl-10 bg-market-darkBlue border-blue-900/30"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <button className="p-2 text-gray-400 hover:text-white relative">
                <BellRing className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              </button>
              
              <div className="hidden md:block ml-4 pl-4 border-l border-blue-900/30">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-market-navy">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
