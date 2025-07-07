import React from "react";
import { Settings } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="text-center">
        <CardHeader>
          <Settings className="w-16 h-16 text-teal-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Integrations</CardTitle>
          <CardDescription className="text-lg">
            Connect your favorite tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Seamless integration with Miro, Figma, Slack, Jira, and more will be
            available in future phases to streamline your workflow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
