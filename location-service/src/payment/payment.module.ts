import { Module } from '@nestjs/common';
import { PaymentController } from '@/payment/payment.controller';
import { PaymentService } from '@/payment/payment.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
