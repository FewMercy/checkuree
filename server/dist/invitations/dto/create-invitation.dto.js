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
exports.CreateInvitationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const role_type_enum_1 = require("../../roles/const/role-type.enum");
class CreateInvitationDto {
}
exports.CreateInvitationDto = CreateInvitationDto;
__decorate([
    (0, class_validator_1.IsEnum)(role_type_enum_1.RoleType),
    (0, swagger_1.ApiProperty)({
        description: '선택 권한으로 출석부에 초대',
        type: 'enum',
        enum: role_type_enum_1.RoleType,
        example: role_type_enum_1.RoleType.READER,
    }),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: '초대할 출석부의 ID',
        type: 'string',
        example: 'attendance-uuid',
    }),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "attendanceId", void 0);
//# sourceMappingURL=create-invitation.dto.js.map