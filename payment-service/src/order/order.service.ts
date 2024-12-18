import { PrismaService } from '@/prisma/prisma.service';
import { ReservationService } from '@/reservation/reservation.service';
import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrderService implements OnModuleInit {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reservationService: ReservationService,
    @Inject('ORDER_SERVICE') private readonly kafka: ClientKafka
  ) {}

  async onModuleInit() {
    this.kafka.subscribeToResponseOf('process.payment');
    await this.kafka.connect();
  }

  async create(data: { userId: string; totalAmount: number }) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${data.userId} does not exist.`);
    }

    const order = await this.prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        status: 'CREATED'
      }
    });

    this.logger.log(`Order with ID ${order.id} created successfully`);

    await this.reservationService.reserve(order.id, data.userId, 30);
    this.kafka.send('process.payment', { ...order, userId: data.userId });
    this.logger.log(`Emitted process.payment event for order ID ${order.id}`);
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
