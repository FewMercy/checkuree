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
exports.Role = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const BaseTimeEntity_1 = require("../../common/BaseTimeEntity");
const role_type_enum_1 = require("./role-type.enum");
let Role = class Role extends BaseTimeEntity_1.BaseTimeEntity {
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { comment: '권한번호' }),
    (0, swagger_1.ApiProperty)({ description: '권한번호' }),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '권한 이름', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '권한 이름', type: 'string' }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '권한 타입', type: 'enum', enum: role_type_enum_1.RoleType }),
    (0, swagger_1.ApiProperty)({ description: '권한 타입', enum: role_type_enum_1.RoleType }),
    __metadata("design:type", String)
], Role.prototype, "type", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['name'])
], Role);
//# sourceMappingURL=role.entity.js.map