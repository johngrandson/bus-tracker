import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { GeoUtils } from '@/common/helper/geo-utils';
import { DriversService } from '@/drivers/drivers.service';
import { IDriverLocation } from '@/drivers/types/driver-location.type';
import { TransportService } from '@/transport/transport.service';

@WebSocketGateway()
export class TransportGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Socket;

  private readonly logger = new Logger(TransportGateway.name);

  constructor(
    private readonly driversService: DriversService,
    private readonly transportService: TransportService
  ) {}

  afterInit(): void {
    this.transportService.afterInit();
  }

  handleConnection(client: Socket): void {
    this.transportService.handleConnection(client);
  }

  handleDisconnect(client: Socket): void {
    this.transportService.handleDisconnect(client);
  }

  @SubscribeMessage('handleLocation')
  async handleLocation(client: Socket, data: IDriverLocation): Promise<void> {
    this.logger.log(`Location received: ${JSON.stringify(data)}`);

    if (this.server) {
      await this.driversService.updateLocation(data.id, data.latitude, data.longitude);
      this.transportService.broadcast('locationUpdate', data);

      const isNearby = GeoUtils.checkProximity(data.latitude, data.longitude, -23.55, -46.63);

      if (isNearby) {
        this.transportService.emitToClient(client.id, 'nearbyAlert', {
          message: `You are near to driver ${data.id}`
        });
      }
    } else {
      console.error('WebSocket server is not initialized yet.');
    }
  }
}
