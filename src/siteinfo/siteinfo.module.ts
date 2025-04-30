import { Module } from '@nestjs/common';
import { SiteinfoController } from './siteinfo.controller';
import { SiteinfoService } from './siteinfo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteInfo, SiteInfoSchema } from './enitites/siteinfo.schema';

@Module({
  imports: [MongooseModule.forFeature([ {name: SiteInfo.name, schema: SiteInfoSchema}])],
  controllers: [SiteinfoController],
  providers: [SiteinfoService]
})
export class SiteinfoModule {}
