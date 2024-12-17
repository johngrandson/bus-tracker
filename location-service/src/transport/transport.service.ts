import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class TransportService {
  private readonly connectedClients: Map<string, Socket> = new Map();
  private readonly logger = new Logger(TransportService.name);

  constructor() {}

  afterInit(): void {
    this.logger.log('Initialized');
  }

  handleConnection(socket: Socket): void {
    const clientId = socket.id;

    this.connectedClients.set(clientId, socket);
    this.logger.log(`Client connected: ${clientId}`);
  }

  handleDisconnect(socket: Socket): void {
    const clientId = socket.id;

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
      this.logger.log(`Client disconnected: ${clientId}`);
    });
  }

  emitToClient(clientId: string, event: string, data: any): void {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  broadcast(event: string, data: any): void {
    this.connectedClients.forEach((client) => {
      client.emit(event, data);
    });
  }

  getAllClients(): string[] {
    return Array.from(this.connectedClients.keys());
  }
}
