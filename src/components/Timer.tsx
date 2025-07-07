import React, { useEffect } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SprintState = {
  problem: string;
  phase: number;
  day: number;
  isTimerRunning: boolean;
  timeRemaining: number;
};

interface TimerProps {
  sprintState: SprintState;
  updateSprintState: (newState: Partial<SprintState>) => void;
}

export const Timer: React.FC<TimerProps> = ({
  sprintState,
  updateSprintState,
}) => {
  const { isTimerRunning, timeRemaining } = sprintState;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        updateSprintState({ timeRemaining: timeRemaining - 1 });
      }, 1000);
    } else if (isTimerRunning && timeRemaining === 0) {
      updateSprintState({ isTimerRunning: false });
      // Optional: Add a sound or notification here
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemaining, updateSprintState]);

  const toggleTimer = () =>
    updateSprintState({ isTimerRunning: !isTimerRunning });
  const resetTimer = () =>
    updateSprintState({ isTimerRunning: false, timeRemaining: 25 * 60 });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Card className="mt-auto">
      <CardHeader>
        <CardTitle className="text-center">Focus Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-5xl font-mono text-center">
          {formatTime(timeRemaining)}
        </div>
        <div className="flex justify-center space-x-4">
          <Button className="flex items-center space-x-2" onClick={toggleTimer}>
            {isTimerRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isTimerRunning ? "Pause" : "Start"}</span>
          </Button>
          <Button size="icon" variant="outline" onClick={resetTimer}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
