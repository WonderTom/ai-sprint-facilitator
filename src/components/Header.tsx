import React from "react";
import { Zap, Play, BarChart2, Settings, HelpCircle, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type View = "dashboard" | "sprint" | "analytics" | "settings" | "help";

interface HeaderProps {
  navigate: (view: View) => void;
  currentView: View;
}

export const Header: React.FC<HeaderProps> = ({ navigate, currentView }) => {
  const navItems = [
    { id: "dashboard" as const, icon: Zap, label: "Dashboard" },
    { id: "sprint" as const, icon: Play, label: "Sprint" },
    { id: "analytics" as const, icon: BarChart2, label: "Analytics" },
    { id: "settings" as const, icon: Settings, label: "Integrations" },
    { id: "help" as const, icon: HelpCircle, label: "Help" },
  ];

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">
              AI Sprint Facilitator
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                className="flex items-center space-x-2"
                size="sm"
                variant={currentView === item.id ? "default" : "ghost"}
                onClick={() => navigate(item.id)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
          <div className="md:hidden">
            <Select
              value={currentView}
              onValueChange={(value) => navigate(value as View)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                {navItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};
