import React, { useState, useEffect, useRef } from "react";
import { Zap, Send, ExternalLink, ChevronRight, Paperclip, Mic, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MockUser } from "./DemoView";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";

interface DemoMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  userRole?: string;
  avatar?: string;
  figmaLink?: string;
}

interface DemoChatProps {
  currentPhase: {
    name: string;
    description: string;
    progress: number;
  };
  currentPhaseIndex: number;
  user?: {
    name: string;
    role: string;
    organization?: string;
  };
  mockUsers: MockUser[];
  isTimerRunning: boolean; // Control auto-play with timer
  onProgressUpdate?: (progress: number) => void; // Callback for progress updates
  onPhaseChange?: (newPhase: number) => void; // Callback for phase changes
}

export const DemoChatInterface: React.FC<DemoChatProps> = ({
  currentPhase,
  currentPhaseIndex,
  user,
  mockUsers,
  isTimerRunning,
  onProgressUpdate,
  onPhaseChange,
}) => {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevPhaseIndexRef = useRef<number>(currentPhaseIndex);

  // Get demo script for current phase
  const getDemoScript = (phaseIndex: number) => {
    // Comprehensive phase-specific conversations following GDS methodology
    const scripts = {
      0: [
        {
          type: "assistant" as const,
          content: `Welcome everyone! I'm your AI facilitator for this Google Design Sprint. Let's start by mapping our team structure to ensure we have all the expertise we need.

**First question:** Who are the key stakeholders for this UBS student loan digital tool project?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "We have our core product team here - myself as PM, Mike our UX designer, Elena from engineering, David as business analyst, and Lisa from QA.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Great start! Tell me about each person's specific expertise. Sarah, as PM what's your background with student financial products?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "I've been managing digital banking products for 3 years, including some consumer lending. I have research on student financial behaviors and pain points with traditional loan processes.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Perfect. Mike, what's your design background with financial applications and young user demographics?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "I specialize in fintech UX and have done extensive research with Gen Z users on financial literacy apps. I understand how students interact with digital financial tools.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `Excellent. **Key question:** Who will be our primary decision-maker when we need to choose between different solution options?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "I'll be the decision-maker, but I want input from the whole team, especially Mike on student user experience and Elena on technical feasibility for integration with UBS systems.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Good. Are there any subject matter experts we should include but who aren't present today?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "We'll need input from UBS compliance team for lending regulations and the partnership team for any gamification elements with external vendors.",
          userId: "3",
          userName: "Elena Rodriguez",
          userRole: "Developer",
          avatar: "ER"
        },
        {
          type: "user" as const,
          content: "I agree. Also, we should consider involving the student focus group I've been working with - they could provide real-time feedback during testing phases.",
          userId: "current-user",
          userName: "You",
          userRole: "Team Member",
          avatar: "YU"
        },
        {
          type: "assistant" as const,
          content: `Excellent point! Having direct student input will be invaluable. What's the timeline authority for this team to implement solutions?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "We have 8 weeks to develop and test a working prototype, with potential for immediate implementation if testing goes well. UBS leadership is very supportive of this initiative.",
          userId: "current-user",
          userName: "You",
          userRole: "Team Member",
          avatar: "YU"
        },
        {
          type: "assistant" as const,
          content: `**SETUP SUMMARY:**

**Team Structure:**
Cross-functional team established with Sarah Chen as decision-maker. Team includes student UX expertise and UBS system integration capabilities.

**Key Outcomes:**
- Decision-making hierarchy defined
- Required expertise mapped and available
- External stakeholder input planned`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        }
      ],
      1: [
        {
          type: "assistant" as const,
          content: `Welcome to the **Understand** phase! We're going to develop a deep understanding of the problem space and users. Let me start with our core question:

**What specific problem are we trying to solve? Give me one clear sentence.**`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "College students struggle to access small loans for essential needs because traditional lending processes are complex, intimidating, and not designed for their demographic.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Good! Can you give me a concrete example of when this problem occurs?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "A 20-year-old student needs 8,000 CHF for a laptop for computer science studies. They visit multiple bank websites, get overwhelmed by complex forms, unclear requirements, and end up either borrowing from family or going without.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `That's specific and concerning. Who are the primary users affected by this problem?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Students aged 18-26, both living at home and independently. They're digital natives but financially inexperienced. Many have part-time income, some need parental co-signers.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `What does a typical day look like for these users? How does this problem impact their life?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "They're balancing studies, part-time work, and social life. When they need funding for equipment or education, they feel anxious about complex financial processes and often delay or avoid getting the help they need.",
          userId: "current-user",
          userName: user?.name || "You",
          userRole: user?.role || "Team Member",
          avatar: user?.name?.split(' ').map(n => n[0]).join('') || "YO"
        },
        {
          type: "assistant" as const,
          content: `What evidence do we have that this is a real problem worth solving? What data supports this?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Student financial stress surveys show 78% avoid traditional banking for loans. Our user research found students prefer apps with clear, educational interfaces. UBS wants to capture this demographic early.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Let's map the user journey. What's the very first trigger that makes a student realize they need a loan?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Usually a specific need arises - laptop breaks before exams, course requires expensive equipment, or they want to study abroad but need funding for extra costs.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `What's their immediate reaction and first action?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Panic, then they try to figure out options. They ask friends, search Google, maybe check their current bank's website. If it looks complicated, they often just ask family for money instead.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `At which specific point do they experience the most frustration?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "When they see traditional loan applications with financial jargon, income requirements that don't match student reality, and no clear guidance on whether they'll qualify.",
          userId: "5",
          userName: "Lisa Thompson",
          userRole: "QA Engineer",
          avatar: "LT"
        },
        {
          type: "assistant" as const,
          content: `**UNDERSTAND SUMMARY:**

**Problem Definition:**
Students aged 18-26 struggle to access small loans due to intimidating traditional lending processes. 78% avoid traditional banking for loans, preferring family support over complex applications.

**Key Insights:**
- Financial anxiety peaks when students encounter jargon-heavy loan forms
- Students want educational guidance, not just application forms
- Need triggered by urgent situations creates additional stress`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        }
      ],
      2: [
        {
          type: "assistant" as const,
          content: `Welcome to the **Ideate** phase! Time to generate creative solutions. Here are our rules:
1. No judgment - we evaluate later
2. Build on others' ideas with "Yes, and..."
3. Quantity over quality right now
4. Stay focused on making student loans accessible and educational

**Let's start:** How might we create a loan application that feels empowering rather than intimidating for students?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "What if we created a step-by-step guided experience that explains each part? Like a financial literacy tutorial combined with the application.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `Love it! Let's push that educational approach further - what else could make learning feel rewarding?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Yes, and we could gamify the process! Students earn points or badges for completing financial literacy modules, which could even improve their loan terms.",
          userId: "3",
          userName: "Elena Rodriguez",
          userRole: "Developer",
          avatar: "ER"
        },
        {
          type: "assistant" as const,
          content: `Brilliant gamification! How might we approach this if we could partner with any company?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Partner with pizza chains, coffee shops, streaming services - rewards that actually appeal to students and help them build responsible payment habits.",
          userId: "4",
          userName: "David Kim",
          userRole: "Business Analyst",
          avatar: "DK"
        },
        {
          type: "user" as const,
          content: "Or integrate with study platforms - completing loan payments unlocks premium features on learning apps they already use.",
          userId: "current-user",
          userName: user?.name || "You",
          userRole: user?.role || "Team Member",
          avatar: user?.name?.split(' ').map(n => n[0]).join('') || "YO"
        },
        {
          type: "assistant" as const,
          content: `Love the ecosystem thinking! How might gaming companies approach student loans?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Progress bars, achievement unlocks, social challenges with friends. Make loan management feel like leveling up rather than a burden.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `What if we had two different approaches - one for students with income versus those needing co-signers?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Smart! Independent students get a streamlined path, while co-signer students get a collaborative app where parents can track progress and provide guidance.",
          userId: "5",
          userName: "Lisa Thompson",
          userRole: "QA Engineer",
          avatar: "LT"
        },
        {
          type: "assistant" as const,
          content: `Perfect! Now let's do Crazy 8s - 8 minutes, 8 different approaches to student loan applications. Mike, what's your first radical approach?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Video application - students record a 2-minute video explaining what they need the loan for, creating personal connection instead of cold forms.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `#2 - Elena, completely different approach...`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "AI-powered financial health assessment - instead of traditional credit scores, evaluate students based on digital behavior and learning patterns.",
          userId: "3",
          userName: "Elena Rodriguez",
          userRole: "Developer",
          avatar: "ER"
        },
        {
          type: "assistant" as const,
          content: `**IDEATION SUMMARY:**

**Solutions Generated:**
Generated 20+ student-focused solutions combining financial education with loan applications. Key approaches include gamified financial literacy, video applications, and partner ecosystem rewards.

**Top Concepts:**
- Gamified financial literacy with progress tracking
- Video-based personal applications for human connection
- Partner rewards system for responsible payment behavior`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        }
      ],
      3: [
        {
          type: "assistant" as const,
          content: `Welcome to the **Decide** phase! Time to systematically evaluate our concepts. Let's start with heat map voting.

**For gamified financial literacy approach:** What specifically excites you most about this concept?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "It transforms student anxiety into engagement. Instead of fearing the loan process, they're actually learning valuable financial skills while applying.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Good! What concerns do you have about the gamification approach?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Some students might see it as patronizing or not serious enough for financial decisions. We need to balance fun with credibility.",
          userId: "3",
          userName: "Elena Rodriguez",
          userRole: "Developer",
          avatar: "ER"
        },
        {
          type: "assistant" as const,
          content: `Important point. **For the video application approach:** What excites you about this concept?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "It humanizes the process - UBS can see real students with real needs instead of just numbers. It builds trust and personal connection.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `Now let's compare systematically. Which concept best solves the student's biggest fear about loan applications?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "The educational gamification addresses the intimidation factor most directly, while the video approach tackles the impersonal nature of traditional banking.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Which feels most feasible to actually build and launch within UBS systems?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Educational modules are easier technically - we can build them progressively. Video review would need new workflows and compliance approval processes.",
          userId: "3",
          userName: "Elena Rodriguez",
          userRole: "Developer",
          avatar: "ER"
        },
        {
          type: "assistant" as const,
          content: `Let me score these on key criteria. **Student Appeal (1-5)** - How much will this attract our 18-26 target demographic?

Gamified financial literacy - your score and reasoning?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "5 - Gen Z loves gamification when done well. Plus they actually want financial education but in digestible, engaging formats.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `**DECISION SUMMARY:**

**Evaluation Results:**
Evaluated solutions using student-focused criteria: appeal to 18-26 demographic, educational value, and UBS implementation feasibility. Gamified Financial Literacy with partner rewards scored highest overall.

**Final Decision:**
- Selected gamified financial literacy as primary approach
- Integrating partner reward system for payment behavior
- Developing co-signer collaboration features for family support`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        }
      ],
      4: [
        {
          type: "assistant" as const,
          content: `Welcome to the **Prototype** phase! Time to build our gamified student loan solution. Let's focus on creating a realistic prototype that we can test with students.

**First:** What's the core experience we need to prototype for students?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "The loan application flow with embedded financial literacy modules. Students should experience the gamification and educational elements we designed.",
          userId: "3",
          userName: "Elena Rodriguez",
          userRole: "Developer",
          avatar: "ER"
        },
        {
          type: "assistant" as const,
          content: `What level of fidelity do we need for meaningful testing?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "High enough to test the educational flow and gamification elements. Students need to feel like they're applying for a real loan while learning.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `What are the must-have features for our prototype?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Financial literacy modules, progress tracking, loan application form, co-signer collaboration features, and the partner reward system preview.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Perfect! Let's start building. Who wants to tackle the initial wireframes?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "I'll start with the main user flow wireframes. Let me share the initial prototype designs I've been working on.",
          userId: "current-user",
          userName: "You",
          userRole: "Team Member",
          avatar: "YU",
          figmaLink: "https://www.figma.com/file/student-loan-prototype"
        },
        {
          type: "assistant" as const,
          content: `Excellent work! Those wireframes clearly show the gamified learning flow. How will users progress through the financial literacy modules?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Step-by-step modules with progress badges. Each completed module unlocks the next application section, ensuring they learn before they apply.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `**PROTOTYPE SUMMARY:**

**Core Features:**
Developing interactive prototype with gamified financial literacy modules, progress tracking, and partner reward integration. Features include step-by-step loan guidance and co-signer collaboration tools.

**Development Focus:**
- Interactive financial literacy learning modules
- Achievement system and progress tracking  
- Realistic loan application flow with educational guidance`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        }
      ],
      5: [
        {
          type: "assistant" as const,
          content: `Welcome to the **Test** phase! Time to validate our gamified student loan solution with real users. Let's define our testing strategy systematically.

**First:** What are our key testing questions about the educational loan application flow?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Do students feel empowered by the educational modules? Do they understand the loan terms better than with traditional applications?",
          userId: "5",
          userName: "Lisa Thompson", 
          userRole: "QA Engineer",
          avatar: "LT"
        },
        {
          type: "assistant" as const,
          content: `Important questions! What specific user behavior do we want to observe?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "How they respond to gamification elements, whether they complete financial literacy modules, and if they feel confident applying for their first loan.",
          userId: "2",
          userName: "Mike Johnson",
          userRole: "UX Designer",
          avatar: "MJ"
        },
        {
          type: "assistant" as const,
          content: `What would indicate success in our testing?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Application completion rate above 80%, financial literacy quiz scores improving by 40%, and user confidence ratings above 4/5 for understanding loan terms.",
          userId: "1",
          userName: "Sarah Chen",
          userRole: "Product Manager",
          avatar: "SC"
        },
        {
          type: "assistant" as const,
          content: `Good metrics! What could go wrong with our approach that we should test for?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "Students might find gamification childish for serious financial decisions. Or they might game the system without actually learning the concepts.",
          userId: "current-user",
          userName: user?.name || "You",
          userRole: user?.role || "Team Member",
          avatar: user?.name?.split(' ').map(n => n[0]).join('') || "YO"
        },
        {
          type: "assistant" as const,
          content: `Excellent point! What user scenarios should we test?`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        },
        {
          type: "user" as const,
          content: "First-time loan applicants with no credit history, students needing co-signers, and those applying for different loan amounts and purposes.",
          userId: "3",
          userName: "Elena Rodriguez",
          userRole: "Developer",
          avatar: "ER"
        },
        {
          type: "assistant" as const,
          content: `**TESTING SUMMARY:**

**Test Strategy:**
Planning comprehensive testing with 15 students aged 18-26 across different financial situations. Will test educational effectiveness, gamification appeal, and loan application completion rates.

**Success Metrics:**
- 80% application completion rate target
- 40% improvement in financial literacy scores
- 4/5+ confidence rating for loan understanding`,
          userName: "AI Facilitator",
          userRole: "Facilitator",
          avatar: "AI"
        }
      ]
    };

    return scripts[phaseIndex as keyof typeof scripts] || scripts[1];
  };

  // Get the demo script for the current phase
  const demoScript = getDemoScript(currentPhaseIndex);

  // Reset chat when phase changes
  useEffect(() => {
    if (prevPhaseIndexRef.current !== currentPhaseIndex) {
      // Phase has changed, reset everything
      setMessages([]);
      setCurrentMessageIndex(0);
      setTypingUsers(new Set());
      setInput("");
      
      // Reset progress to 0 for new phase
      if (onProgressUpdate) {
        onProgressUpdate(0);
      }
      
      // Update the ref to the new phase
      prevPhaseIndexRef.current = currentPhaseIndex;
    }
  }, [currentPhaseIndex, onProgressUpdate]);

  // Scroll to bottom with multiple attempts for reliability
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Multiple scroll attempts with different timings for better reliability
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end",
        inline: "nearest"
      });
      
      // Backup scroll attempt after a short delay
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "auto", 
          block: "end",
          inline: "nearest"
        });
      }, 50);
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    // Multiple timing attempts for better scroll reliability
    const timer1 = setTimeout(scrollToBottom, 0);
    const timer2 = setTimeout(scrollToBottom, 100);
    const timer3 = setTimeout(scrollToBottom, 300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [messages, typingUsers]);

  // Auto-play demo messages when timer is running
  useEffect(() => {
    if (isTimerRunning && currentMessageIndex < demoScript.length) {
      const currentScript = demoScript[currentMessageIndex];
      
      // Show typing indicator for user messages
      if (currentScript.type === "user" && currentScript.userId) {
        const userId = currentScript.userId;
        setTypingUsers(prev => new Set([...prev, userId]));
        
        // After 2 seconds, hide typing and show message
        const timer = setTimeout(() => {
          setTypingUsers(prev => {
            const updated = new Set(prev);
            updated.delete(userId);
            return updated;
          });
          
          const newMessage: DemoMessage = {
            ...currentScript,
            id: Date.now().toString(),
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, newMessage]);
          setCurrentMessageIndex(prev => {
            const newIndex = prev + 1;
            // Calculate progress based on message completion
            if (onProgressUpdate) {
              const progress = newIndex >= demoScript.length ? 100 : Math.round((newIndex / demoScript.length) * 100);
              onProgressUpdate(progress);
            }
            return newIndex;
          });
        }, 2000);
        
        return () => clearTimeout(timer);
      } else {
        // Assistant message - show immediately with slight delay
        const timer = setTimeout(() => {
          const newMessage: DemoMessage = {
            ...currentScript,
            id: Date.now().toString(),
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, newMessage]);
          setCurrentMessageIndex(prev => {
            const newIndex = prev + 1;
            // Calculate progress based on message completion
            if (onProgressUpdate) {
              const progress = newIndex >= demoScript.length ? 100 : Math.round((newIndex / demoScript.length) * 100);
              onProgressUpdate(progress);
            }
            return newIndex;
          });
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isTimerRunning, currentMessageIndex, demoScript.length, user]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage: DemoMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
      userId: "current-user",
      userName: user?.name || "You",
      userRole: user?.role || "Team Member",
      avatar: user?.name?.split(' ').map(n => n[0]).join('') || "YO"
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput("");
  };

  const renderFigmaEmbed = (url: string) => (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="text-sm font-medium">Banking Checkout Flow Concepts</span>
        </div>
        <Button size="sm" variant="outline" className="h-7">
          <ExternalLink className="w-3 h-3 mr-1" />
          Open in Figma
        </Button>
      </div>
      <div className="bg-white rounded border p-4">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">🎨</span>
          </div>
          <p className="text-sm">Wireframe Preview</p>
          <p className="text-xs text-gray-500 mt-1">12 frames • Updated 2 hours ago</p>
        </div>
      </div>
    </div>
  );

  const formatMessageText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-blue-700 font-semibold'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='text-gray-600'>$1</em>")
      .replace(/@(\w+)/g, "<span style='color: #2563eb; font-weight: 600;'>@$1</span>")
      .replace(/\n/g, "<br>");
  };

  const getUserFromId = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  // Check if message is a summary/final message
  const isSummaryMessage = (content: string) => {
    return content.includes("SUMMARY") || content.includes("NEXT STEPS:") || content.includes("Ready to build") || content.includes("STRATEGY SUMMARY") || content.includes("DECISION MATRIX");
  };

    // Enhanced summary message renderer
  const renderSummaryMessage = (content: string, isLastMessage: boolean) => {
    // Parse different sections from the content
    const lines = content.split('\n').filter(line => line.trim());
    const sections: { type: string; title?: string; items: string[] }[] = [];
    let currentSection: { type: string; title?: string; items: string[] } | null = null;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('SUMMARY:') || trimmedLine.includes('STRUCTURE SUMMARY:')) {
        // Main title
        sections.push({
          type: 'title',
          title: trimmedLine.replace(/\*\*/g, '').replace(':', ''),
          items: []
        });
      } else if (trimmedLine.startsWith('**') && trimmedLine.includes(':')) {
        // Section headers
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'section',
          title: trimmedLine.replace(/\*\*/g, ''),
          items: []
        };
      } else if (trimmedLine.startsWith('- **') || trimmedLine.startsWith('-')) {
        // List items
        if (currentSection) {
          currentSection.items.push(trimmedLine.replace(/^- /, '').replace(/\*\*/g, ''));
        }
      } else if (trimmedLine && !trimmedLine.includes('Next:')) {
        // Regular content
        if (currentSection) {
          currentSection.items.push(trimmedLine.replace(/\*\*/g, ''));
        } else {
          // Create a default section for orphaned content
          if (!currentSection) {
            currentSection = { type: 'section', items: [] };
          }
          currentSection.items.push(trimmedLine.replace(/\*\*/g, ''));
        }
      }
    });
    
    if (currentSection) sections.push(currentSection);
    
    // Extract "Next:" section separately
    const nextMatch = content.match(/\*\*Next:\*\*(.*?)$/s);
    const nextContent = nextMatch ? nextMatch[1].trim() : null;
    
          return (
        <div className="w-full max-w-2xl bg-blue-50/30 rounded-2xl p-4 space-y-3 shadow-sm">
          {sections.map((section, index) => {
            if (section.type === 'title') {
              return (
                <div key={index} className="text-center pb-2">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm shadow-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    {section.title}
                  </div>
                </div>
              );
            } else if (section.type === 'section' && section.title) {
              return (
                <div key={index} className="space-y-2 bg-white/50 rounded-xl p-3">
                  <h4 className="text-blue-800 font-semibold text-base flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    {section.title}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-gray-700 text-sm leading-relaxed flex items-start pl-4">
                        <span className="text-blue-500 mr-2 mt-0.5 text-xs flex-shrink-0">•</span>
                        <span className="flex-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        
        {/* Next section */}
        {nextContent && (
          <div className="bg-blue-100/70 rounded-xl p-3 space-y-2">
            <h4 className="text-blue-800 font-semibold text-base flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Next Steps
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed pl-4">
              {nextContent}
            </p>
          </div>
        )}
        
        {/* Continue button for completed phases */}
        {isLastMessage && currentMessageIndex >= demoScript.length && onPhaseChange && currentPhaseIndex < 5 && (
          <div className="pt-2">
            <Button 
              onClick={() => onPhaseChange(currentPhaseIndex + 1)}
              className="w-full"
              size="lg"
            >
              Continue to Next Phase: {['Setup', 'Understand', 'Ideate', 'Decide', 'Prototype', 'Test'][currentPhaseIndex + 1] || 'Complete'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-0 w-full flex-1 flex flex-col bg-background">
      {/* Messages Container - Takes full available height minus input area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-4 pb-2 flex flex-col">
            {/* Messages List */}
            <div className="space-y-4">
              {messages.map((msg, msgIndex) => {
                const isCurrentUser = msg.userId === "current-user";
                const isAssistant = msg.type === "assistant";
                const isSummary = isAssistant && isSummaryMessage(msg.content);
                const isLastMessage = msgIndex === messages.length - 1;
                
                // Enhanced summary message
                if (isSummary) {
                  return (
                    <div key={msg.id} className="flex items-start gap-3 w-full">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                        <Zap size={20} />
                      </div>
                      {renderSummaryMessage(msg.content, isLastMessage)}
                    </div>
                  );
                }
                
                // Regular messages
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isCurrentUser ? "justify-end" : ""}`}
                  >
                    {!isCurrentUser && !isAssistant && (
                      <GeneratedAvatar 
                        user={{ 
                          name: msg.userName || "Unknown", 
                          role: msg.userRole || "Team Member",
                          gender: getUserFromId(msg.userId || "")?.gender
                        }}
                        className="w-8 h-8 flex-shrink-0"
                        size={32}
                      />
                    )}
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                        <Zap size={20} />
                      </div>
                    )}
                    <div
                      className={`max-w-md p-3 rounded-lg ${
                        isAssistant
                          ? "bg-blue-50 text-gray-800 border-none"
                          : isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {!isAssistant && !isCurrentUser && (
                        <div className="text-xs font-medium mb-1 opacity-70">
                          {msg.userName} ({msg.userRole})
                        </div>
                      )}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMessageText(msg.content),
                        }}
                      />
                      {msg.figmaLink && renderFigmaEmbed(msg.figmaLink)}
                    </div>
                    {isCurrentUser && (
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold">
                          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "YU"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicators */}
              {Array.from(typingUsers).map(userId => {
                const typingUser = getUserFromId(userId);
                const isCurrentUser = userId === "current-user";
                if (!typingUser) return null;
                
                return (
                  <div key={`typing-${userId}`} className={`flex items-start gap-3 ${isCurrentUser ? "justify-end" : ""}`}>
                    {!isCurrentUser && (
                      <GeneratedAvatar 
                        user={{ 
                          name: typingUser.name, 
                          role: typingUser.role,
                          gender: typingUser.gender
                        }}
                        className="w-8 h-8 flex-shrink-0"
                        size={32}
                      />
                    )}
                    {isCurrentUser && (
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold">
                          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "YU"}
                        </span>
                      </div>
                    )}
                    <div className={`max-w-md p-3 rounded-lg ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-current rounded-full animate-pulse opacity-60" />
                        <span className="w-2 h-2 bg-current rounded-full animate-pulse delay-150 opacity-60" />
                        <span className="w-2 h-2 bg-current rounded-full animate-pulse delay-300 opacity-60" />
                        <span className="ml-2 text-sm opacity-70">
                          {typingUser.name} is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Scroll anchor - always at the bottom */}
            <div ref={messagesEndRef} className="h-px flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at bottom, always visible */}
      <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur-sm">
        <div className="p-4">
          <div className="relative">
            <Input
              className="pr-32 bg-background border-input"
              placeholder="Share your thoughts with the team..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Voice mode"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                className="h-8 w-8"
                disabled={!input.trim()}
                size="icon"
                onClick={handleSendMessage}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 