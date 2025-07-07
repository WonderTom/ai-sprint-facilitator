import React, { useState } from "react";
import { Zap, Users, BarChart2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type View = "dashboard" | "sprint" | "analytics" | "settings" | "help";

type SprintState = {
  problem: string;
  phase: number;
  day: number;
  isTimerRunning: boolean;
  timeRemaining: number;
  user?: {
    name: string;
    role: string;
    organization?: string;
  };
};

interface DashboardProps {
  navigate: (view: View) => void;
  sprintState: SprintState;
  updateSprintState: (newState: Partial<SprintState>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  navigate,
  sprintState,
  updateSprintState,
}) => {
  // User introduction form state
  const [showUserForm, setShowUserForm] = useState(!sprintState.user);
  const [userName, setUserName] = useState(sprintState.user?.name || "");
  const [userRole, setUserRole] = useState(sprintState.user?.role || "");
  const [userOrganization, setUserOrganization] = useState(sprintState.user?.organization || "");

  const handleUserSubmit = () => {
    if (userName.trim() && userRole.trim()) {
      updateSprintState({
        user: {
          name: userName.trim(),
          role: userRole.trim(),
          organization: userOrganization.trim() || undefined,
        },
      });
      setShowUserForm(false);
    }
  };

  const handleStartSprint = () => {
    navigate("sprint");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            Welcome to your Design Sprint
          </CardTitle>
          <CardDescription className="text-lg">
            Let&apos;s solve big problems and test new ideas in just five days.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Introduction Form */}
          {showUserForm && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  First, let&apos;s get to know you!
                </h3>
                <p className="text-gray-600">
                  This helps our AI facilitator personalize your sprint experience.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user-name" className="text-sm font-medium">
                    Your Name *
                  </Label>
                  <Input
                    id="user-name"
                    placeholder="e.g., Sarah Johnson"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="user-role" className="text-sm font-medium">
                    Your Role *
                  </Label>
                  <Select value={userRole} onValueChange={setUserRole}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="UX Designer">UX Designer</SelectItem>
                      <SelectItem value="UI Designer">UI Designer</SelectItem>
                      <SelectItem value="Design Researcher">Design Researcher</SelectItem>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                      <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                      <SelectItem value="Engineering Manager">Engineering Manager</SelectItem>
                      <SelectItem value="CEO/Founder">CEO/Founder</SelectItem>
                      <SelectItem value="CTO">CTO</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="user-organization" className="text-sm font-medium">
                  Organization (Optional)
                </Label>
                <Input
                  id="user-organization"
                  placeholder="e.g., Tech Startup, Bank of America, Consulting Firm"
                  value={userOrganization}
                  onChange={(e) => setUserOrganization(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleUserSubmit}
                  disabled={!userName.trim() || !userRole.trim()}
                  className="px-8 py-2"
                >
                  Continue to Sprint Setup
                </Button>
              </div>
            </div>
          )}
          
          {/* Ready to Start */}
          {!showUserForm && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Welcome back, {sprintState.user?.name}! 👋
                  </h3>
                  <p className="text-sm text-gray-600">
                    {sprintState.user?.role} at {sprintState.user?.organization || "your organization"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUserForm(true)}
                >
                  Edit Profile
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Ready to start your Design Sprint?
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI facilitator will guide you through defining your challenge and working through each phase of the sprint process.
                </p>
                
                <Button
                  className="px-8 py-3 text-base"
                  size="lg"
                  onClick={handleStartSprint}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Sprint with AI Facilitator
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Zap className="w-8 h-8 text-amber-500 mb-3" />
            <CardTitle>Core Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Leverage conversational AI, step-by-step guidance, and real-time
              monitoring.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-8 h-8 text-teal-500 mb-3" />
            <CardTitle>For Your Team</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Designed to enhance collaboration, ensure equal participation, and
              synthesize ideas.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BarChart2 className="w-8 h-8 text-indigo-500 mb-3" />
            <CardTitle>Trackable Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Move from ideas to decisions with structured voting and clear
              action items.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
