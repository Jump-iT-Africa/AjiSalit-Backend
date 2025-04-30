"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteinfoModule = void 0;
const common_1 = require("@nestjs/common");
const siteinfo_controller_1 = require("./siteinfo.controller");
const siteinfo_service_1 = require("./siteinfo.service");
const mongoose_1 = require("@nestjs/mongoose");
const siteinfo_schema_1 = require("./enitites/siteinfo.schema");
let SiteinfoModule = class SiteinfoModule {
};
exports.SiteinfoModule = SiteinfoModule;
exports.SiteinfoModule = SiteinfoModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: siteinfo_schema_1.SiteInfo.name, schema: siteinfo_schema_1.SiteInfoSchema }])],
        controllers: [siteinfo_controller_1.SiteinfoController],
        providers: [siteinfo_service_1.SiteinfoService]
    })
], SiteinfoModule);
//# sourceMappingURL=siteinfo.module.js.map