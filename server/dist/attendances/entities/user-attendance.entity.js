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
exports.UserAttendance = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const attendance_entity_1 = require("./attendance.entity");
const swagger_1 = require("@nestjs/swagger");
const BaseTimeEntity_1 = require("../../common/BaseTimeEntity");
const role_type_enum_1 = require("../../roles/const/role-type.enum");
let UserAttendance = class UserAttendance extends BaseTimeEntity_1.BaseTimeEntity {
};
exports.UserAttendance = UserAttendance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    (0, swagger_1.ApiProperty)({ description: '회원 출석부 아이디' }),
    __metadata("design:type", Number)
], UserAttendance.prototype, "userAttendanceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '회원 번호', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '회원 번호', type: 'string' }),
    __metadata("design:type", String)
], UserAttendance.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석부 번호', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석부 번호', type: 'string' }),
    __metadata("design:type", String)
], UserAttendance.prototype, "attendanceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '회원별 출석부별 권한', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '회원별 출석부별 권한', enum: role_type_enum_1.RoleType }),
    __metadata("design:type", String)
], UserAttendance.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.userAttendance),
    (0, typeorm_1.JoinColumn)({ name: 'userId', referencedColumnName: 'id' }),
    (0, swagger_1.ApiProperty)({ type: () => user_entity_1.User }),
    __metadata("design:type", user_entity_1.User)
], UserAttendance.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attendance_entity_1.Attendance, (attendance) => attendance.userAttendance),
    (0, typeorm_1.JoinColumn)({ name: 'attendanceId', referencedColumnName: 'id' }),
    (0, swagger_1.ApiProperty)({ type: () => attendance_entity_1.Attendance }),
    __metadata("design:type", attendance_entity_1.Attendance)
], UserAttendance.prototype, "attendance", void 0);
exports.UserAttendance = UserAttendance = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_attendance' })
], UserAttendance);
//# sourceMappingURL=user-attendance.entity.js.map