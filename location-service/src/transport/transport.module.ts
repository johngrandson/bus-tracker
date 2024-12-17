import { DriversModule } from '@/drivers/drivers.module';
import { TransportGateway } from '@/transport/transport.gateway';
import { TransportService } from '@/transport/transport.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DriversModule],
  providers: [TransportGateway, TransportService]
})
export class TransportModule {}
