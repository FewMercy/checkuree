"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_auth_dto_1 = require("../../auth/dto/create-auth.dto");
class UpdateUserDto extends (0, mapped_types_1.PartialType)(create_auth_dto_1.CreateAuthDto) {
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map