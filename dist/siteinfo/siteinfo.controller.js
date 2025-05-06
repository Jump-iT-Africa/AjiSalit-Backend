"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteinfoController = void 0;
const common_1 = require("@nestjs/common");
const create_siteinfo_dto_1 = require("./dto/create-siteinfo.dto");
const verifyJwt_1 = require("../services/verifyJwt");
const siteinfo_service_1 = require("./siteinfo.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const update_siteinfo_dto_1 = require("./dto/update-siteinfo.dto");
const swagger_1 = require("@nestjs/swagger");
const reponse_siteInfo_dto_1 = require("./dto/reponse-siteInfo.dto");
const admin_role_guard_1 = require("../user/guards/admin-role.guard");
let SiteinfoController = class SiteinfoController {
    constructor(siteinfoService) {
        this.siteinfoService = siteinfoService;
    }
    async create(createSiteInfoDto, req) {
        try {
            let infouser = await this.siteinfoService.addSiteInfo(req.user.id, createSiteInfoDto);
            return infouser;
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException || e instanceof common_1.ForbiddenException) {
                throw e;
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            throw new common_1.BadRequestException("Smth went wrong");
        }
    }
    async updateSiteInfo(id, updateSiteInfoDto, req) {
        try {
            return this.siteinfoService.updateSiteInfo(req.user.id, updateSiteInfoDto, id);
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException || e instanceof common_1.ForbiddenException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof common_1.NotFoundException || e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof common_1.BadRequestException) {
                throw e;
            }
        }
    }
    async showSiteInfo(id, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            console.log(infoUser.role);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Ops you have to login again");
            }
            return await this.siteinfoService.showSiteInfo(id);
        }
        catch (e) {
            console.log("there's an error", e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException("Ops you have to login again");
            }
            if (e instanceof common_1.UnauthorizedException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof common_1.NotFoundException || e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw e;
            }
            throw new common_1.BadRequestException("Ops, Couldn't view the website");
        }
    }
    async deleteSiteInfo(id, req) {
        try {
            return await this.siteinfoService.deleteSiteInfo(id);
        }
        catch (e) {
            console.log("there's an error", e);
            if (e instanceof common_1.UnauthorizedException || e instanceof common_1.ForbiddenException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof common_1.NotFoundException || e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw e;
            }
            throw new common_1.BadRequestException("Ops can not delete the website ");
        }
    }
};
exports.SiteinfoController = SiteinfoController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "The admin can create information about AjiSalit('qui sommes nous', 'support', 'privcy policy')..." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: create_siteinfo_dto_1.CreateSiteInfoDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The response when the admin created a new site information successfully',
        type: reponse_siteInfo_dto_1.responseSiteInfoDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: 'kindly try to login again',
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden error: the user does not have role of admin',
        schema: {
            example: {
                statusCode: 403,
                message: 'Ops only admins can access to this route',
                error: 'Forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_siteinfo_dto_1.CreateSiteInfoDto, Object]),
    __metadata("design:returntype", Promise)
], SiteinfoController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "The admin can update the website Information" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({ type: create_siteinfo_dto_1.CreateSiteInfoDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The response when the admin created a new site information successfully',
        type: reponse_siteInfo_dto_1.responseSiteInfoDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: 'kindly try to login again',
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad request error: the website info did not update  or there's bad request error that crash the app",
        schema: {
            example: {
                statusCode: 400,
                message: "Ops, Couldn't update the siteInfo",
                error: 'Bad Request error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Forbidden error: The users should have admin role to process those method",
        schema: {
            example: {
                statusCode: 403,
                message: 'Osp only admins can access to this route',
                error: 'Forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found error: the site info is not found',
        schema: {
            example: {
                statusCode: 404,
                message: "The site information that you are looking for to update does not exist",
                error: 'Not Found',
            },
        },
    }),
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_siteinfo_dto_1.UpdateSiteInfoDto, Object]),
    __metadata("design:returntype", Promise)
], SiteinfoController.prototype, "updateSiteInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "All users can see the website Info" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The success response if the users are able to see the website info details ',
        type: reponse_siteInfo_dto_1.responseSiteInfoDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in',
        schema: {
            example: {
                statusCode: 401,
                message: "Ops you have to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad request error: the website info did not show or there's bad request error that crash the app",
        schema: {
            example: {
                statusCode: 400,
                message: "Ops, Couldn't view the website",
                error: 'Bad Request error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found error: No info website found',
        schema: {
            example: {
                statusCode: 404,
                message: "The site information that you are looking for, does not exist",
                error: 'Not Found',
            },
        },
    }),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiteinfoController.prototype, "showSiteInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "The admin can delete the website info " }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The success response if the users are able to see the website info details ',
        example: "The website info was deleted successfully"
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in',
        schema: {
            example: {
                statusCode: 401,
                message: 'kindly try to login again',
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad request error: something went wrong",
        schema: {
            example: {
                statusCode: 400,
                message: "Ops can not delete the website ",
                error: 'Bad Request error'
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found error: No website info found',
        schema: {
            example: {
                statusCode: 404,
                message: "The website info not found",
                error: 'Not Found',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Forbidden error: Only admins can delete site info",
        schema: {
            example: {
                statusCode: 403,
                message: 'Osp only admins can access to this route',
                error: 'Forbidden error',
            },
        },
    }),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiteinfoController.prototype, "deleteSiteInfo", null);
exports.SiteinfoController = SiteinfoController = __decorate([
    (0, common_1.Controller)('siteinfo'),
    __metadata("design:paramtypes", [siteinfo_service_1.SiteinfoService])
], SiteinfoController);
//# sourceMappingURL=siteinfo.controller.js.map