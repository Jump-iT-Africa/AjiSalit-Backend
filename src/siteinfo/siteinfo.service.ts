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
                throw new UnauthorizedException("Ops you have to login again")
            }
            console.log("there's an error",e)
        }
    }

    async updateSiteInfo(userId, UpdateSiteInfoDto,siteInfoId){
        try{
            console.log("look those info", UpdateSiteInfoDto,userId)
            UpdateSiteInfoDto.adminId = userId
            const siteInfo = await this.siteInfoModel.findById(siteInfoId).exec();
            console.log(siteInfoId, siteInfo);
      
            if (!siteInfo) {
              throw new NotFoundException("The site information that you are looking for to update not found");
            }
            const updatedsiteInfo = await this.siteInfoModel.findByIdAndUpdate( siteInfoId, UpdateSiteInfoDto,{ new: true, runValidators: true }).exec();
            if(!updatedsiteInfo){
                throw new BadRequestException("Ops, Couldn't update the siteInfo")
            }

            return updatedsiteInfo

        }catch(e){
            if(e instanceof JsonWebTokenError){
                throw new UnauthorizedException("Ops you have to login again")
            }
            console.log("ops an error", e)
              if (e instanceof NotFoundException) {
                throw e;
              }
        }
    }
}
