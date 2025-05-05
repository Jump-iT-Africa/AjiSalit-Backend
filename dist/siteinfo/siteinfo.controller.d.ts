import { CreateSiteInfoDto } from './dto/create-siteinfo.dto';
import { SiteinfoService } from './siteinfo.service';
import { UpdateSiteInfoDto } from './dto/update-siteinfo.dto';
export declare class SiteinfoController {
    private readonly siteinfoService;
    constructor(siteinfoService: SiteinfoService);
    create(createSiteInfoDto: CreateSiteInfoDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./enitites/siteinfo.schema").SiteInfoDocument> & import("./enitites/siteinfo.schema").SiteInfo & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateSiteInfo(updateSiteInfoDto: UpdateSiteInfoDto, id: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./enitites/siteinfo.schema").SiteInfoDocument> & import("./enitites/siteinfo.schema").SiteInfo & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    showSiteInfo(id: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./enitites/siteinfo.schema").SiteInfoDocument> & import("./enitites/siteinfo.schema").SiteInfo & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteSiteInfo(id: any, req: any): Promise<string>;
}
