import React, { useState, useEffect } from "react";
import { Users, Crown, Zap, Clock, Play, Pause, CheckCircle2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DemoChatInterface } from "./DemoChatInterface";
import { PhaseDetailModal } from "./PhaseDetailModal";

type View = "dashboard" | "sprint" | "analytics" | "settings" | "help" | "demo";

interface DemoViewProps {
  navigate: (view: View) => void;
  user?: {
    name: string;
    role: string;
    organization?: string;
  };
  currentPhase: number;
  onPhaseChange: (phase: number) => void;
  sprintPhases: Array<{ name: string; description: string; progress: number }>;
}

export interface MockUser {
  id: string;
  name: string;
  role: string;
  status: "online" | "typing" | "away" | "offline";
  isHost?: boolean;
  avatar: string;
  gender?: 'male' | 'female';
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    status: "online",
    isHost: true,
    avatar: "SC",
    gender: "female"
  },
  {
    id: "2", 
    name: "Mike Johnson",
    role: "UX Designer",
    status: "online",
    avatar: "MJ",
    gender: "male"
  },
  {
    id: "3",
    name: "Elena Rodriguez", 
    role: "Frontend Developer",
    status: "typing",
    avatar: "ER",
    gender: "female"
  },
  {
    id: "4",
    name: "David Kim",
    role: "Business Analyst", 
    status: "online",
    avatar: "DK",
    gender: "male"
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "QA Engineer",
    status: "away",
    avatar: "LT",
    gender: "female"
  }
];



const phaseQuestions = [
  {
    question: "What is the main challenge students face with traditional loan applications?",
    answer: "Complex financial jargon and intimidating processes that don't match student reality"
  },
  {
    question: "What are the key user needs we identified for student borrowers?",
    answer: "Educational guidance, confidence building, and reward systems that motivate responsible behavior"
  },
  {
    question: "What solutions have we brainstormed so far?",
    answer: "Gamified financial literacy, partner reward ecosystem, and co-signer collaboration tools"
  }
];

export const DemoView: React.FC<DemoViewProps> = ({ 
  navigate, 
  user, 
  currentPhase, 
  onPhaseChange, 
  sprintPhases 
}) => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [showPhaseDetails, setShowPhaseDetails] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [dynamicProgress, setDynamicProgress] = useState<number>(0);

  // Reset progress when phase changes
  useEffect(() => {
    setDynamicProgress(0);
  }, [currentPhase]);

  // Handle progress updates from chat
  const handleProgressUpdate = (progress: number) => {
    setDynamicProgress(progress);
  };

  // Timer simulation
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "typing": return "bg-blue-500 animate-pulse";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getUserStatusText = (status: string) => {
    switch (status) {
      case "online": return "Online";
      case "typing": return "Typing...";
      case "away": return "Away";
      case "offline": return "Offline";
      default: return "Unknown";
    }
  };

  return (
    <div className="h-full flex bg-background">
      {/* Enhanced Sidebar */}
      <div className="w-96 border-r flex flex-col bg-card">


        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-4">
          {/* Overview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Overview</h3>
              <div className="text-xs text-muted-foreground font-medium">
                Phase {currentPhase + 1} of {sprintPhases.length}
              </div>
            </div>


            {/* Current Phase Card - Clickable */}
            <Card 
              className="p-3 border-2 cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => setShowPhaseModal(true)}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="default" className="text-xs">
                  {sprintPhases[currentPhase].name}
                </Badge>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {sprintPhases.length - currentPhase - 1} remaining
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showPhaseDetails ? 'rotate-90' : ''}`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {sprintPhases[currentPhase].description}
              </p>
              <Progress 
                value={dynamicProgress} 
                className="h-2 transition-all duration-500 ease-out"
              />
              <p className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                dynamicProgress >= 100 
                  ? 'text-green-600 font-semibold' 
                  : 'text-muted-foreground'
              }`}>
                {Math.round(dynamicProgress)}% Complete
              </p>
              
              {/* Phase Details */}
              {showPhaseDetails && (
                <div className="mt-4 pt-3 border-t space-y-3">
                  <h4 className="text-xs font-medium text-green-700 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Answered Questions
                  </h4>
                  {phaseQuestions.map((qa, index) => (
                    <div key={index} className="space-y-1">
                      <p className="text-xs font-medium">{qa.question}</p>
                      <p className="text-xs text-muted-foreground pl-2 border-l-2 border-green-200">
                        {qa.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Enhanced Timer */}
            <Card className="p-3 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Phase Timer</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="h-8 w-8 p-0"
                >
                  {isTimerRunning ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <div className="text-center">
                <span className="text-2xl font-mono font-bold text-foreground">
                  {formatTime(timeRemaining)}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {isTimerRunning ? "Running" : "Paused"}
                </p>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Team Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Team</h3>
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {mockUsers.length + 1}
              </Badge>
            </div>

            {/* Current User */}
            {user && (
              <Card className="p-3 border-2 border-green-200">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 border-2 border-green-300">
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <Badge className="bg-green-600 text-white text-xs">You</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </Card>
            )}

            <Separator />

            {/* Mock Users */}
            <div className="space-y-2">
              {mockUsers.map((mockUser) => (
                <Card key={mockUser.id} className="p-3">
                  <div className="flex items-center space-x-3">
                    <GeneratedAvatar 
                      user={{ name: mockUser.name, gender: mockUser.gender, role: mockUser.role }}
                      className="w-9 h-9"
                      size={36}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">{mockUser.name}</p>
                        {mockUser.isHost && (
                          <Crown className="w-3 h-3 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{mockUser.role}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className={`w-2 h-2 rounded-full ${getUserStatusColor(mockUser.status)}`} />
                      <span className="text-xs text-muted-foreground">
                        {getUserStatusText(mockUser.status)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <DemoChatInterface
          currentPhase={sprintPhases[currentPhase]}
          currentPhaseIndex={currentPhase}
          user={user}
          mockUsers={mockUsers}
          isTimerRunning={isTimerRunning}
          onProgressUpdate={handleProgressUpdate}
          onPhaseChange={onPhaseChange}
        />
      </div>

      {/* Phase Detail Modal */}
      <PhaseDetailModal
        isOpen={showPhaseModal}
        onClose={() => setShowPhaseModal(false)}
        phaseIndex={currentPhase}
      />
    </div>
  );
}; 