import { PaymentController } from '@/payment/payment.controller';
import { PaymentService } from '@/payment/payment.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PAYMENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'payment',
              brokers: [configService.get<string>('KAFKA_BROKER') || 'localhost:9093']
            },
            consumer: {
              groupId: 'payment-consumer'
            }
          }
        })
      }
    ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService]
})
export class PaymentModule {}
