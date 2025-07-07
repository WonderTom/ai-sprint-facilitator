import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Wifi,
  WifiOff,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOpenAIRealtime } from "@/hooks/useOpenAIRealtime";
import { RealtimeMessage } from "@/lib/openai-realtime";

interface SprintPhase {
  name: string;
  description: string;
}

interface ChatInterfaceProps {
  currentPhase: SprintPhase;
  sprintProblem: string;
  user?: {
    name: string;
    role: string;
    organization?: string;
  };
  updateSprintState?: (newState: Partial<{ problem: string }>) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentPhase,
  sprintProblem,
  user,
  updateSprintState,
}) => {
  const [input, setInput] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_OPENAI_API_KEY || ""
  );
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<
    "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
  >("alloy");
  const [unifiedMessages, setUnifiedMessages] = useState<RealtimeMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate instructions for the current phase
  const generateInstructions = () => {
    const userInfo = user 
      ? `You are working with ${user.name}, who is a ${user.role}${user.organization ? ` at ${user.organization}` : ''}.`
      : 'You are working with a design sprint participant.';

    // Include conversation history for context
    const conversationContext = unifiedMessages.length > 0 
      ? `\n\nConversation history:\n${unifiedMessages.map(msg => 
          `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')}\n\nContinue this conversation naturally.`
      : '';

    return `You are an expert AI Design Sprint Facilitator. Your goal is to guide a team through a design sprint. 

${userInfo} Address them by their name and tailor your advice to their role and experience level.

The overall sprint challenge is: "${sprintProblem}"

The current phase is "${currentPhase.name}: ${currentPhase.description}"

Guidelines:
- Keep responses concise, encouraging, and focused on moving the sprint forward
- Ask clarifying questions to prompt discussion and deeper thinking
- Provide practical suggestions and frameworks relevant to the current phase
- Be enthusiastic and supportive while maintaining professionalism
- Use ${user?.name || "their"} name naturally in conversation
- Tailor advice to their role as a ${user?.role || "team member"}
- Don't repeat the phase name in every response

In the ${currentPhase.name} phase, focus on: ${currentPhase.description}${conversationContext}`;
  };

  // Get phase-specific helpful questions/prompts
  const getPhaseSpecificHelp = (phaseName: string) => {
    switch (phaseName) {
      case "Understand":
        return "What questions do you have about your users, the problem space, or the business context? I can help you map out the challenge and identify key areas to explore.";
      case "Ideate":
        return "Ready to brainstorm solutions? I can guide you through sketching exercises, help you think of different approaches, or suggest creative techniques to generate ideas.";
      case "Decide":
        return "Time to evaluate your ideas! I can help you create a decision matrix, facilitate voting, or think through the criteria for choosing the best solution to prototype.";
      case "Prototype":
        return "Let's plan your prototype! What's the core experience you want to test? I can help you decide on fidelity, tools, and the minimum viable version that will give you meaningful feedback.";
      case "Test":
        return "Ready to get user feedback? I can help you plan your testing approach, prepare interview questions, or think through how to capture and analyze insights.";
      default:
        return "What would you like to work on together?";
    }
  };

  // Generate welcome message based on context
  const getWelcomeMessage = () => {
    if (!effectiveApiKey) {
      return "Please ensure your API key is set in settings to start chatting.";
    }

    const hasDefinedProblem = sprintProblem && sprintProblem !== "Define the problem to solve in this sprint.";
    
    if (!hasDefinedProblem) {
      // First time - ask for the challenge
      return `Hello${user ? ` ${user.name}` : ""}! 👋 Welcome to your Design Sprint journey. ${user ? `I'm excited to work with you as a ${user.role}${user.organization ? ` at ${user.organization}` : ""}.` : ""} 

To get started, I'd love to understand **what challenge or problem** you'd like to tackle in this sprint. This could be anything from improving a user experience, solving a business problem, or exploring a new product idea.

**Here are some examples from the banking sector:**
• How might we simplify the mortgage application process for first-time homebuyers?
• How might we create a more intuitive mobile banking experience for senior customers?
• How might we reduce fraud while maintaining a seamless transaction experience?
• How might we design an AI-powered financial advisor that builds customer trust?
• How might we improve the small business loan approval process?

What challenge would you like to work on? Please describe it in your own words.`;
    }

    // Has problem defined - regular phase welcome
    const modeMessage = isVoiceMode && isConnected
      ? "I'm ready to chat with you using voice. Just click the microphone to start!"
      : user
      ? `I'm here to help guide you through this phase, ${user.name}! Type your questions or ideas below, or switch to voice mode if you prefer to speak.`
      : "I'm ready to help! Type your questions or ideas below, or switch to voice mode if you prefer to speak.";

    return `Welcome${user ? ` back ${user.name}` : ""} to the **${currentPhase.name}** phase! ${currentPhase.description}. ${modeMessage}`;
  };

  // Get effective API key (manual input or environment variable)
  const effectiveApiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || "";

  // OpenAI Realtime hook
  const {
    isConnected,
    isConnecting,
    connectionStatus,
    messages,
    isRecording,
    isSpeaking,
    isListening,
    currentTranscription,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    sendTextMessage,
    cancelResponse,
    clearMessages,
    error,
    clearError,
  } = useOpenAIRealtime({
    apiKey: effectiveApiKey,
    config: {
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: selectedVoice,
      instructions: generateInstructions(),
      temperature: 0.7,
    },
    autoConnect: false,
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end", 
        inline: "nearest" 
      });
    }
  };

  // Get unified messages (combining both voice and text modes)
  const currentMessages = unifiedMessages;

  // Auto-scroll when messages change, streaming content updates, or transcription changes
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100); // Small delay to ensure DOM is updated
    return () => clearTimeout(timer);
  }, [currentMessages, currentTranscription, isSpeaking]);

  // Debounced scroll for streaming content to improve performance
  useEffect(() => {
    if (isStreaming && streamingContent) {
      const timer = setTimeout(scrollToBottom, 200); // Less frequent scroll during streaming
      return () => clearTimeout(timer);
    }
  }, [isStreaming, streamingContent]);

  // Scroll to bottom when input is focused
  const handleInputFocus = () => {
    setTimeout(scrollToBottom, 300);
  };

  // Handle connection based on voice mode and API key
  useEffect(() => {
    if (isVoiceMode && effectiveApiKey && !isConnected && !isConnecting) {
      connect();
    } else if ((!isVoiceMode || !effectiveApiKey) && isConnected) {
      disconnect();
    }
  }, [isVoiceMode, effectiveApiKey, isConnected, isConnecting, connect, disconnect]);

  // Handle voice recording toggle
  const toggleRecording = () => {
    if (!isConnected) return;

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle text message sending
  const handleSendText = async () => {
    if (input.trim() === "" || !effectiveApiKey) return;

    const userMessage = input.trim();
    setInput("");

    // Check if this is the challenge definition
    const hasDefinedProblem = sprintProblem && sprintProblem !== "Define the problem to solve in this sprint.";
    if (!hasDefinedProblem && updateSprintState) {
      // Update sprint state with the user's challenge
      updateSprintState({ problem: userMessage });
    }

    if (isVoiceMode && isConnected) {
      // Use realtime API for voice mode
      sendTextMessage(userMessage);
    } else {
      // Use regular OpenAI API for text mode
      await sendTextOnlyMessage(userMessage);
    }
    
    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100);
  };

  // Send text message using regular OpenAI API with streaming
  const sendTextOnlyMessage = async (text: string) => {
    const userMessage: RealtimeMessage = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
      audio: false,
    };

    // Add user message to unified messages
    setUnifiedMessages(prev => [...prev, userMessage]);
    
    // Start streaming state
    setIsStreaming(true);
    setStreamingContent("");
    
    // Scroll to bottom when streaming starts
    setTimeout(scrollToBottom, 100);
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${effectiveApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: generateInstructions(),
            },
            ...unifiedMessages.map(msg => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.content,
            })),
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                if (delta) {
                  fullContent += delta;
                  setStreamingContent(fullContent);
                }
              } catch (e) {
                // Skip invalid JSON chunks
                continue;
              }
            }
          }
        }
      }

      // Create final assistant message
      const assistantMessage: RealtimeMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: fullContent,
        timestamp: new Date(),
        audio: false,
      };

      // Add assistant message to unified messages
      setUnifiedMessages(prev => [...prev, assistantMessage]);
      
      // Clear streaming state
      setIsStreaming(false);
      setStreamingContent("");
    } catch (error) {
      console.error("Error sending text message:", error);
      setIsStreaming(false);
      setStreamingContent("");
      // Handle error - could add error message to chat
    }
  };

  // Sync voice mode messages with unified messages
  useEffect(() => {
    if (isVoiceMode && messages.length > 0) {
      // When in voice mode, sync voice messages to unified messages
      setUnifiedMessages(prevUnified => {
        // Find messages that are new (not already in unified)
        const newMessages = messages.filter(voiceMsg => 
          !prevUnified.some(unifiedMsg => unifiedMsg.id === voiceMsg.id)
        );
        
        if (newMessages.length > 0) {
          return [...prevUnified, ...newMessages];
        }
        return prevUnified;
      });
    }
  }, [isVoiceMode, messages]);

  // Update voice mode instructions when unified messages change
  useEffect(() => {
    if (isVoiceMode && isConnected) {
      // Update instructions to include latest conversation context
      // This ensures voice mode has full context when switching modes
    }
  }, [isVoiceMode, isConnected, unifiedMessages]);

  // Handle phase changes - clear messages and update instructions
  // Only clear when phase actually changes, not on initial load or other state changes
  const previousPhase = useRef(currentPhase);
  useEffect(() => {
    if (previousPhase.current && previousPhase.current.name !== currentPhase.name) {
      // Clear unified messages when phase changes
      setUnifiedMessages([]);
      if (isVoiceMode) {
        clearMessages();
      }
    }
    previousPhase.current = currentPhase;
  }, [currentPhase, clearMessages, isVoiceMode]);

  // Format message text for display
  const formatMessageText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  // Get connection status icon and color
  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case "connected":
        return { icon: Wifi, color: "text-green-500", text: "Connected" };
      case "connecting":
        return { icon: Wifi, color: "text-yellow-500", text: "Connecting..." };
      case "error":
        return { icon: WifiOff, color: "text-red-500", text: "Error" };
      default:
        return { icon: WifiOff, color: "text-gray-500", text: "Disconnected" };
    }
  };

  const statusInfo = getConnectionStatus();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Facilitator
                {isVoiceMode && (
                  <div className="flex items-center gap-1">
                    <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                    <span className={`text-xs ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Guiding your sprint to success
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Settings Dialog */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>OpenAI Realtime Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                                      <div>
                      <Label htmlFor="api-key">OpenAI API Key</Label>
                      <Input
                        id="api-key"
                        placeholder="sk-..."
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {import.meta.env.VITE_OPENAI_API_KEY ? (
                          <span className="text-green-600">
                            ✅ Using environment variable as fallback. You can override it here.
                          </span>
                        ) : (
                          "Required for voice mode. Get your key from OpenAI's platform."
                        )}
                      </p>
                    </div>

                  <div>
                    <Label htmlFor="voice-select">Voice</Label>
                    <Select
                      value={selectedVoice}
                      onValueChange={(value: typeof selectedVoice) =>
                        setSelectedVoice(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alloy">Alloy</SelectItem>
                        <SelectItem value="echo">Echo</SelectItem>
                        <SelectItem value="fable">Fable</SelectItem>
                        <SelectItem value="onyx">Onyx</SelectItem>
                        <SelectItem value="nova">Nova</SelectItem>
                        <SelectItem value="shimmer">Shimmer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Voice Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium" htmlFor="voice-mode">
                Voice Mode
              </Label>
                              <Switch
                  checked={isVoiceMode}
                  disabled={!apiKey && !import.meta.env.VITE_OPENAI_API_KEY}
                  id="voice-mode"
                  onCheckedChange={setIsVoiceMode}
                />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error.message}</span>
            <Button
              className="ml-auto h-6 px-2"
              size="sm"
              variant="ghost"
              onClick={clearError}
            >
              ×
            </Button>
          </div>
        )}

        {/* Voice Mode Status */}
        {isVoiceMode && !apiKey && !import.meta.env.VITE_OPENAI_API_KEY && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-700 rounded-md text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>
              Please set your OpenAI API key in settings to use voice mode.
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div className="flex-1 p-4 pb-8 overflow-y-auto space-y-4 max-h-full scroll-smooth">
          {/* Welcome message when no messages */}
          {currentMessages.length === 0 && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <Bot size={20} />
              </div>
              <div className="max-w-md p-3 rounded-lg bg-muted text-foreground">
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessageText(
                      getWelcomeMessage()
                    ),
                  }}
                />
              </div>
            </div>
          )}

          {/* Messages */}
          {currentMessages.map((msg: RealtimeMessage) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.type === "user" ? "justify-end" : ""}`}
            >
              {msg.type === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <Bot size={20} />
                </div>
              )}
              <div
                className={`max-w-md p-3 rounded-lg ${
                  msg.type === "assistant"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessageText(msg.content),
                  }}
                />
                {msg.type === "assistant" && currentMessages.length > 1 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
                      <ThumbsUp size={14} />
                    </Button>
                    <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
                      <ThumbsDown size={14} />
                    </Button>
                  </div>
                )}
              </div>
              {msg.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center flex-shrink-0">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {/* Streaming message display */}
          {isStreaming && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <Bot size={20} />
              </div>
              <div className="max-w-md p-3 rounded-lg bg-muted text-foreground">
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessageText(streamingContent || ""),
                  }}
                />
                <div className="flex items-center space-x-1 mt-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Typing...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Real-time transcription display */}
          {currentTranscription && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center flex-shrink-0">
                <User size={20} />
              </div>
              <div className="max-w-md p-3 rounded-lg bg-muted/50 text-foreground border-2 border-dashed border-primary/50">
                <em className="text-sm text-muted-foreground">Speaking:</em>{" "}
                {currentTranscription}
              </div>
            </div>
          )}

          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <Bot size={20} />
              </div>
              <div className="max-w-md p-3 rounded-lg bg-muted text-foreground">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Speaking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="relative">
            {isVoiceMode ? (
              // Voice Mode Interface
              <div className="flex items-center justify-center gap-4">
                <Button
                  className={`h-12 px-6 ${
                    isListening && isRecording ? "animate-pulse" : ""
                  }`}
                  disabled={!isConnected}
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>

                {isSpeaking && (
                  <Button
                    className="h-12 px-4"
                    variant="outline"
                    onClick={cancelResponse}
                  >
                    Stop Speaking
                  </Button>
                )}
              </div>
            ) : (
              // Text Mode Interface
              <>
                <Input
                  className="pr-12"
                  disabled={isVoiceMode || !effectiveApiKey || isStreaming}
                  placeholder={
                    !effectiveApiKey
                      ? "Set API key in settings to chat"
                      : isVoiceMode
                      ? "Switch to text mode to type"
                      : isStreaming
                      ? "AI is typing..."
                      : "Type your thoughts or ideas..."
                  }
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                  onFocus={handleInputFocus}
                />
                <Button
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  disabled={!input.trim() || !effectiveApiKey || isStreaming}
                  size="icon"
                  onClick={handleSendText}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Status indicators */}
          <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
            {isVoiceMode ? (
              <>
                {isListening && (
                  <span className="text-green-600">🎤 Listening...</span>
                )}
                {isRecording && !isListening && (
                  <span className="text-blue-600">⏺️ Recording...</span>
                )}
                {isSpeaking && (
                  <span className="text-purple-600">🔊 AI Speaking...</span>
                )}
                {!isConnected && (
                  <span className="text-red-600">❌ Not Connected</span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-blue-600">💬 Text Mode</span>
                {isStreaming && (
                  <span className="text-purple-600">⌨️ AI is typing...</span>
                )}
                {!isStreaming && effectiveApiKey && (
                  <span className="text-green-600">Ready to chat!</span>
                )}
                {!effectiveApiKey && (
                  <span className="text-orange-600">API key required</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
