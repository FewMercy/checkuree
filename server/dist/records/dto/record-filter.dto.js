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
exports.RecordFilterDto = void 0;
const record_type_enum_1 = require("../const/record-type.enum");
const swagger_1 = require("@nestjs/swagger");
const day_type_enum_1 = require("../../schedules/const/day-type.enum");
const class_validator_1 = require("class-validator");
const pagination_1 = require("../../common/response/pagination");
class RecordFilterDto extends pagination_1.Pagination {
}
exports.RecordFilterDto = RecordFilterDto;
__decorate([
    (0, class_validator_1.IsEnum)(record_type_enum_1.AttendanceStatus),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석 기록 상태',
        type: 'enum',
        enum: record_type_enum_1.AttendanceStatus,
        example: record_type_enum_1.AttendanceStatus.PRESENT,
        nullable: true,
    }),
    __metadata("design:type", String)
], RecordFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석날짜',
        type: 'date',
        example: '2024-12-03',
        nullable: true,
    }),
    __metadata("design:type", String)
], RecordFilterDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(day_type_enum_1.DayType),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석요일',
        type: 'enum',
        enum: day_type_enum_1.DayType,
        example: day_type_enum_1.DayType.MONDAY,
        nullable: true,
    }),
    __metadata("design:type", String)
], RecordFilterDto.prototype, "day", void 0);
__decorate([
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: '조회 년도', type: 'number', nullable: true }),
    __metadata("design:type", Number)
], RecordFilterDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: '조회 월', type: 'number', nullable: true }),
    __metadata("design:type", Number)
], RecordFilterDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: '조회 시작일', type: 'string', nullable: true }),
    __metadata("design:type", String)
], RecordFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: '조회 종료일', type: 'string', nullable: true }),
    __metadata("design:type", String)
], RecordFilterDto.prototype, "dateTo", void 0);
//# sourceMappingURL=record-filter.dto.js.map