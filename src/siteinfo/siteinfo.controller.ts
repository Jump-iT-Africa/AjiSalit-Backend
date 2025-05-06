import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateSiteInfoDto } from './dto/create-siteinfo.dto';
import { validateJwt } from '../services/verifyJwt';
import { SiteinfoService } from './siteinfo.service';
import { JsonWebTokenError } from 'jsonwebtoken';
import { error } from 'console';
import { UpdateSiteInfoDto } from './dto/update-siteinfo.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { responseSiteInfoDTO } from './dto/reponse-siteInfo.dto';
import { CompanyRoleGuard } from 'src/user/guards/company-role.guard';
import { AdminRoleGuard } from 'src/user/guards/admin-role.guard';

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
                message: 'kindly try to login again',
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
                message: 'Ops only admins can access to this route',
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
                        value: 'kindly try to login again'
                    },
                },
            },
        }
    })
    @Post()
    @UseGuards(AdminRoleGuard)
    async create(@Body() createSiteInfoDto: CreateSiteInfoDto, @Req() req) {
        try {
            let infouser = await this.siteinfoService.addSiteInfo(req.user.id, createSiteInfoDto)
            return infouser
        } catch (e) {
            if (e instanceof UnauthorizedException || e instanceof ForbiddenException) {
                throw e
            }
            if (e instanceof JsonWebTokenError) {
                throw new UnauthorizedException("Try to login again")
            }
            throw new BadRequestException("Smth went wrong")
        }
    }


    @ApiOperation({summary: "The admin can update the website Information"})
    @ApiBearerAuth()
    @ApiBody({type:CreateSiteInfoDto})
    @ApiResponse({
        status: 200,
        description: 'The response when the admin created a new site information successfully',
        type: responseSiteInfoDTO,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: 'kindly try to login again',
                error: 'Unauthorized error',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: "Bad request error: the website info did not update  or there's bad request error that crash the app",
        schema: {
            example: {
                statusCode: 400,
                message: "Ops, Couldn't update the siteInfo",
                error: 'Bad Request error',
            },
        },
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden error: The users should have admin role to process those method",
        schema: {
            example: {
                statusCode: 403,
                message: 'Osp only admins can access to this route',
                error: 'Forbidden error',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found error: the site info is not found',
        schema: {
            example: {
                statusCode: 404,
                message: "The site information that you are looking for to update does not exist",
                error: 'Not Found',
            },
        },
    })

    @Put(":id")
    @UseGuards(AdminRoleGuard)
    async updateSiteInfo(@Param("id") id:string,@Body() updateSiteInfoDto: UpdateSiteInfoDto, @Req() req) {
        try {
            return this.siteinfoService.updateSiteInfo(req.user.id, updateSiteInfoDto, id)
        } catch (e) {
            if (e instanceof UnauthorizedException || e instanceof ForbiddenException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof NotFoundException || e instanceof JsonWebTokenError || e instanceof BadRequestException) {
                throw e
            }
        }
    }



    @ApiOperation({summary: "All users can see the website Info"})
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'The success response if the users are able to see the website info details ',
        type: responseSiteInfoDTO,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized error: the user is not logged in',
        schema: {
            example: {
                statusCode: 401,
                message: "Ops you have to login again",
                error: 'Unauthorized error',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: "Bad request error: the website info did not show or there's bad request error that crash the app",
        schema: {
            example: {
                statusCode: 400,
                message: "Ops, Couldn't view the website",
                error: 'Bad Request error',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found error: No info website found',
        schema: {
            example: {
                statusCode: 404,
                message: "The site information that you are looking for, does not exist",
                error: 'Not Found',
            },
        },
    })


    @Get(":id")

    async showSiteInfo(@Param("id") id :string, @Req() req) {
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
            throw new BadRequestException("Ops, Couldn't view the website")
        }
    }



    @ApiOperation({summary: "The admin can delete the website info "})
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'The success response if the users are able to see the website info details ',
        example: "The website info was deleted successfully"
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized error: the user is not logged in',
        schema: {
            example: {
                statusCode: 401,
                message: 'kindly try to login again',
                error: 'Unauthorized error',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: "Bad request error: something went wrong",
        schema: {
            example: {
                statusCode: 400,
                message: "Ops can not delete the website ",
                error: 'Bad Request error'
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found error: No website info found',
        schema: {
            example: {
                statusCode: 404,
                message: "The website info not found",
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden error: Only admins can delete site info",
        schema: {
            example: {
                statusCode: 403,
                message: 'Osp only admins can access to this route',
                error: 'Forbidden error',
            },
        },
    })

    @Delete(":id")
    @UseGuards(AdminRoleGuard)
    async deleteSiteInfo(@Param("id") id:string, @Req() req) {
        try {
            return await this.siteinfoService.deleteSiteInfo(id)
        } catch (e) {
            console.log("there's an error", e)
            if (e instanceof UnauthorizedException || e instanceof ForbiddenException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof NotFoundException || e instanceof JsonWebTokenError) {
                throw e
            }
            throw new BadRequestException("Ops can not delete the website ")
        }
    }
}
