import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CommonModule } from '@/common/common.module';
import { validateEnvironmentVariables } from '@/common/helper/env.validation';
import { HealthModule } from '@/health/health.module';
import { OrderModule } from '@/order/order.module';
import { PaymentModule } from '@/payment/payment.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProcessModule } from '@/process/process.module';
import { ReservationModule } from '@/reservation/reservation.module';
import { WorkerModule } from '@/worker/worker.module';
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { env } from 'process';
import { UserModule } from '@/user/user.module';
import { TicketModule } from '@/ticket/ticket.module';
import { QRCodeService } from '@/qrcode/qrcode.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvironmentVariables,
      isGlobal: true,
      cache: true
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined
      },
      forRoutes: ['*'],
      exclude: [{ method: RequestMethod.ALL, path: 'health' }]
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    HealthModule,
    PrismaModule,
    PaymentModule,
    ProcessModule,
    ReservationModule,
    WorkerModule,
    OrderModule,
    UserModule,
    TicketModule
  ],
  controllers: [AppController],
  providers: [AppService, QRCodeService]
})
export class AppModule {}
