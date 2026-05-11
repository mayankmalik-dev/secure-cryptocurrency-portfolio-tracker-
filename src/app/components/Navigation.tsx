import { Link, useLocation, useNavigate } from "react-router";
import { Home, LayoutDashboard, Briefcase, Newspaper, Bell, User, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCurrency } from "../context/CurrencyContext";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currency, symbol, toggleCurrency } = useCurrency();
  const isHomePage = location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Successfully logged out');
    navigate('/auth');
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/portfolio", label: "Portfolio", icon: Briefcase },
    { path: "/news", label: "News", icon: Newspaper },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors ${
      isHomePage 
        ? "bg-transparent backdrop-blur-md border-white/5" 
        : "bg-card border-border"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">₿</span>
            </div>
            <span className="text-xl font-bold text-foreground">CryptoFolio</span>
          </Link>

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-md transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-2 ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleCurrency}
              className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-xs font-bold text-primary hover:bg-secondary transition-colors"
            >
              {currency.toUpperCase()} ({symbol})
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <button 
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}