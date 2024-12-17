/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/require-await */
import { PropValidator } from '@/common/helper/prop-validator';
import { DriverRepository } from '@/drivers/interfaces/driver-repository.interface';
import { IDriverLocation } from '@/drivers/types/driver-location.type';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DriversService implements DriverRepository {
  private readonly drivers: Map<string, IDriverLocation> = new Map();

  async addDriver({ id, latitude, longitude }: IDriverLocation): Promise<void> {
    PropValidator.validator<IDriverLocation>({ id, latitude, longitude }, [
      'id',
      'latitude',
      'longitude'
    ]);

    await this.drivers.set(id, { id, latitude, longitude });
  }
  async getAllLocations(): Promise<IDriverLocation[]> {
    return Array.from(this.drivers.values());
  }

  async getLocationById(id: string): Promise<IDriverLocation> {
    PropValidator.validator<Pick<IDriverLocation, 'id'>>({ id }, ['id']);

    const driver = this.drivers.get(id);

    if (!driver) {
      throw new NotFoundException(`Driver with id ${id} not found`);
    }

    return Promise.resolve(driver);
  }

  async updateLocation(id: string, latitude: number, longitude: number): Promise<void> {
    if (!this.drivers.has(id)) {
      throw new NotFoundException(`Driver with id ${id} not found`);
    }

    await this.drivers.set(id, { id, latitude, longitude });
  }
}
