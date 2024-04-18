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
exports.Attendee = void 0;
const BaseTimeEntity_1 = require("../../common/BaseTimeEntity");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const attendance_entity_1 = require("../../attendances/entities/attendance.entity");
const schedule_entity_1 = require("../../schedules/entities/schedule.entity");
const record_entity_1 = require("../../records/entities/record.entity");
let Attendee = class Attendee extends BaseTimeEntity_1.BaseTimeEntity {
};
exports.Attendee = Attendee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({ description: '출석체크 대상 번호' }),
    __metadata("design:type", String)
], Attendee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '소속 출석부 ID', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '소속 출석부 ID', type: 'string' }),
    __metadata("design:type", String)
], Attendee.prototype, "attendanceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 대상자 이름', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석 대상자 이름', type: 'string' }),
    __metadata("design:type", String)
], Attendee.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 대상자 전화번호', type: 'varchar', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '출석 대상자 전화번호', type: 'string' }),
    __metadata("design:type", String)
], Attendee.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '출석 대상자 비상 전화번호',
        type: 'varchar',
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({ description: '출석 대상자 비상 전화번호', type: 'string' }),
    __metadata("design:type", String)
], Attendee.prototype, "subMobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 대상자 나이', type: 'int', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '출석 대상자 나이', type: 'int' }),
    __metadata("design:type", Number)
], Attendee.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 대상자 설명', type: 'varchar', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '출석 대상자 설명', type: 'string' }),
    __metadata("design:type", String)
], Attendee.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attendance_entity_1.Attendance, (attendance) => attendance.attendees),
    (0, typeorm_1.JoinColumn)({ name: 'attendanceId', referencedColumnName: 'id' }),
    (0, swagger_1.ApiProperty)({ type: () => attendance_entity_1.Attendance }),
    __metadata("design:type", attendance_entity_1.Attendance)
], Attendee.prototype, "attendance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => schedule_entity_1.Schedule, (schedule) => schedule.attendee),
    (0, swagger_1.ApiProperty)({ type: () => schedule_entity_1.Schedule }),
    __metadata("design:type", Array)
], Attendee.prototype, "schedules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => record_entity_1.Record, (record) => record.attendee),
    (0, swagger_1.ApiProperty)({ type: () => record_entity_1.Record }),
    __metadata("design:type", Array)
], Attendee.prototype, "records", void 0);
exports.Attendee = Attendee = __decorate([
    (0, typeorm_1.Entity)()
], Attendee);
//# sourceMappingURL=attendee.entity.js.map