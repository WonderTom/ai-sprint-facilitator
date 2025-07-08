import { useState } from "react";

import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { SprintView } from "./components/SprintView";
import { AnalyticsView } from "./components/AnalyticsView";
import { SettingsView } from "./components/SettingsView";
import { HelpView } from "./components/HelpView";
import { DemoView } from "./components/DemoView";

// Sprint state type
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

// View type
type View = "dashboard" | "sprint" | "analytics" | "settings" | "help" | "demo";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [sprintState, setSprintState] = useState<SprintState>({
    problem: "Define the problem to solve in this sprint.",
    phase: 0,
    day: 1,
    isTimerRunning: false,
    timeRemaining: 25 * 60, // 25 minutes for a pomodoro session
  });

  // Demo-specific state
  const [demoPhase, setDemoPhase] = useState(0); // Start with Setup phase

  // Sprint phases for demo
  const sprintPhases = [
    { name: "Setup", description: "Map stakeholders and establish team structure", progress: 100 },
    { name: "Understand", description: "Define the problem and understand the users", progress: 100 },
    { name: "Ideate", description: "Generate solutions and explore possibilities", progress: 100 },
    { name: "Decide", description: "Choose the best solution to prototype", progress: 85 },
    { name: "Prototype", description: "Build a realistic prototype", progress: 60 },
    { name: "Test", description: "Test with real users and gather feedback", progress: 20 },
  ];

  const navigate = (newView: View) => setView(newView);

  const updateSprintState = (newState: Partial<SprintState>) => {
    setSprintState((prevState) => ({ ...prevState, ...newState }));
  };

  // Determine sprint name for header context
  const getSprintName = () => {
    if (view === "demo") {
      return "UBS Student Loan Digital Tool";
    }
    if (view === "sprint" && sprintState.problem !== "Define the problem to solve in this sprint.") {
      // Extract a shorter name from the problem statement
      const problem = sprintState.problem;
      if (problem.length > 50) {
        return problem.substring(0, 47) + "...";
      }
      return problem;
    }
    return undefined;
  };

  // Determine when to show back button
  const shouldShowBackButton = view === "sprint" || view === "demo" || view === "analytics" || view === "settings" || view === "help";

  const renderView = () => {
    switch (view) {
      case "sprint":
        return (
          <SprintView
            sprintState={sprintState}
            updateSprintState={updateSprintState}
          />
        );
      case "demo":
        return (
          <DemoView
            navigate={navigate}
            user={sprintState.user}
            currentPhase={demoPhase}
            onPhaseChange={setDemoPhase}
            sprintPhases={sprintPhases}
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
      <Header 
        currentView={view} 
        navigate={navigate}
        user={sprintState.user}
        sprintName={getSprintName()}
        showBackButton={shouldShowBackButton}
        currentPhase={view === "demo" ? demoPhase : undefined}
        onPhaseChange={view === "demo" ? setDemoPhase : undefined}
        sprintPhases={view === "demo" ? sprintPhases : undefined}
      />
      <main className={`flex-1 ${view === "demo" ? "" : "overflow-y-auto p-4 md:p-6 lg:p-8"}`}>
        {renderView()}
      </main>
    </div>
  );
}
