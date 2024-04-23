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
exports.Attendance = void 0;
const BaseTimeEntity_1 = require("../../common/BaseTimeEntity");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_attendance_entity_1 = require("./user-attendance.entity");
const attendee_entity_1 = require("../../attendees/entities/attendee.entity");
const attendance_day_entity_1 = require("./attendance-day.entity");
let Attendance = class Attendance extends BaseTimeEntity_1.BaseTimeEntity {
};
exports.Attendance = Attendance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { comment: '출석부 번호' }),
    (0, swagger_1.ApiProperty)({ description: '출석부 번호' }),
    __metadata("design:type", String)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석부 제목', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석부 제목', type: 'string' }),
    __metadata("design:type", String)
], Attendance.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석부 설명', type: 'varchar', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '출석부 설명', type: 'string' }),
    __metadata("design:type", String)
], Attendance.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석부 사용 시작 시간', type: 'varchar', nullable: false }),
    (0, swagger_1.ApiProperty)({ description: '출석부 사용 시작 시간', type: 'string', example: '1200' }),
    __metadata("design:type", String)
], Attendance.prototype, "availableFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석부 사용 종료 시간', type: 'varchar', nullable: false }),
    (0, swagger_1.ApiProperty)({ description: '출석부 사용 종료 시간', type: 'string', example: '2000' }),
    __metadata("design:type", String)
], Attendance.prototype, "availableTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '지각 상태 사용 유무', type: 'boolean', default: true }),
    (0, swagger_1.ApiProperty)({ description: '지각 상태 사용 유무', type: 'boolean' }),
    __metadata("design:type", Boolean)
], Attendance.prototype, "allowLateness", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '출석부 이미지 url', type: 'text' }),
    (0, swagger_1.ApiPropertyOptional)({ description: '출석부 이미지 url', type: 'string' }),
    __metadata("design:type", String)
], Attendance.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_attendance_entity_1.UserAttendance, (userAttendance) => userAttendance.attendance),
    (0, swagger_1.ApiProperty)({ type: () => user_attendance_entity_1.UserAttendance }),
    __metadata("design:type", Array)
], Attendance.prototype, "userAttendance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendee_entity_1.Attendee, (attendee) => attendee.attendance),
    (0, swagger_1.ApiProperty)({ type: () => attendee_entity_1.Attendee }),
    __metadata("design:type", Array)
], Attendance.prototype, "attendees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendance_day_entity_1.AttendanceDay, (attendanceDay) => attendanceDay.attendance),
    (0, swagger_1.ApiProperty)({ type: () => user_attendance_entity_1.UserAttendance }),
    __metadata("design:type", Array)
], Attendance.prototype, "attendanceDays", void 0);
exports.Attendance = Attendance = __decorate([
    (0, typeorm_1.Entity)()
], Attendance);
//# sourceMappingURL=attendance.entity.js.map