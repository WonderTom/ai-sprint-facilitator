import { useState, useEffect, useRef, useCallback } from "react";

import {
  OpenAIRealtimeService,
  RealtimeMessage,
  RealtimeSessionConfig,
} from "@/lib/openai-realtime";

export interface UseOpenAIRealtimeOptions {
  apiKey: string;
  config: RealtimeSessionConfig;
  autoConnect?: boolean;
}

export interface UseOpenAIRealtimeReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";

  // Messages
  messages: RealtimeMessage[];

  // Audio/Speech state
  isRecording: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentTranscription: string;

  // Methods
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
  sendTextMessage: (text: string) => void;
  cancelResponse: () => void;
  updateInstructions: (instructions: string) => void;
  clearMessages: () => void;

  // Error handling
  error: Error | null;
  clearError: () => void;
}

export function useOpenAIRealtime({
  apiKey,
  config,
  autoConnect = false,
}: UseOpenAIRealtimeOptions): UseOpenAIRealtimeReturn {
  // Service instance
  const serviceRef = useRef<OpenAIRealtimeService | null>(null);

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");

  // Messages and conversation state
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);

  // Audio/Speech state
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState("");

  // Error handling
  const [error, setError] = useState<Error | null>(null);

  // Initialize service
  useEffect(() => {
    serviceRef.current = new OpenAIRealtimeService(config);

    const service = serviceRef.current;

    // Set up event listeners
    service.on("onConnectionStatusChange", (status) => {
      setConnectionStatus(status);
      setIsConnected(status === "connected");
      setIsConnecting(status === "connecting");
    });

    service.on("onMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    service.on("onTranscription", (text, final) => {
      if (final) {
        setCurrentTranscription("");
      } else {
        setCurrentTranscription(text);
      }
    });

    service.on("onAudioStart", () => {
      setIsSpeaking(true);
    });

    service.on("onAudioEnd", () => {
      setIsSpeaking(false);
    });

    service.on("onSpeechStart", () => {
      setIsListening(true);
    });

    service.on("onSpeechEnd", () => {
      setIsListening(false);
    });

    service.on("onError", (err) => {
      setError(err);
      console.error("OpenAI Realtime error:", err);
    });

    // Auto connect if requested
    if (autoConnect && apiKey) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
      }
    };
  }, [config.model, config.voice, config.temperature]); // Re-initialize if config changes

  // Update instructions when they change
  useEffect(() => {
    if (serviceRef.current && isConnected) {
      serviceRef.current.updateInstructions(config.instructions);
    }
  }, [config.instructions, isConnected]);

  // Connection methods
  const connect = useCallback(async () => {
    if (!serviceRef.current || !apiKey) {
      setError(new Error("Missing API key or service not initialized"));

      return;
    }

    try {
      setError(null);
      await serviceRef.current.connect(apiKey);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [apiKey]);

  const disconnect = useCallback(async () => {
    if (serviceRef.current) {
      await serviceRef.current.disconnect();
      setMessages([]);
      setCurrentTranscription("");
      setIsRecording(false);
      setIsSpeaking(false);
      setIsListening(false);
    }
  }, []);

  // Recording methods
  const startRecording = useCallback(() => {
    if (serviceRef.current && isConnected) {
      serviceRef.current.startRecording();
      setIsRecording(true);
    }
  }, [isConnected]);

  const stopRecording = useCallback(() => {
    if (serviceRef.current && isConnected) {
      serviceRef.current.stopRecording();
      setIsRecording(false);
    }
  }, [isConnected]);

  // Message methods
  const sendTextMessage = useCallback(
    (text: string) => {
      if (serviceRef.current && isConnected && text.trim()) {
        serviceRef.current.sendTextMessage(text.trim());
      }
    },
    [isConnected],
  );

  const cancelResponse = useCallback(() => {
    if (serviceRef.current && isConnected) {
      serviceRef.current.cancelResponse();
    }
  }, [isConnected]);

  const updateInstructions = useCallback(
    (instructions: string) => {
      if (serviceRef.current && isConnected) {
        serviceRef.current.updateInstructions(instructions);
      }
    },
    [isConnected],
  );

  const clearMessages = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.clearMessages();
      setMessages([]);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionStatus,

    // Messages
    messages,

    // Audio/Speech state
    isRecording,
    isSpeaking,
    isListening,
    currentTranscription,

    // Methods
    connect,
    disconnect,
    startRecording,
    stopRecording,
    sendTextMessage,
    cancelResponse,
    updateInstructions,
    clearMessages,

    // Error handling
    error,
    clearError,
  };
}
