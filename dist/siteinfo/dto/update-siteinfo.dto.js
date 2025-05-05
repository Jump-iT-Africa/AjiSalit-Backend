"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSiteInfoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_siteinfo_dto_1 = require("./create-siteinfo.dto");
class UpdateSiteInfoDto extends (0, mapped_types_1.PartialType)(create_siteinfo_dto_1.CreateSiteInfoDto) {
}
exports.UpdateSiteInfoDto = UpdateSiteInfoDto;
//# sourceMappingURL=update-siteinfo.dto.js.map