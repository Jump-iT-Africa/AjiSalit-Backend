import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
export declare class RoleValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): Promise<UpdateCompanyDto | UpdateUserDto>;
}
