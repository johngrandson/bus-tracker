import { PrismaService } from '@/prisma/prisma.service';
import { ReservationService } from '@/reservation/reservation.service';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reservationService: ReservationService,
    @Inject('ORDER_SERVICE') private readonly kafka: ClientKafka
  ) {}

  async create(data: { userId: string; totalAmount: number }) {
    try {
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

      this.logger.log(`Processing payment for order ID ${order.id}`);
      void this.process(order, data);

      return order;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.kafka.emit('process.payment.error', {
        error: errorMessage,
        userId: data.userId
      });
      this.logger.error(`Emitted process.payment.error event with error: ${errorMessage}`);
    }
  }

  async process(order: { id: string }, data: { userId: string }) {
    try {
      await this.reservationService.reserve(order.id, data.userId, 30);
      await this.updateStatus(order.id, 'PROCESSING');

      this.kafka.emit('process.payment.success', { ...order, userId: data.userId });
      this.logger.log(`Emitted process.payment.success event for order ID ${order.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.kafka.emit('process.payment.error', {
        error: errorMessage,
        userId: data.userId
      });
      this.logger.error(`Emitted process.payment.error event with error: ${errorMessage}`);
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
