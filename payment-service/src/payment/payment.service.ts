import { PrismaService } from '@/prisma/prisma.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('PAYMENT_SERVICE') private readonly paymentProxyClient: ClientKafka
  ) {}

  async processPayment(userId: string, orderId: string, totalAmount: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      try {
        const existingOrder = await tx.order.findUnique({
          where: { id: orderId }
        });

        if (!existingOrder) {
          throw new Error(`Order with ID ${orderId} does not exist.`);
        }

        const payment = await tx.payment.create({
          data: {
            orderId,
            amount: totalAmount,
            currency: 'USD',
            status: 'PENDING'
          }
        });

        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'CONFIRMED' }
        });

        await tx.order.update({
          where: { id: orderId },
          data: { status: 'PROCESSING' }
        });

        this.logger.log(`Payment for order ID ${orderId} processed successfully`);
        this.paymentProxyClient.emit('ticket.deliver.success', {
          userId,
          orderId,
          paymentId: payment.id
        });
      } catch (error) {
        this.processError(userId, error);
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'CANCELED' }
        });
      }
    });
  }

  processError(userId: string, error: any): void {
    this.logger.error(`Error processing payment for user ID ${userId}: ${error}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.paymentProxyClient.emit('payment.error', { userId, error });
  }
}
