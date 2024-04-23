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
exports.AttendanceDay = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const attendance_entity_1 = require("./attendance.entity");
const day_type_enum_1 = require("../../schedules/const/day-type.enum");
let AttendanceDay = class AttendanceDay {
};
exports.AttendanceDay = AttendanceDay;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    (0, swagger_1.ApiProperty)({ description: '출석부 요일 PK', type: 'number' }),
    __metadata("design:type", Number)
], AttendanceDay.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석부 번호', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석부 번호', type: 'string' }),
    __metadata("design:type", String)
], AttendanceDay.prototype, "attendanceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석부 요일', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석부 요일', type: 'enum', enum: day_type_enum_1.DayType }),
    __metadata("design:type", String)
], AttendanceDay.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attendance_entity_1.Attendance, (attendance) => attendance.attendanceDays),
    (0, typeorm_1.JoinColumn)({ name: 'attendanceId', referencedColumnName: 'id' }),
    (0, swagger_1.ApiProperty)({ type: () => attendance_entity_1.Attendance }),
    __metadata("design:type", attendance_entity_1.Attendance)
], AttendanceDay.prototype, "attendance", void 0);
exports.AttendanceDay = AttendanceDay = __decorate([
    (0, typeorm_1.Entity)()
], AttendanceDay);
//# sourceMappingURL=attendance-day.entity.js.map