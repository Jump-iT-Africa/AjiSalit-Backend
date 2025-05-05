import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { CreateSiteInfoDto } from './dto/create-siteinfo.dto';
import { validateJwt } from '../services/verifyJwt';
import { SiteinfoService } from './siteinfo.service';
import { JsonWebTokenError } from 'jsonwebtoken';
import { error } from 'console';
import { UpdateSiteInfoDto } from './dto/update-siteinfo.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { responseSiteInfoDTO } from './dto/reponse-siteInfo.dto';

@Controller('siteinfo')
export class SiteinfoController {
    constructor(private readonly siteinfoService: SiteinfoService) { }
    @ApiOperation({ summary: "The admin can create information about AjiSalit('qui sommes nous', 'support', 'privcy policy')..." })
    @ApiBearerAuth()
    @ApiBody({
        type: CreateSiteInfoDto
    })
    @ApiResponse({
        status: 201,
        description: 'The response when the admin created a new site information successfully',
        type: responseSiteInfoDTO,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden error: the user does not have role of admin',
        schema: {
            example: {
                statusCode: 403,
                message: "You are not allowed to add site info",
                error: 'Forbidden error',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request: new exception',
        content: {
            'application/json': {
                examples: {
                    "Empty content or invalid format of it": {
                        value: {
                            "message": [
                                "The content should not be empty",
                                "the content should be text or string"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        },

                    },
                    "Empty title or invalid format of it": {
                        value: {
                            "message": [
                                "The title should be string and shouldn't be empty"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        },

                    },
                    "Something happend that can crash the app": {
                        value: "Ops Something went wrong"
                    },
                },
            },
        }
    })
    @Post()
    async create(@Body() createSiteInfoDto: CreateSiteInfoDto, @Req() req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = validateJwt(token);
            console.log(infoUser.role);
            if (!infoUser) {
                throw new UnauthorizedException("Try to login again")
            }
            if (infoUser.role !== "admin") {
                throw new ForbiddenException("You are not allowed to add site info")
            }
            const authentificatedId = infoUser.id;

            let infouser = await this.siteinfoService.addSiteInfo(authentificatedId, createSiteInfoDto)
            return infouser
        } catch (e) {
            if (e instanceof UnauthorizedException || e instanceof ForbiddenException) {
                throw e
            }
            if (e instanceof JsonWebTokenError) {
                throw new UnauthorizedException("Try to login again")
            }
            throw new BadRequestException("Smth went wrong")
            console.log("Ops smth went wrong", e)
        }
    }

    @Put(":id")
    async updateSiteInfo(@Body() updateSiteInfoDto: UpdateSiteInfoDto, @Param() id, @Req() req) {
        try {
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
            return this.siteinfoService.updateSiteInfo(authentificatedId, updateSiteInfoDto, id)

        } catch (e) {
            console.log("there's an error", e)
            if (e instanceof JsonWebTokenError) {
                throw new UnauthorizedException("Ops you have to login again")
            }
            if (e instanceof UnauthorizedException || e instanceof ForbiddenException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof NotFoundException || e instanceof JsonWebTokenError) {
                throw e
            }
        }
    }


    @Get(":id")
    async showSiteInfo(@Param() id, @Req() req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = validateJwt(token);
            console.log(infoUser.role);
            if (!infoUser) {
                throw new UnauthorizedException("Ops you have to login again")
            }
            return await this.siteinfoService.showSiteInfo(id)

        } catch (e) {
            console.log("there's an error", e)
            if (e instanceof JsonWebTokenError) {
                throw new UnauthorizedException("Ops you have to login again")
            }
            if (e instanceof UnauthorizedException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof NotFoundException || e instanceof JsonWebTokenError) {
                throw e
            }
        }
    }

    @Delete(":id")
    async deleteSiteInfo(@Param() id, @Req() req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = validateJwt(token);
            console.log(infoUser.role);
            if (!infoUser) {
                throw new UnauthorizedException("Ops you have to login again")
            }
            if (infoUser.role !== "admin") {
                throw new ForbiddenException("You are not allowed to update site info")
            }
            return await this.siteinfoService.deleteSiteInfo(id)
        } catch (e) {
            console.log("there's an error", e)
            if (e instanceof UnauthorizedException || e instanceof ForbiddenException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof NotFoundException || e instanceof JsonWebTokenError) {
                throw e
            }
        }
    }
}
