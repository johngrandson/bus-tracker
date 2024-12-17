import { DriversController } from '@/drivers/drivers.controller';
import { DriversService } from '@/drivers/drivers.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService]
})
export class DriversModule {}
