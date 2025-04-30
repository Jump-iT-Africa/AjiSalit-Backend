import { Body, Controller, ForbiddenException, NotFoundException, Param, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { CreateSiteInfoDto } from './dto/create-siteinfo.dto';
import { validateJwt } from '../services/verifyJwt';
import { SiteinfoService } from './siteinfo.service';
import { JsonWebTokenError } from 'jsonwebtoken';
import { error } from 'console';
import { UpdateSiteInfoDto } from './dto/update-siteinfo.dto';

@Controller('siteinfo')
export class SiteinfoController {
    constructor(private readonly siteinfoService:SiteinfoService) {}
    @Post()
    async create(@Body() createSiteInfoDto:CreateSiteInfoDto, @Req() req){
        try{
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = validateJwt(token);
            console.log(infoUser.role);
            if (!infoUser) {
              throw new UnauthorizedException("Try to login again")
            }
            if (infoUser.role !== "admin") {
                // console.log("infoooooo", infoUser.role)
              throw new ForbiddenException("You are not allowed to add site info")
            }
            const authentificatedId = infoUser.id;

            let infouser = await this.siteinfoService.addSiteInfo(authentificatedId, createSiteInfoDto)
            return infouser
        }catch(e){
            if(e instanceof UnauthorizedException || e instanceof ForbiddenException){
                throw e
            }
            console.log("Ops smth went wrong", e)
        }
    }

    @Put(":siteInfoId")
    async updateSiteInfo(@Body() updateSiteInfoDto:UpdateSiteInfoDto,@Param() siteInfoId, @Req() req){
        try{
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = validateJwt(token);
            console.log(infoUser.role);
            if (!infoUser) {
              throw new UnauthorizedException("Ops you have to login again")
            }
            if (infoUser.role !== "admin") {
              throw new ForbiddenException("You are not allowed to update site info")
            }
            const authentificatedId = infoUser.id;
            return this.siteinfoService.updateSiteInfo(authentificatedId,updateSiteInfoDto,siteInfoId)

        }catch(e){
            console.log("there's an error",e)
            if(e instanceof JsonWebTokenError){
                throw new UnauthorizedException("Ops you have to login again")
            }
            if(e instanceof UnauthorizedException || e instanceof ForbiddenException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof NotFoundException || e instanceof JsonWebTokenError){
                throw e
            }
        }
    }
}
