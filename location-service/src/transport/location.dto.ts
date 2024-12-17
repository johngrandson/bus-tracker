import { IsNumber, IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  id!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}
