import { OrderController } from '@/order/order.controller';
import { OrderService } from '@/order/order.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ReservationService } from '@/reservation/reservation.service';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'order_queue',
          queueOptions: { durable: true }
        }
      }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, ReservationService, PrismaService]
})
export class OrderModule {}
