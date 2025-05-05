import { SiteInfo, SiteInfoDocument } from './enitites/siteinfo.schema';
export declare class SiteinfoService {
    private readonly siteInfoModel;
    addSiteInfo(userId: any, createSiteInfoDto: any): Promise<import("mongoose").Document<unknown, {}, SiteInfoDocument> & SiteInfo & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateSiteInfo(userId: any, UpdateSiteInfoDto: any, id: any): Promise<import("mongoose").Document<unknown, {}, SiteInfoDocument> & SiteInfo & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    showSiteInfo(id: any): Promise<import("mongoose").Document<unknown, {}, SiteInfoDocument> & SiteInfo & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteSiteInfo(id: any): Promise<string>;
}
