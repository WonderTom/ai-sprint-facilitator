import React, { useState } from "react";
import { Plus, Users, Clock, Target, ArrowRight, CheckCircle2 } from "lucide-react";

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
// import { Badge } from "@/components/ui/badge";

type View = "dashboard" | "sprint" | "analytics" | "settings" | "help" | "demo";

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
  // User form state
  const [showUserForm, setShowUserForm] = useState(!sprintState.user);
  const [userName, setUserName] = useState(sprintState.user?.name || "");
  const [userRole, setUserRole] = useState(sprintState.user?.role || "");
  const [userOrganization, setUserOrganization] = useState(sprintState.user?.organization || "");

  // Sprint creation state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sprintName, setSprintName] = useState("");
  const [sprintChallenge, setSprintChallenge] = useState("");
  const [sprintDuration, setSprintDuration] = useState("5");
  const [teamSize, setTeamSize] = useState("5-7");
  const [sprintType, setSprintType] = useState("discovery");

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

  const handleCreateSprint = () => {
    if (sprintName.trim() && sprintChallenge.trim()) {
      updateSprintState({
        problem: sprintChallenge.trim(),
      });
      navigate("sprint");
    }
  };

  const handleStartDemo = () => {
    navigate("demo");
  };

  const sprintExamples = [
    "How might we improve the mobile banking login experience?",
    "How might we simplify the mortgage application process for first-time homebuyers?",
    "How might we reduce customer support tickets by 30%?",
    "How might we increase user engagement in our mobile app?",
    "How might we streamline the onboarding process for new users?"
  ];

  // User Introduction Form
  if (showUserForm) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to AI Sprint Facilitator</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Let's start by getting to know you to personalize your sprint experience
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Tell us about yourself</CardTitle>
            <CardDescription>
              This information helps our AI facilitator provide personalized guidance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Your Name *</Label>
                <Input
                  id="user-name"
                  placeholder="e.g., Sarah Johnson"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-role">Your Role *</Label>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label htmlFor="user-organization">Organization (Optional)</Label>
              <Input
                id="user-organization"
                placeholder="e.g., Tech Startup, Bank of America, Consulting Firm"
                value={userOrganization}
                onChange={(e) => setUserOrganization(e.target.value)}
              />
            </div>
            
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleUserSubmit}
                disabled={!userName.trim() || !userRole.trim()}
                size="lg"
                className="px-8"
              >
                Continue to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <CardTitle className="text-lg">Time-Boxed Process</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Structured 5-day process with clear objectives and deliverables for each phase
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">AI Facilitation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Expert guidance through each sprint phase with intelligent prompts and feedback
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Proven Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Based on Google's design sprint methodology, tested with thousands of teams
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Design Sprint Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Choose how you'd like to start your design sprint experience
        </p>
      </div>

      {/* Main Actions */}
      {!showCreateForm ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Sprint */}
          <Card className="border-2 flex flex-col cursor-pointer" onClick={() => setShowCreateForm(true)}>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Create New Sprint</CardTitle>
              <CardDescription className="text-base">
                Start a new 5-day design sprint with AI facilitation and structured methodology
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <Button className="w-full" size="lg">
                Create Sprint
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Join Sprint */}
          <Card className="border-2 flex flex-col">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Join Sprint</CardTitle>
              <CardDescription className="text-base">
                Join an existing sprint session with your team using a sprint code
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sprint-code">Sprint Code</Label>
                <Input 
                  id="sprint-code"
                  placeholder="Enter 6-digit code" 
                  className="text-center text-lg tracking-wider"
                  maxLength={6}
                />
              </div>
              <Button variant="outline" className="w-full" size="lg">
                Join Sprint
              </Button>
            </CardContent>
          </Card>

          {/* Try Demo */}
          <Card className="border-2 flex flex-col">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Try Demo</CardTitle>
              <CardDescription className="text-base">
                Experience a simulated multi-user collaborative sprint with sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <Button variant="outline" className="w-full" onClick={handleStartDemo} size="lg">
                Explore Demo
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Create Sprint Form
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create New Design Sprint</CardTitle>
            <CardDescription className="text-base">
              Set up your 5-day design sprint following Google's proven methodology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sprint-name" className="text-base font-medium">Sprint Name *</Label>
                  <Input
                    id="sprint-name"
                    placeholder="e.g., Banking App Checkout Redesign"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sprint-duration" className="text-base font-medium">Sprint Duration</Label>
                  <Select value={sprintDuration} onValueChange={setSprintDuration}>
                    <SelectTrigger className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Day (Express)</SelectItem>
                      <SelectItem value="2">2 Days (Accelerated)</SelectItem>
                      <SelectItem value="3">3 Days (Focused)</SelectItem>
                      <SelectItem value="5">5 Days (Full Sprint)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-size" className="text-base font-medium">Expected Team Size</Label>
                  <Select value={teamSize} onValueChange={setTeamSize}>
                    <SelectTrigger className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-4">3-4 People (Small)</SelectItem>
                      <SelectItem value="5-7">5-7 People (Recommended)</SelectItem>
                      <SelectItem value="8-10">8-10 People (Large)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sprint-type" className="text-base font-medium">Sprint Type</Label>
                  <Select value={sprintType} onValueChange={setSprintType}>
                    <SelectTrigger className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discovery">Discovery Sprint</SelectItem>
                      <SelectItem value="validation">Validation Sprint</SelectItem>
                      <SelectItem value="optimization">Optimization Sprint</SelectItem>
                      <SelectItem value="innovation">Innovation Sprint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sprint-challenge" className="text-base font-medium">Sprint Challenge *</Label>
                  <Textarea
                    id="sprint-challenge"
                    placeholder="How might we..."
                    value={sprintChallenge}
                    onChange={(e) => setSprintChallenge(e.target.value)}
                    className="min-h-[120px] text-base resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Frame your challenge as a "How might we..." question for best results
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Quick Examples</Label>
                  <div className="space-y-2">
                    {sprintExamples.slice(0, 3).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setSprintChallenge(example)}
                        className="text-sm text-left w-full p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowCreateForm(false)} size="lg">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSprint}
                disabled={!sprintName.trim() || !sprintChallenge.trim()}
                size="lg"
              >
                Create Sprint
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
};
 