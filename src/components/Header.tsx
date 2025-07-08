import React from "react";
import { ArrowLeft, Bot, BarChart2, Settings, HelpCircle, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type View = "dashboard" | "sprint" | "analytics" | "settings" | "help" | "demo";

interface HeaderProps {
  navigate: (view: View) => void;
  currentView: View;
  user?: {
    name: string;
    role: string;
    organization?: string;
  };
  sprintName?: string;
  showBackButton?: boolean;
  // Demo phase selector props
  currentPhase?: number;
  onPhaseChange?: (phase: number) => void;
  sprintPhases?: Array<{ name: string; description: string; progress: number }>;
}

export const Header: React.FC<HeaderProps> = ({ 
  navigate, 
  currentView, 
  user,
  sprintName,
  showBackButton = false,
  currentPhase,
  onPhaseChange,
  sprintPhases
}) => {
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isInSprint = currentView === "sprint" || currentView === "demo";
  const isHome = currentView === "dashboard";

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Back button + Context */}
          <div className="flex items-center space-x-4">
            {/* Back button when in sprint/demo */}
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            )}
            
            {/* Logo/Brand - always shown on home, or when no back button */}
            {(isHome || !showBackButton) && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">AI Sprint Facilitator</h1>
                </div>
              </div>
            )}

            {/* Sprint context when in active sprint */}
            {isInSprint && sprintName && (
              <div className="flex items-center space-x-3">
                <div className="h-6 w-px bg-border" />
                <div>
                  <p className="text-sm font-medium">{sprintName}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentView === "demo" ? "Demo Mode" : "Active Sprint"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-sm">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.role}
                        {user.organization && ` • ${user.organization}`}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Demo Phase Selector - only show in demo mode */}
                  {currentView === "demo" && sprintPhases && onPhaseChange && typeof currentPhase === 'number' && (
                    <>
                      <DropdownMenuLabel>Demo Phase</DropdownMenuLabel>
                      {sprintPhases.map((phase, index) => (
                        <DropdownMenuItem 
                          key={index}
                          onClick={() => onPhaseChange(index)}
                          className={currentPhase === index ? "bg-accent" : ""}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm">{index + 1}. {phase.name}</span>
                            {currentPhase === index && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  {/* Only show these when not in active sprint */}
                  {!isInSprint && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("analytics")}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        <span>Sprint Analytics</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings & Integrations</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={() => navigate("help")}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
