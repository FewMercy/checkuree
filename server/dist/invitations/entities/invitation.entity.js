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
exports.Invitation = void 0;
const BaseTimeEntity_1 = require("../../common/BaseTimeEntity");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const role_type_enum_1 = require("../../roles/const/role-type.enum");
const user_entity_1 = require("../../users/entities/user.entity");
const invitation_status_enum_1 = require("../invitation-status.enum");
let Invitation = class Invitation extends BaseTimeEntity_1.BaseTimeEntity {
};
exports.Invitation = Invitation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { comment: '출석부 초대 PK', type: 'int' }),
    (0, swagger_1.ApiProperty)({ description: '출석부 초대 PK', type: 'int' }),
    __metadata("design:type", Number)
], Invitation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '초대 받은 출석부 ID', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '초대 받은 출석부 ID', type: 'string' }),
    __metadata("design:type", String)
], Invitation.prototype, "attendanceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '권한 타입', type: 'enum', enum: role_type_enum_1.RoleType }),
    (0, swagger_1.ApiProperty)({ description: '권한 타입', enum: role_type_enum_1.RoleType }),
    __metadata("design:type", String)
], Invitation.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '초대 상태', type: 'enum', enum: invitation_status_enum_1.InvitationStatusType }),
    (0, swagger_1.ApiProperty)({ description: '초대 상태', enum: invitation_status_enum_1.InvitationStatusType }),
    __metadata("design:type", String)
], Invitation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'inviteeId', referencedColumnName: 'id' }),
    (0, swagger_1.ApiProperty)({ type: () => user_entity_1.User }),
    __metadata("design:type", user_entity_1.User)
], Invitation.prototype, "invitee", void 0);
exports.Invitation = Invitation = __decorate([
    (0, typeorm_1.Entity)()
], Invitation);
//# sourceMappingURL=invitation.entity.js.map