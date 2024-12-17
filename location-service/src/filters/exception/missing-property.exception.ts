import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MissingPropertyException extends BadRequestException {
  constructor(property: string) {
    super(`Missing ${property} property`);
  }
}
