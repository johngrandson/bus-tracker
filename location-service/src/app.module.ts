import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CommonModule } from '@/common/common.module';
import { validateEnvironmentVariables } from '@/common/helper/env.validation';
import { DriversModule } from '@/drivers/drivers.module';
import { HealthModule } from '@/health/health.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { TransportModule } from '@/transport/transport.module';
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { env } from 'process';
import { PaymentModule } from '@/payment/payment.module';
import { resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvironmentVariables,
      envFilePath: resolve(__dirname, '../.env'),
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
    TransportModule,
    DriversModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
