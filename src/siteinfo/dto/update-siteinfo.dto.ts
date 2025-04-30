import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteInfoDto } from './create-siteinfo.dto';

export class UpdateSiteInfoDto extends PartialType(CreateSiteInfoDto) {}
