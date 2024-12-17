import { DriversService } from '@/drivers/drivers.service';
import { IDriverLocation } from '@/drivers/types/driver-location.type';
import { Controller, Get } from '@nestjs/common';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('locations')
  async getAllLocations(): Promise<IDriverLocation[]> {
    return this.driversService.getAllLocations();
  }

  @Get('locations/:id')
  getLocationById(id: string): Promise<IDriverLocation> {
    return this.driversService.getLocationById(id);
  }
}
