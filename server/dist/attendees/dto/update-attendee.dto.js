"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAttendeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_attendee_dto_1 = require("./create-attendee.dto");
class UpdateAttendeeDto extends (0, swagger_1.PartialType)(create_attendee_dto_1.CreateAttendeeDto) {
}
exports.UpdateAttendeeDto = UpdateAttendeeDto;
//# sourceMappingURL=update-attendee.dto.js.map