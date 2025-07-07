import { useState } from "react";

import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { SprintView } from "./components/SprintView";
import { AnalyticsView } from "./components/AnalyticsView";
import { SettingsView } from "./components/SettingsView";
import { HelpView } from "./components/HelpView";

// Sprint state type
type SprintState = {
  problem: string;
  phase: number;
  day: number;
  isTimerRunning: boolean;
  timeRemaining: number;
};

// View type
type View = "dashboard" | "sprint" | "analytics" | "settings" | "help";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [sprintState, setSprintState] = useState<SprintState>({
    problem: "Define the problem to solve in this sprint.",
    phase: 0,
    day: 1,
    isTimerRunning: false,
    timeRemaining: 25 * 60, // 25 minutes for a pomodoro session
  });

  const navigate = (newView: View) => setView(newView);

  const updateSprintState = (newState: Partial<SprintState>) => {
    setSprintState((prevState) => ({ ...prevState, ...newState }));
  };

  const renderView = () => {
    switch (view) {
      case "sprint":
        return (
          <SprintView
            sprintState={sprintState}
            updateSprintState={updateSprintState}
          />
        );
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      case "help":
        return <HelpView />;
      case "dashboard":
      default:
        return (
          <Dashboard
            navigate={navigate}
            sprintState={sprintState}
            updateSprintState={updateSprintState}
          />
        );
    }
  };

  return (
    <div className="bg-background font-sans text-foreground h-screen flex flex-col antialiased">
      <Header currentView={view} navigate={navigate} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
}
