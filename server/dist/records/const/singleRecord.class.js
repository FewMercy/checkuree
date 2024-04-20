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
exports.SingleRecord = void 0;
const class_validator_1 = require("class-validator");
const record_type_enum_1 = require("./record-type.enum");
const swagger_1 = require("@nestjs/swagger");
const day_type_enum_1 = require("../../schedules/const/day-type.enum");
const late_time_type_enum_1 = require("./late-time-type.enum");
const absence_type_enum_1 = require("./absence-type.enum");
class SingleRecord {
}
exports.SingleRecord = SingleRecord;
__decorate([
    (0, class_validator_1.IsEnum)(record_type_enum_1.AttendanceStatus),
    (0, swagger_1.ApiProperty)({
        description: '출석 기록 상태',
        type: 'enum',
        enum: record_type_enum_1.AttendanceStatus,
        example: record_type_enum_1.AttendanceStatus.PRESENT,
    }),
    __metadata("design:type", String)
], SingleRecord.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: '출석 대상 PK',
        type: 'string',
        example: 'uuid-123123',
    }),
    __metadata("design:type", String)
], SingleRecord.prototype, "attendeeId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({
        description: '출석날짜',
        type: 'date',
        example: '2024-12-03',
    }),
    __metadata("design:type", String)
], SingleRecord.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(day_type_enum_1.DayType),
    (0, swagger_1.ApiProperty)({
        description: '출석요일',
        type: 'enum',
        enum: day_type_enum_1.DayType,
        example: day_type_enum_1.DayType.MONDAY,
    }),
    __metadata("design:type", String)
], SingleRecord.prototype, "day", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: '비고',
        type: 'text',
        example: '출석체크의 특이사항 입니다.',
    }),
    __metadata("design:type", String)
], SingleRecord.prototype, "etc", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(late_time_type_enum_1.LateTimeType),
    (0, swagger_1.ApiPropertyOptional)({ description: '지각 시간', type: 'enum', enum: late_time_type_enum_1.LateTimeType }),
    __metadata("design:type", String)
], SingleRecord.prototype, "lateTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(absence_type_enum_1.AbsenceType),
    (0, swagger_1.ApiPropertyOptional)({ description: '결석 종류', type: 'enum', enum: absence_type_enum_1.AbsenceType }),
    __metadata("design:type", String)
], SingleRecord.prototype, "absenceType", void 0);
//# sourceMappingURL=singleRecord.class.js.map