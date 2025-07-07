export interface RealtimeMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  audio?: boolean;
}

export interface RealtimeSessionConfig {
  model: string;
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  instructions: string;
  temperature: number;
}

export interface RealtimeEvents {
  onMessage: (message: RealtimeMessage) => void;
  onTranscription: (text: string, final: boolean) => void;
  onAudioStart: () => void;
  onAudioEnd: () => void;
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
  onError: (error: Error) => void;
  onConnectionStatusChange: (
    status: "connecting" | "connected" | "disconnected" | "error",
  ) => void;
}

export class OpenAIRealtimeService {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private stream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private events: Partial<RealtimeEvents> = {};
  private config: RealtimeSessionConfig;
  private currentMessages: RealtimeMessage[] = [];
  private isRecording = false;

  constructor(config: RealtimeSessionConfig) {
    this.config = config;
    this.setupAudioElement();
  }

  private setupAudioElement() {
    this.audioElement = document.createElement("audio");
    this.audioElement.autoplay = true;
  }

  // Event subscription methods
  on<K extends keyof RealtimeEvents>(event: K, callback: RealtimeEvents[K]) {
    this.events[event] = callback;
  }

  off<K extends keyof RealtimeEvents>(event: K) {
    delete this.events[event];
  }

  private emit<K extends keyof RealtimeEvents>(
    event: K,
    ...args: Parameters<NonNullable<RealtimeEvents[K]>>
  ) {
    const callback = this.events[event] as any;

    if (callback) {
      callback(...args);
    }
  }

  async connect(apiKey: string): Promise<void> {
    try {
      this.emit("onConnectionStatusChange", "connecting");

      // Get user media first
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up audio handling
      this.setupAudioHandling();

      // Create data channel for messaging
      this.dc = this.pc.createDataChannel("oai-events");
      this.setupDataChannelHandlers();

      // Add local audio track
      const audioTrack = this.stream.getAudioTracks()[0];

      this.pc.addTrack(audioTrack, this.stream);

      // Create offer and set local description
      const offer = await this.pc.createOffer();

      await this.pc.setLocalDescription(offer);

      // Send offer to OpenAI
      const response = await this.sendOfferToOpenAI(offer.sdp!, apiKey);

      // Set remote description
      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await response.text(),
      };

      await this.pc.setRemoteDescription(answer);

      // Wait for connection
      await this.waitForConnection();

      this.emit("onConnectionStatusChange", "connected");
    } catch (error) {
      this.emit("onConnectionStatusChange", "error");
      this.emit(
        "onError",
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  private setupAudioHandling() {
    if (!this.pc) return;

    // Handle incoming audio track
    this.pc.ontrack = (event) => {
      if (this.audioElement) {
        this.audioElement.srcObject = event.streams[0];
      }
    };
  }

  private setupDataChannelHandlers() {
    if (!this.dc) return;

    this.dc.addEventListener("open", () => {
      console.log("Data channel opened");
      this.initializeSession();
    });

    this.dc.addEventListener("message", (event) => {
      this.handleServerEvent(JSON.parse(event.data));
    });

    this.dc.addEventListener("error", (event) => {
      console.error("Data channel error:", event);
      this.emit("onError", new Error("Data channel error"));
    });
  }

  private async sendOfferToOpenAI(
    sdp: string,
    apiKey: string,
  ): Promise<Response> {
    const baseUrl = "https://api.openai.com/v1/realtime";

    return fetch(`${baseUrl}?model=${this.config.model}`, {
      method: "POST",
      body: sdp,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/sdp",
      },
    });
  }

  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.pc) {
        reject(new Error("No peer connection"));

        return;
      }

      const timeout = setTimeout(() => {
        reject(
          new Error(
            `Connection timeout. Current state: ${this.pc?.connectionState}`,
          ),
        );
      }, 10000);

      this.pc.addEventListener("connectionstatechange", () => {
        if (this.pc?.connectionState === "connected") {
          clearTimeout(timeout);
          resolve();
        } else if (this.pc?.connectionState === "failed") {
          clearTimeout(timeout);
          reject(new Error("Connection failed"));
        }
      });
    });
  }

  private initializeSession() {
    if (!this.dc || this.dc.readyState !== "open") return;

    // Update session configuration
    const sessionUpdate = {
      type: "session.update",
      session: {
        instructions: this.config.instructions,
        voice: this.config.voice,
        modalities: ["text", "audio"],
        input_audio_transcription: { model: "whisper-1" },
        temperature: this.config.temperature,
      },
    };

    this.dc.send(JSON.stringify(sessionUpdate));

    // Don't send automatic greeting - let the ChatInterface control when to start conversation
  }

  private handleServerEvent(event: any) {
    console.log("Server event:", event.type, event);

    switch (event.type) {
      case "session.created":
        console.log("Session created:", event.session);
        break;

      case "input_audio_buffer.speech_started":
        this.emit("onSpeechStart");
        break;

      case "input_audio_buffer.speech_stopped":
        this.emit("onSpeechEnd");
        break;

      case "conversation.item.input_audio_transcription.completed":
        this.emit("onTranscription", event.transcript, true);
        this.addMessage("user", event.transcript);
        break;

      case "response.audio_transcript.delta":
        this.emit("onTranscription", event.delta, false);
        break;

      case "response.audio_transcript.done":
        this.addMessage("assistant", event.transcript);
        break;

      case "response.audio.delta":
        // Audio chunks are handled automatically by WebRTC
        if (!this.audioElement) {
          this.emit("onAudioStart");
        }
        break;

      case "response.audio.done":
        this.emit("onAudioEnd");
        break;

      case "error":
        this.emit(
          "onError",
          new Error(event.error?.message || "Unknown error"),
        );
        break;

      default:
        // Log other events for debugging
        if (event.type) {
          console.log(`Unhandled event: ${event.type}`);
        }
        break;
    }
  }

  private addMessage(type: "user" | "assistant", content: string) {
    const message: RealtimeMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      audio: true,
    };

    this.currentMessages.push(message);
    this.emit("onMessage", message);
  }

  // Public methods for controlling the session
  startRecording() {
    if (this.isRecording) return;
    this.isRecording = true;
    // Recording is handled automatically by WebRTC audio track
  }

  stopRecording() {
    if (!this.isRecording) return;
    this.isRecording = false;

    if (this.dc && this.dc.readyState === "open") {
      // Commit the audio buffer to process user input
      this.dc.send(JSON.stringify({ type: "input_audio_buffer.commit" }));

      // Request AI response
      this.dc.send(JSON.stringify({ type: "response.create" }));
    }
  }

  sendTextMessage(text: string) {
    if (!this.dc || this.dc.readyState !== "open") return;

    // Create conversation item with text
    const createItem = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    };

    this.dc.send(JSON.stringify(createItem));

    // Request response
    this.dc.send(JSON.stringify({ type: "response.create" }));

    // Add to local messages
    this.addMessage("user", text);
  }

  cancelResponse() {
    if (this.dc && this.dc.readyState === "open") {
      this.dc.send(JSON.stringify({ type: "response.cancel" }));
    }
  }

  updateInstructions(instructions: string) {
    this.config.instructions = instructions;

    if (this.dc && this.dc.readyState === "open") {
      const sessionUpdate = {
        type: "session.update",
        session: { instructions },
      };

      this.dc.send(JSON.stringify(sessionUpdate));
    }
  }

  getMessages(): RealtimeMessage[] {
    return [...this.currentMessages];
  }

  clearMessages() {
    this.currentMessages = [];
  }

  async disconnect() {
    this.emit("onConnectionStatusChange", "disconnected");

    // Clean up audio
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioElement) {
      this.audioElement.srcObject = null;
    }

    // Close data channel
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }

    // Close peer connection
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }

    // Clear events
    this.events = {};
  }

  isConnected(): boolean {
    return (
      this.pc?.connectionState === "connected" && this.dc?.readyState === "open"
    );
  }

  getConnectionState(): string {
    return this.pc?.connectionState || "disconnected";
  }
}
