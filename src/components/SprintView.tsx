import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Timer } from "./Timer";
import { ChatInterface } from "./ChatInterface";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

interface SprintViewProps {
  sprintState: SprintState;
  updateSprintState: (newState: Partial<SprintState>) => void;
}

export const SprintView: React.FC<SprintViewProps> = ({
  sprintState,
  updateSprintState,
}) => {
  const sprintPhases = [
    {
      name: "Understand",
      description: "Map out the problem space and pick a target.",
    },
    { name: "Ideate", description: "Sketch competing solutions on paper." },
    {
      name: "Decide",
      description: "Make decisions and turn ideas into a testable hypothesis.",
    },
    { name: "Prototype", description: "Build a realistic prototype." },
    { name: "Test", description: "Get feedback from real live users." },
  ];

  const { phase } = sprintState;

  const changePhase = (direction: number) => {
    const newPhase = Math.max(
      0,
      Math.min(sprintPhases.length - 1, phase + direction),
    );

    updateSprintState({ phase: newPhase });
  };

  const participants = [
    sprintState.user ? `${sprintState.user.name} (${sprintState.user.role})` : "You",
    "Alex (Designer)",
    "Maria (Engineer)",
    "Sam (Product Manager)",
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left Panel: Sprint Progress & Controls */}
      <div className="lg:w-1/3">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Design Sprint</CardTitle>
            <p className="text-muted-foreground">
              Challenge: &quot;{sprintState.problem}&quot;
            </p>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">
                  Phase {phase + 1}: {sprintPhases[phase].name}
                </h3>
                <div className="flex space-x-2">
                  <Button
                    disabled={phase === 0}
                    size="icon"
                    variant="outline"
                    onClick={() => changePhase(-1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    disabled={phase === sprintPhases.length - 1}
                    size="icon"
                    variant="outline"
                    onClick={() => changePhase(1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Progress
                className="mb-2"
                value={((phase + 1) / sprintPhases.length) * 100}
              />
              <p className="text-sm text-muted-foreground">
                {sprintPhases[phase].description}
              </p>
            </div>

            <Timer
              sprintState={sprintState}
              updateSprintState={updateSprintState}
            />

            <div>
              <h3 className="font-bold text-lg mb-3">Participants</h3>
              <div className="space-y-3">
                {participants.map((participant, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{participant.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{participant}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel: AI Facilitator Chat */}
      <div className="lg:w-2/3 flex-1 flex flex-col">
        <ChatInterface
          currentPhase={sprintPhases[phase]}
          sprintProblem={sprintState.problem}
          user={sprintState.user}
          updateSprintState={updateSprintState}
        />
      </div>
    </div>
  );
};
