import io, { Socket } from 'socket.io-client';

interface SocketConfig {
  url: string;
  path: string;
  onConnected: () => void;
  onDisconnect: () => void; 
  getAccessToken?: () => string | null; 
}

export default class SocketIOClient {
  private socket: Socket | null;
  private config: SocketConfig;

  constructor(config: SocketConfig) {
    this.config = config;
    this.socket = null;
    this.setup();
  }

  private setup() {
    const options = {
      path: this.config.path,
      autoConnect: false,
      transports: ['polling'], // https://socket.io/how-to/use-with-jwt, must use http-polling for add token to headers
      reconnectionAttempts: Infinity, // Infinity
      reconnectionDelay: 1000,
      withCredentials: true,
      upgrade: true,
    };
    this.socket = io(this.config.url, options);

    this.socket.on('connect', () => {
      console.log('>>> socket.io connected:', this.socket?.id);
      this.config.onConnected();
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('>>> socket.io disconnected:', reason);
      this.config.onDisconnect();
    });

    this.socket.on('connect_error', (error: Error) => {
      console.log('>>> socket.io error:', error.message);
    });
  }

  connect(): void {
    if (!this.socket) return;

    const token = this.config.getAccessToken ? this.config.getAccessToken() : null;
    if (!token) {
      console.log('Missing access token when connecting socket.');
      return;
    }
    this.socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${token}`
    };
    this.socket?.connect();
  }

  reconnect(): void {
    if (!this.socket?.connected) return;
    this.socket?.disconnect();
    setTimeout(() => this.connect());
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

  subscribe(event: string, callback: (arg: any) => void) {
    const isSubscribed = (this.socket?.listeners(event)?.length ?? 0) > 0;
    if (!isSubscribed) {
      console.log('>>> subscribe on', event);
      this.socket?.on(event, (arg) => callback(arg));
    }
  }

  unsubscribe(event: string) {
    if (!this.socket) return;
    const isSubscribed = this.socket.listeners(event).length > 0;
    if (isSubscribed) {
      console.log('>>> unsubscribe on', event);
      this.socket?.off(event);
    }
  }
  

  get connected(): boolean {
    return !!this.socket && this.socket.connected;
  }
}

export const socketClient = new SocketIOClient({
  url: import.meta.env.VITE_BE_API!,
  path: '/socket',
  onConnected: () => console.log('[socket] connected'),
  onDisconnect: () => console.log('[socket] disconnected'),
  getAccessToken: () => localStorage.getItem('accessToken'),
});