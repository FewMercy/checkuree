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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const BaseTimeEntity_1 = require("../../common/BaseTimeEntity");
const bcrypt = require("bcrypt");
const auth_const_1 = require("../../auth/const/auth.const");
const swagger_1 = require("@nestjs/swagger");
const user_attendance_entity_1 = require("../../attendances/entities/user-attendance.entity");
const user_type_enum_1 = require("../const/user-type.enum");
const login_type_enum_1 = require("../../auth/const/login-type.enum");
let User = class User extends BaseTimeEntity_1.BaseTimeEntity {
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, auth_const_1.SALT);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { comment: '회원번호' }),
    (0, swagger_1.ApiProperty)({ description: '회원번호' }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '회원 타입', type: 'varchar', nullable: false, default: user_type_enum_1.UserType.GENERAL }),
    (0, swagger_1.ApiProperty)({ description: '회원 타입', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '로그인 타입', type: 'varchar', nullable: false, default: login_type_enum_1.LoginType.LOCAL }),
    (0, swagger_1.ApiProperty)({ description: '로그인 타입', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "loginType", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '회원 아이디', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '회원 아이디', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '회원 비밀번호', type: 'varchar', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '회원 비밀번호', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '회원 이름', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '회원 이름', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '회원 전화번호', type: 'varchar', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '회원 전화번호', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '회원 생일', type: 'varchar' }),
    (0, swagger_1.ApiPropertyOptional)({ description: '회원 생일', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '회원 생년', type: 'int' }),
    (0, swagger_1.ApiPropertyOptional)({ description: '회원 생년', type: 'number' }),
    __metadata("design:type", Number)
], User.prototype, "birthYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '회원 이메일', type: 'varchar' }),
    (0, swagger_1.ApiPropertyOptional)({ description: '회원 이메일', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '리프레시토큰', type: 'text' }),
    (0, swagger_1.ApiPropertyOptional)({ description: '리프레시토큰', type: 'string' }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, comment: '자동로그인 여부', type: 'boolean', default: false }),
    (0, swagger_1.ApiPropertyOptional)({ description: '자동로그인 여부', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAutoLogin", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_attendance_entity_1.UserAttendance, (userAttendance) => userAttendance.user),
    (0, swagger_1.ApiProperty)({ type: () => user_attendance_entity_1.UserAttendance }),
    __metadata("design:type", Array)
], User.prototype, "userAttendance", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['mobileNumber']),
    (0, typeorm_1.Unique)(['username']),
    (0, typeorm_1.Unique)(['email'])
], User);
//# sourceMappingURL=user.entity.js.map