import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SiteInfo, SiteInfoDocument } from './enitites/siteinfo.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class SiteinfoService {
    @InjectModel(SiteInfo.name) private readonly siteInfoModel: Model<SiteInfoDocument>

    async addSiteInfo(userId, createSiteInfoDto){
        try{
            console.log("look those info", createSiteInfoDto,userId)
            createSiteInfoDto.adminId = userId
            let InfoAdded = new this.siteInfoModel(createSiteInfoDto);
            let savingInfo = InfoAdded.save();
            if(!savingInfo){
                throw new error("Ops smth went wrong")
            }
            return savingInfo
        }catch(e){
            if(e instanceof JsonWebTokenError){
                throw new UnauthorizedException('kindly try to login again')
            }
            console.log("there's an error",e)
        }
    }

    async updateSiteInfo(userId, UpdateSiteInfoDto,id){
        try{
            UpdateSiteInfoDto.adminId = userId
            const siteInfo = await this.siteInfoModel.findById(id).exec();
      
            if (!siteInfo) {
              throw new NotFoundException("The site information that you are looking for to update does not exist");
            }
            const updatedsiteInfo = await this.siteInfoModel.findByIdAndUpdate( id, UpdateSiteInfoDto,{ new: true, runValidators: true }).exec();
            if(!updatedsiteInfo){
                throw new BadRequestException("Ops, Couldn't update the siteInfo")
            }
            return updatedsiteInfo

        }catch(e){
            if(e instanceof JsonWebTokenError){
                throw new UnauthorizedException("Ops you have to login again")
            }
            console.log("ops an error", e)
              if (e instanceof NotFoundException || e instanceof BadRequestException) {
                throw e;
              }
        }
    }

    async showSiteInfo(titre){
        try{
            const siteInfo = await this.siteInfoModel.findOne({title:titre}).exec();
            if (!siteInfo) {
              throw new NotFoundException("The site information that you are looking for, does not exist");
            }
            return siteInfo
        }catch(e){
            console.log("there's an error", e)
            if(e instanceof NotFoundException){
                throw e
            }
        }
    }

    async deleteSiteInfo(id){
        try{
            let siteInfo = await this.siteInfoModel.findById(id.id)
            if (!siteInfo) {
              throw new NotFoundException("The website info not found")
            }
            let deleteSiteInfo = await this.siteInfoModel.findByIdAndDelete(id.id).exec();
            if(!deleteSiteInfo){
                throw new BadRequestException("Ops can not delete the website ")
            }
            return "The website info was deleted successfully"

        }catch(e){
            console.log("there's an error",e)
            if(e instanceof NotFoundException || e instanceof BadRequestException){
                throw e 
            }
        }
    }
}
