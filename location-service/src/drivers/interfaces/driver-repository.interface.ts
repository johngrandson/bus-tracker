import { IDriverLocation } from '@/drivers/types/driver-location.type';

export interface DriverRepository {
  updateLocation(id: string, latitude: number, longitude: number): Promise<void>;
  getAllLocations(): Promise<IDriverLocation[]>;
  getLocationById(id: string): Promise<IDriverLocation>;
}
