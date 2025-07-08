import React from "react";
import { HelpCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const HelpView: React.FC = () => {
  const sprintPhasesHelp = [
    {
      title: "Phase 0: Setup",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Goal:</strong> Identify all stakeholders and establish the foundation for a successful sprint.
            This phase ensures the team has the right people, clear roles, and established communication norms.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Activities:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Stakeholder Mapping:</strong> Identify all key people who should be involved in the sprint.
              </li>
              <li>
                <strong>Role Definition:</strong> Establish what role each person will play and their areas of expertise.
              </li>
              <li>
                <strong>Designate the Decider:</strong> Choose one person who will have the final say on decisions.
              </li>
              <li>
                <strong>Communication Norms:</strong> Set expectations for how the team will work together.
              </li>
              <li>
                <strong>Timeline and Scope:</strong> Confirm the sprint duration and what the team hopes to achieve.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI Facilitator&apos;s Role:</h4>
            <p className="text-sm">
              The AI will guide stakeholder identification, help establish clear roles and decision-making hierarchy,
              and ensure all necessary expertise is represented or identified for later consultation.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Phase 1: Understand",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Goal:</strong> Create a shared understanding of the problem,
            the business context, and the user needs. By the end of this phase,
            the team should have a clear target for the rest of the sprint.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Activities:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Start at the End:</strong> Define a long-term goal. What
                will success look like in 6 months or a year?
              </li>
              <li>
                <strong>Map:</strong> Create a simple map of the user&apos;s
                journey through your product or service.
              </li>
              <li>
                <strong>Ask the Experts:</strong> Interview stakeholders and
                team members to gather insights.
              </li>
              <li>
                <strong>How Might We (HMW):</strong> Reframe problems and
                challenges as opportunities for design.
              </li>
              <li>
                <strong>Pick a Target:</strong> The Decider chooses one target
                customer and one target moment on the map to focus on for the
                sprint.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI Facilitator&apos;s Role:</h4>
            <p className="text-sm">
              The AI will prompt discussions, ask clarifying questions about the
              long-term goal, help organize HMW notes, and ensure the team
              converges on a clear target.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Phase 2: Ideate",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Goal:</strong> Generate a wide range of potential solutions
            to the problem defined in Phase 1. The focus is on quantity and
            creativity, not quality or feasibility at this stage.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Activities:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Lightning Demos:</strong> Look for inspiration in other
                products and industries. Each team member gives a 3-minute demo
                of a cool solution.
              </li>
              <li>
                <strong>The Four-Step Sketch:</strong> A structured process for
                individuals to develop solutions.
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Notes:</strong> Gather key information from the
                    previous phase.
                  </li>
                  <li>
                    <strong>Ideas:</strong> Doodle rough ideas and combinations.
                  </li>
                  <li>
                    <strong>Crazy 8s:</strong> Rapidly sketch 8 variations of an
                    idea in 8 minutes.
                  </li>
                  <li>
                    <strong>Solution Sketch:</strong> Create a detailed,
                    self-explanatory sketch of your best concept.
                  </li>
                </ol>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI Facilitator&apos;s Role:</h4>
            <p className="text-sm">
              The AI keeps track of time for exercises like Crazy 8s, encourages
              divergent thinking, and provides prompts to help overcome creative
              blocks.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Phase 3: Decide",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Goal:</strong> Critically evaluate the solutions from Phase
            2 and decide which ones have the best chance of achieving the
            long-term goal. This is a structured process, not a free-form
            debate.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Activities:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Art Museum:</strong> Post all the solution sketches on a
                wall (or virtual board) for silent review.
              </li>
              <li>
                <strong>Heat Map:</strong> Team members silently place dots on
                parts of sketches they find interesting.
              </li>
              <li>
                <strong>Speed Critique:</strong> The facilitator narrates each
                sketch, and the group discusses highlights and concerns.
              </li>
              <li>
                <strong>Dot Voting:</strong> Each team member gets a set number
                of votes (dots) to choose the best overall concepts.
              </li>
              <li>
                <strong>The Decider&apos;s Vote:</strong> The Decider makes the
                final call on which concepts will be prototyped.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI Facilitator&apos;s Role:</h4>
            <p className="text-sm">
              The AI will guide the structured critique process, manage voting
              rounds, and help synthesize the team&apos;s feedback to support
              the Decider&apos;s final choice.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Phase 4: Prototype",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Goal:</strong> Build a realistic-looking, but ultimately
            fake, prototype to test with users. The aim is to create a
            &quot;Goldilocks&quot; prototype: high-fidelity enough to evoke
            genuine reactions, but not so polished that you&apos;re afraid to
            throw it away.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Activities:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Choose the Right Tools:</strong> Select the fastest
                tools for the job (e.g., Figma, Keynote, or even paper).
              </li>
              <li>
                <strong>Assign Roles:</strong> Divide the team into Makers, a
                Stitcher (to combine the work), a Writer, and an Asset
                Collector.
              </li>
              <li>
                <strong>Build the Facade:</strong> Focus only on what the user
                will see. It doesn&apos;t need to work; it just needs to look
                like it works.
              </li>
              <li>
                <strong>Do a Trial Run:</strong> At the end of the day, do a
                run-through of the prototype to ensure it&apos;s ready for
                testing.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI Facilitator&apos;s Role:</h4>
            <p className="text-sm">
              The AI can suggest prototyping tools, help break down the work,
              and provide a checklist to ensure the prototype is complete and
              ready for user testing.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Phase 5: Test",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Goal:</strong> Get feedback on your prototype from real
            users. This is where you learn what works and what doesn&apos;t
            before investing significant time and resources.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Activities:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>The Five-Act Interview:</strong> A structured interview
                process to get high-quality feedback.
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Friendly Welcome</li>
                  <li>Context Questions</li>
                  <li>Introduce the Prototype</li>
                  <li>Tasks and Nudges</li>
                  <li>Quick Debrief</li>
                </ol>
              </li>
              <li>
                <strong>Observe and Take Notes:</strong> The rest of the team
                watches the interviews via live video and takes notes on what
                they see and hear.
              </li>
              <li>
                <strong>Look for Patterns:</strong> At the end of the day, the
                team gathers to identify patterns and key takeaways from the
                user feedback.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI Facilitator&apos;s Role:</h4>
            <p className="text-sm">
              The AI can provide the interview script, help the team organize
              their observations, and facilitate the final pattern-spotting
              session to determine the next steps.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="text-center">
        <CardHeader>
          <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-3xl">Help & Resources</CardTitle>
          <CardDescription className="text-lg">
            Your comprehensive guide to the AI-powered Design Sprint.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">What is a Design Sprint?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A Design Sprint is a time-constrained, six-phase process that uses
            design thinking to reduce the risk when bringing a new product,
            service, or a feature to the market. It&apos;s a recipe for solving
            big problems and testing new ideas in just a few days. This app,
            powered by AI, acts as your digital facilitator to guide you through
            every step.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">The Sprint Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion collapsible className="w-full" type="single">
            {sprintPhasesHelp.map((phase, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {phase.title}
                </AccordionTrigger>
                <AccordionContent>{phase.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Tips for a Successful Sprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong>Trust the Process:</strong> The sprint methodology can
              feel chaotic, but it&apos;s designed to produce results. Stick to
              the schedule and activities.
            </li>
            <li>
              <strong>Embrace &quot;Together Alone&quot;:</strong> Many
              activities (like sketching) are done individually. This allows for
              deep focus and prevents groupthink.
            </li>
            <li>
              <strong>The Decider is Key:</strong> A designated Decider is
              crucial for breaking ties and making tough choices to keep the
              sprint moving.
            </li>
            <li>
              <strong>No Devices in the Room:</strong> To maximize focus,
              it&apos;s best to put away laptops and phones during sprint
              activities (the Focus Timer can help!).
            </li>
            <li>
              <strong>It&apos;s About Learning, Not Perfection:</strong> The
              goal of the prototype and test is to learn quickly. Don&apos;t get
              bogged down in creating a perfect product.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
