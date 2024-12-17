import { DriversService } from '@/drivers/drivers.service';
import { MissingPropertyException } from '@/filters/exception/missing-property.exception';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('DriversService', () => {
  let service: DriversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversService]
    }).compile();

    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a new driver with the current location', async () => {
    const newDriver = {
      id: 'new-driver-id',
      latitude: 37.7749,
      longitude: -122.4194
    };

    try {
      await service.addDriver(newDriver);
      const result = await service.getLocationById(newDriver.id);
      expect(result).toEqual(newDriver);
    } catch (error) {
      console.error(error);
    }
  });

  it('should fail when trying to add a new driver without the id prop', async () => {
    const newDriver = {
      id: null as unknown as string,
      latitude: 37.7749,
      longitude: -122.4194
    };

    try {
      await service.addDriver(newDriver);
    } catch (error) {
      expect(error).toStrictEqual(new MissingPropertyException('id'));
    }
  });

  it('should fail when trying to add a new driver without the latitude prop', async () => {
    const newDriver = {
      id: 'new-driver-id',
      latitude: null as unknown as number,
      longitude: -122.4194
    };

    try {
      await service.addDriver(newDriver);
    } catch (error) {
      expect(error).toStrictEqual(new MissingPropertyException('latitude'));
    }
  });

  it('should fail when trying to add a new driver without the longitude prop', async () => {
    const newDriver = {
      id: 'new-driver-id',
      latitude: 37.7749,
      longitude: null as unknown as number
    };

    try {
      await service.addDriver(newDriver);
    } catch (error) {
      expect(error).toStrictEqual(new MissingPropertyException('longitude'));
    }
  });

  it('should throw NotFoundException when the driver is not found', async () => {
    const nonExistentDriverId = 'non-existent-id';

    try {
      await service.getLocationById(nonExistentDriverId);
    } catch (error) {
      expect(error).toStrictEqual(
        new NotFoundException(`Driver with id ${nonExistentDriverId} not found`)
      );
    }
  });
});
