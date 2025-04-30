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
let SiteinfoController = class SiteinfoController {
    constructor(siteinfoService) {
        this.siteinfoService = siteinfoService;
    }
    async create(createSiteInfoDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            console.log(infoUser.role);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            if (infoUser.role !== "admin") {
                throw new common_1.ForbiddenException("You are not allowed to add site info");
            }
            const authentificatedId = infoUser.id;
            let infouser = await this.siteinfoService.addSiteInfo(authentificatedId, createSiteInfoDto);
            return infouser;
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException || e instanceof common_1.ForbiddenException) {
                throw e;
            }
            console.log("Ops smth went wrong", e);
        }
    }
    async updateSiteInfo(updateSiteInfoDto, siteInfoId, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            console.log(infoUser.role);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Ops you have to login again");
            }
            if (infoUser.role !== "admin") {
                throw new common_1.ForbiddenException("You are not allowed to update site info");
            }
            const authentificatedId = infoUser.id;
            return this.siteinfoService.updateSiteInfo(authentificatedId, updateSiteInfoDto, siteInfoId);
        }
        catch (e) {
            console.log("there's an error", e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException("Ops you have to login again");
            }
            if (e instanceof common_1.UnauthorizedException || e instanceof common_1.ForbiddenException || e.name === 'CastError' || e.name === 'ValidationError' || e instanceof common_1.NotFoundException || e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw e;
            }
        }
    }
};
exports.SiteinfoController = SiteinfoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_siteinfo_dto_1.CreateSiteInfoDto, Object]),
    __metadata("design:returntype", Promise)
], SiteinfoController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":siteInfoId"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_siteinfo_dto_1.UpdateSiteInfoDto, Object, Object]),
    __metadata("design:returntype", Promise)
], SiteinfoController.prototype, "updateSiteInfo", null);
exports.SiteinfoController = SiteinfoController = __decorate([
    (0, common_1.Controller)('siteinfo'),
    __metadata("design:paramtypes", [siteinfo_service_1.SiteinfoService])
], SiteinfoController);
//# sourceMappingURL=siteinfo.controller.js.map