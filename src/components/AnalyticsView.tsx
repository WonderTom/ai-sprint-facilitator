import React from "react";
import { BarChart2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const AnalyticsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="text-center">
        <CardHeader>
          <BarChart2 className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Sprint Analytics</CardTitle>
          <CardDescription className="text-lg">
            This feature is part of the &quot;Advanced Analytics&quot; phase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Here you will find comprehensive sprint reports, participation
            metrics, and outcome analysis to foster organizational learning.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
