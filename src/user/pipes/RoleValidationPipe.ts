import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value || !value.role) {
      throw new BadRequestException("ختار الوضعية ديالك واش نتا شريكة ولا شخص عادي");
    }

    let dtoInstance: UpdateUserDto | UpdateCompanyDto;
    
    if (value.role === 'client') {
      dtoInstance = plainToClass(UpdateUserDto, value);
    } else if (value.role === 'company') {
      dtoInstance = plainToClass(UpdateCompanyDto, value);
    } else {
      throw new BadRequestException("ختار الوضعية ديالك واش نتا شريكة ولا شخص عادي");
    }

    const errors = await validate(dtoInstance, {
      whitelist: false,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        constraints: {
          [Object.keys(error.constraints)[0]]: Object.values(error.constraints)[0]
        }
      }));

      throw new BadRequestException(validationErrors);
    }

    return dtoInstance;
  }
}
