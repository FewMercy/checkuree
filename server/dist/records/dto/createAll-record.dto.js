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
exports.CreateAllRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const day_type_enum_1 = require("../../schedules/const/day-type.enum");
const class_validator_1 = require("class-validator");
const record_entity_1 = require("../entities/record.entity");
const record_type_enum_1 = require("../const/record-type.enum");
class CreateAllRecordDto {
    toEntity(createId) {
        const record = new record_entity_1.Record();
        record.status = this.status;
        record.date = this.date;
        record.day = this.day;
        record.createId = createId;
        return record;
    }
}
exports.CreateAllRecordDto = CreateAllRecordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: '출석부 PK',
        type: 'string',
        example: 'uuid-1234-uuid',
    }),
    __metadata("design:type", String)
], CreateAllRecordDto.prototype, "attendanceId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(record_type_enum_1.AttendanceStatus),
    (0, swagger_1.ApiProperty)({
        description: '출석 기록 상태',
        type: 'enum',
        enum: record_type_enum_1.AttendanceStatus,
        example: record_type_enum_1.AttendanceStatus.PRESENT,
    }),
    __metadata("design:type", String)
], CreateAllRecordDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: '출석날짜',
        type: 'date',
        example: '2024-12-03',
    }),
    __metadata("design:type", String)
], CreateAllRecordDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(day_type_enum_1.DayType),
    (0, swagger_1.ApiProperty)({
        description: '출석요일',
        type: 'enum',
        enum: day_type_enum_1.DayType,
        example: day_type_enum_1.DayType.MONDAY,
    }),
    __metadata("design:type", String)
], CreateAllRecordDto.prototype, "day", void 0);
//# sourceMappingURL=createAll-record.dto.js.map