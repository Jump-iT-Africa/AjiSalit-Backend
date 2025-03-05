"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommandDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_command_dto_1 = require("./create-command.dto");
class UpdateCommandDto extends (0, mapped_types_1.PartialType)(create_command_dto_1.CreateCommandDto) {
}
exports.UpdateCommandDto = UpdateCommandDto;
//# sourceMappingURL=update-command.dto.js.map