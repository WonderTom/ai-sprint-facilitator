import React, { useState } from "react";
import { CheckCircle2, Target, Users, Lightbulb, Vote, Timer, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  phaseIndex: number;
}

interface PhaseData {
  name: string;
  description: string;
  progress: number;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  keyInsights: string[];
  nextSteps: string[];
  goals?: string[]; // For future phases
  metrics?: {
    name: string;
    value: string;
    progress: number;
  }[];
}

export const PhaseDetailModal: React.FC<PhaseDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  phaseIndex 
}) => {
  if (!isOpen) return null;

  const phaseData: PhaseData[] = [
    {
      name: "Setup",
      description: "Map stakeholders and establish team structure",
      progress: 100,
      icon: Users,
      summary: "Established cross-functional team with clear roles and decision-making authority. Mapped stakeholder expertise including student financial behavior, Gen Z UX research, and UBS system integration capabilities. Defined external input requirements from compliance and partnership teams.",
      keyInsights: [
        "Complete cross-functional team present with relevant expertise",
        "Clear decision-making hierarchy established with PM as decider",
        "Student financial behavior and Gen Z UX expertise available",
        "Compliance and partnership team input identified for later phases"
      ],
      nextSteps: [
        "Mapped team expertise and roles for UBS student loan project",
        "Established Sarah Chen (PM) as primary decision-maker",
        "Identified need for compliance team input on lending regulations",
        "Planned integration points with partnership team for gamification elements"
      ],
      metrics: [
        { name: "Team Completeness", value: "100%", progress: 100 },
        { name: "Role Clarity", value: "95%", progress: 95 },
        { name: "Decision Authority", value: "Clear", progress: 100 }
      ]
    },
    {
      name: "Understand",
      description: "Map the problem space and understand user needs",
      progress: 100,
      icon: Target,
      summary: "College students aged 18-26 struggle to access small loans (5,000-50,000 CHF) due to intimidating traditional lending processes. 78% avoid traditional banking for loans, preferring family support over complex applications with financial jargon.",
      keyInsights: [
        "Students panic when faced with unexpected financial needs (equipment, education)",
        "Traditional loan applications use language that doesn't match student reality",
        "Students are digital natives but financially inexperienced",
        "Co-signer requirements create additional complexity for many students"
      ],
      nextSteps: [
        "Validated core problem through student interviews and surveys",
        "Mapped student financial journey from need recognition to loan completion",
        "Established mission: create empowering, educational loan experience",
        "Defined target demographic and success criteria"
      ],
      metrics: [
        { name: "Traditional Banking Avoidance", value: "78%", progress: 78 },
        { name: "Student Financial Stress", value: "High", progress: 85 },
        { name: "Current UBS Student Penetration", value: "12%", progress: 12 }
      ]
    },
    {
      name: "Ideate", 
      description: "Generate and develop creative solutions",
      progress: 100,
      icon: Lightbulb,
      summary: "Generated 20+ student-focused solutions combining financial education with loan applications. Key approaches: gamified financial literacy, video applications for personal connection, and partner ecosystem rewards. Selected Educational Gamification as core solution.",
      keyInsights: [
        "Gen Z responds positively to gamification when done authentically",
        "Students want financial education but in digestible, engaging formats",
        "Partnership rewards (pizza, coffee, streaming) appeal to student lifestyle",
        "Different paths needed for independent students vs. co-signer requirements"
      ],
      nextSteps: [
        "Conducted Crazy 8s focused on student loan anxiety points",
        "Evaluated solutions for student appeal and educational value",
        "Selected Gamified Financial Literacy with partner rewards",
        "Designed dual pathways for different student situations"
      ],
      metrics: [
        { name: "Student-Focused Solutions", value: "23", progress: 100 },
        { name: "Gamification Appeal Score", value: "4.8/5", progress: 96 },
        { name: "Educational Value Rating", value: "4.6/5", progress: 92 }
      ]
    },
    {
      name: "Decide",
      description: "Choose the best solution to prototype", 
      progress: 85,
      icon: Vote,
      summary: "Evaluated solutions using student-focused criteria: appeal to 18-26 demographic, educational value, and UBS implementation feasibility. Gamified Financial Literacy with partner rewards scored highest for addressing student anxiety while building financial responsibility.",
      keyInsights: [
        "Educational gamification transforms intimidation into engagement",
        "Partner rewards create positive reinforcement for responsible payments",
        "Solution aligns with UBS goal of nurturing young customer relationships",
        "Approach balances fun with financial credibility and responsibility"
      ],
      nextSteps: [
        "Completed solution scoring with student-specific criteria",
        "Finalized gamified learning modules and reward structure",
        "Created student journey storyboard from crisis to confidence",
        "Designed integration points with UBS systems and partner APIs"
      ],
      metrics: [
        { name: "Student Appeal Score", value: "4.9/5", progress: 98 },
        { name: "UBS Implementation Feasibility", value: "85%", progress: 85 },
        { name: "Educational Impact Potential", value: "92%", progress: 92 }
      ]
    },
    {
      name: "Prototype",
      description: "Build and refine the solution",
      progress: 70,
      icon: Timer,
      summary: "Developing interactive prototype with gamified financial literacy modules, progress tracking, and partner reward integration. Features include step-by-step loan guidance, co-signer collaboration tools, and achievement system for responsible behavior.",
      keyInsights: [
        "Financial literacy modules increase student confidence significantly",
        "Achievement system motivates completion without feeling patronizing",
        "Co-signer collaboration features reduce family stress and improve transparency",
        "Partner integration API successfully connects with student-focused rewards"
      ],
      nextSteps: [
        "Complete interactive prototype with all learning modules",
        "Finalize gamification elements and reward point system",
        "Implement co-signer workflow and parent dashboard",
        "Prepare realistic student testing scenarios"
      ],
      goals: [
        "Create comprehensive financial literacy learning path",
        "Implement achievement and reward tracking system",
        "Design co-signer collaboration and approval workflows",
        "Integrate partner reward redemption functionality"
      ],
      metrics: [
        { name: "Prototype Completion", value: "70%", progress: 70 },
        { name: "Learning Modules", value: "80%", progress: 80 },
        { name: "Gamification Features", value: "65%", progress: 65 }
      ]
    },
    {
      name: "Test",
      description: "Validate solutions with real users",
      progress: 20,
      icon: CheckCircle2,
      summary: "Planning comprehensive testing with 15 students aged 18-26 across different financial situations. Will test educational effectiveness, gamification appeal, and loan application completion rates. Target: 80% completion with improved financial literacy scores.",
      keyInsights: [
        "Testing will focus on authentic student reactions to gamification",
        "Participants include independent students and those needing co-signers",
        "Multiple loan scenarios will validate flexibility of approach",
        "Financial literacy improvement will be measured pre/post interaction"
      ],
      nextSteps: [
        "Recruit diverse student participants from target demographic",
        "Test gamification elements for engagement vs. perceived seriousness",
        "Validate educational content effectiveness and retention",
        "Measure confidence improvement in financial decision-making"
      ],
      goals: [
        "Recruit 15 students representing diverse financial situations",
        "Test various loan amounts and purposes (equipment, education, lifestyle)",
        "Validate 40% improvement in financial literacy quiz scores",
        "Achieve 80% application completion rate with confidence building"
      ],
      metrics: [
        { name: "Student Recruitment", value: "40%", progress: 40 },
        { name: "Testing Scenarios Prepared", value: "75%", progress: 75 },
        { name: "Baseline Assessments", value: "0%", progress: 0 }
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(phaseIndex.toString());

  // Calculate dynamic progress based on phase status
  const getPhaseProgress = (phase: PhaseData, index: number) => {
    const isPast = index < phaseIndex;
    const isFuture = index > phaseIndex;
    
    if (isPast) return 100;
    if (isFuture) return 0;
    return phase.progress; // Current phase keeps actual progress
  };

  // Update active tab when modal opens or phaseIndex changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(phaseIndex.toString());
    }
  }, [isOpen, phaseIndex]);

  const renderPhaseContent = (phase: PhaseData, index: number) => {
    const isPast = index < phaseIndex;
    const isCurrent = index === phaseIndex;
    const isFuture = index > phaseIndex;

    return (
      <div className="space-y-8">
        {/* Summary */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {isPast ? "Summary" : isCurrent ? "Current Status" : "Objectives"}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            {phase.summary}
          </p>
        </div>

        {/* Past Phase: Key Insights */}
        {isPast && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Key Achievements</h3>
            <div className="space-y-3">
              {phase.keyInsights.map((insight, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground text-base">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Phase: Full Details */}
        {isCurrent && (
          <>
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
              <div className="space-y-3">
                {phase.keyInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                    <p className="text-muted-foreground text-base">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Completed Work</h3>
              <div className="space-y-3">
                {phase.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-base">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics for current phase */}
            {phase.metrics && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {phase.metrics.map((metric, idx) => (
                    <Card key={idx} className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-muted-foreground">{metric.name}</span>
                        <span className="text-xl font-bold text-primary">{metric.value}</span>
                      </div>
                      <Progress value={metric.progress} className="h-3" />
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Future Phase: Goals */}
        {isFuture && phase.goals && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Goals</h3>
            <div className="space-y-3">
              {phase.goals.map((goal, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-3 flex-shrink-0" />
                  <p className="text-muted-foreground text-base">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] h-[90vh] overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Enhanced Header with Integrated Tabs */}
          <div className="border-b bg-gradient-to-r from-background to-muted/20">
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="text-2xl font-bold">
                Design Sprint Progress
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                UBS Student Loan Digital Tool
              </DialogDescription>
            </DialogHeader>

            {/* Integrated Tab Navigation */}
            <div className="px-6 pb-4">
              <TabsList className="grid w-full grid-cols-6 h-12 bg-muted/50">
                {phaseData.map((phase, index) => {
                  const IconComponent = phase.icon;
                  const isPast = index < phaseIndex;
                  const isCurrent = index === phaseIndex;
                  
                  return (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline truncate">{phase.name}</span>
                      <span className="sm:hidden truncate">{phase.name.slice(0, 4)}</span>
                      {isPast && <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />}
                      {isCurrent && <Timer className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {phaseData.map((phase, index) => (
              <TabsContent 
                key={index} 
                value={index.toString()} 
                className="h-full m-0 outline-none overflow-y-auto"
              >
                <div className="p-6">
                  {/* Phase Header */}
                  <div className="flex items-center space-x-4 mb-8 pb-6 border-b">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <phase.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        Phase {index + 1}: {phase.name}
                      </h2>
                      <p className="text-muted-foreground text-lg">{phase.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary mb-1">{getPhaseProgress(phase, index)}%</div>
                      <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                  </div>

                  {/* Phase Content */}
                  {renderPhaseContent(phase, index)}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}; 