
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Menu, 
  ChevronLeft 
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      name: 'Resume Screener',
      path: '/resume-screener',
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: 'Interviewer Availability',
      path: '/interviewer-availability',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: 'Candidate Slot Selection',
      path: '/candidate-slot-selection',
      icon: <Clock className="h-5 w-5" />
    },
    {
      name: 'HR Panel',
      path: '/hr-panel',
      icon: <Users className="h-5 w-5" />
    }
  ];

  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 h-screen flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="font-bold text-hiring-primary text-lg">HireFlow</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-gray-500 hover:text-hiring-primary"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path 
                    ? "bg-hiring-light text-hiring-primary" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-hiring-dark"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-hiring-secondary flex items-center justify-center text-white">
              <span className="text-sm font-medium">HR</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">HR Admin</p>
              <p className="text-xs text-gray-500">admin@hireflow.com</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-hiring-secondary flex items-center justify-center text-white">
              <span className="text-sm font-medium">HR</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
