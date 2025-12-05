import { io, Socket } from 'socket.io-client';
import type { WSMessage, SystemMetrics } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'wss://web-production-16fdb.up.railway.app';

type MessageHandler = (message: WSMessage) => void;
type MetricsHandler = (metrics: SystemMetrics) => void;
type ConnectionHandler = (connected: boolean) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private metricsHandlers: Set<MetricsHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): void {
    if (this.socket?.connected) {
      console.log('[WS] Already connected');
      return;
    }

    console.log('[WS] Connecting to', WS_URL);

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('[WS] Connected');
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WS] Disconnected:', reason);
      this.notifyConnectionHandlers(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WS] Connection error:', error.message);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('[WS] Max reconnection attempts reached');
      }
    });

    // Handle incoming messages
    this.socket.on('message', (data: WSMessage) => {
      console.log('[WS] Message received:', data);
      this.notifyMessageHandlers(data);

      // If message contains metrics, notify metrics handlers
      if (data.metrics) {
        this.notifyMetricsHandlers(data.metrics);
      }
    });

    // Handle system updates
    this.socket.on('system_update', (data: { metrics: SystemMetrics }) => {
      this.notifyMetricsHandlers(data.metrics);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  send(message: string | object): void {
    if (this.socket?.connected) {
      const payload = typeof message === 'string' ? message : JSON.stringify(message);
      this.socket.emit('message', payload);
    } else {
      console.warn('[WS] Cannot send - not connected');
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onMetrics(handler: MetricsHandler): () => void {
    this.metricsHandlers.add(handler);
    return () => this.metricsHandlers.delete(handler);
  }

  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  private notifyMessageHandlers(message: WSMessage): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('[WS] Message handler error:', error);
      }
    });
  }

  private notifyMetricsHandlers(metrics: SystemMetrics): void {
    this.metricsHandlers.forEach((handler) => {
      try {
        handler(metrics);
      } catch (error) {
        console.error('[WS] Metrics handler error:', error);
      }
    });
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => {
      try {
        handler(connected);
      } catch (error) {
        console.error('[WS] Connection handler error:', error);
      }
    });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
export default wsService;
