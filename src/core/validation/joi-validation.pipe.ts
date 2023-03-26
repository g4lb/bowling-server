import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: unknown): unknown {
    const res = this.schema.validate(value);
    if (res.error) {
      throw new BadRequestException(res.error.message);
    }
    return res.value;
  }
}
