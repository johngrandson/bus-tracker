import { PrismaService } from '@/prisma/prisma.service';
import { ReservationService } from '@/reservation/reservation.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reservationService: ReservationService,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitMQClient: ClientProxy
  ) {}

  async create(data: { userId: string; totalAmount: number }) {
    const order = await this.prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        status: 'CREATED'
      }
    });

    this.logger.log(`Order with ID ${order.id} created successfully`);

    await this.reservationService.reserve(order.id, data.userId, 30);

    try {
      this.rabbitMQClient.emit('payment.create', {
        id: order.id,
        totalAmount: data.totalAmount,
        userId: data.userId
      });

      this.logger.log(`Emitted payment.create event for order ID ${order.id}`);
    } catch (error) {
      if (error instanceof Error) {
        await this.prisma.order.delete({ where: { id: data.userId } });
        // TODO: Send to DLQ
      }
    }
  }

  async updateStatus(orderId: string, status: 'CREATED' | 'COMPLETED' | 'PROCESSING' | 'CANCELED') {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} does not exist.`);
    }

    return await this.prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }

  async getById(orderId: string) {
    return await this.prisma.order.findUnique({
      where: { id: orderId }
    });
  }
}
