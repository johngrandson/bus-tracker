import { MissingPropertyException } from '@/filters/exception/missing-property.exception';

export class PropValidator {
  static validator<T>(entity: Partial<T>, requiredProperties: string[]): void {
    for (const property of requiredProperties) {
      if (!(property in entity)) {
        throw new MissingPropertyException(property);
      }
    }
  }
}
