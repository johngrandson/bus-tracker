import { OrderController } from '@/order/order.controller';
import { OrderService } from '@/order/order.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ReservationService } from '@/reservation/reservation.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ORDER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'order',
              brokers: [configService.get<string>('KAFKA_BROKER') || 'localhost:9093']
            },
            consumer: {
              groupId: 'order-consumer'
            }
          }
        })
      }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, ReservationService, PrismaService]
})
export class OrderModule {}
