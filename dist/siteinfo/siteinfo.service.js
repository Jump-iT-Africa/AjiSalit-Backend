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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteinfoService = void 0;
const common_1 = require("@nestjs/common");
const siteinfo_schema_1 = require("./enitites/siteinfo.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const console_1 = require("console");
const jsonwebtoken_1 = require("jsonwebtoken");
let SiteinfoService = class SiteinfoService {
    async addSiteInfo(userId, createSiteInfoDto) {
        try {
            console.log("look those info", createSiteInfoDto, userId);
            createSiteInfoDto.adminId = userId;
            let InfoAdded = new this.siteInfoModel(createSiteInfoDto);
            let savingInfo = InfoAdded.save();
            if (!savingInfo) {
                throw new console_1.error("Ops smth went wrong");
            }
            return savingInfo;
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException("Ops you have to login again");
            }
            console.log("there's an error", e);
        }
    }
    async updateSiteInfo(userId, UpdateSiteInfoDto, siteInfoId) {
        try {
            console.log("look those info", UpdateSiteInfoDto, userId);
            UpdateSiteInfoDto.adminId = userId;
            const siteInfo = await this.siteInfoModel.findById(siteInfoId).exec();
            console.log(siteInfoId, siteInfo);
            if (!siteInfo) {
                throw new common_1.NotFoundException("The site information that you are looking for to update not found");
            }
            const updatedsiteInfo = await this.siteInfoModel.findByIdAndUpdate(siteInfoId, UpdateSiteInfoDto, { new: true, runValidators: true }).exec();
            if (!updatedsiteInfo) {
                throw new common_1.BadRequestException("Ops, Couldn't update the siteInfo");
            }
            return updatedsiteInfo;
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException("Ops you have to login again");
            }
            console.log("ops an error", e);
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
        }
    }
};
exports.SiteinfoService = SiteinfoService;
__decorate([
    (0, mongoose_2.InjectModel)(siteinfo_schema_1.SiteInfo.name),
    __metadata("design:type", mongoose_1.Model)
], SiteinfoService.prototype, "siteInfoModel", void 0);
exports.SiteinfoService = SiteinfoService = __decorate([
    (0, common_1.Injectable)()
], SiteinfoService);
//# sourceMappingURL=siteinfo.service.js.map