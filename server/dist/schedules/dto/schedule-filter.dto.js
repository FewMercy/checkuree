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
exports.ScheduleFilterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const day_type_enum_1 = require("../const/day-type.enum");
const class_validator_1 = require("class-validator");
const isTimeformat_decorator_1 = require("../../common/decorator/isTimeformat.decorator");
const pagination_1 = require("../../common/response/pagination");
class ScheduleFilterDto extends pagination_1.Pagination {
}
exports.ScheduleFilterDto = ScheduleFilterDto;
__decorate([
    (0, class_validator_1.IsEnum)(day_type_enum_1.DayType, { each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '(미구현)출석부 요일 배열',
        type: 'Array',
        nullable: true,
        example: [day_type_enum_1.DayType.MONDAY, day_type_enum_1.DayType.TUESDAY],
    }),
    __metadata("design:type", Array)
], ScheduleFilterDto.prototype, "days", void 0);
__decorate([
    (0, isTimeformat_decorator_1.IsTimeFormat)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '(미구현)검색 시작기준 시간 (format:hhmm)',
        type: 'string',
        nullable: true,
        example: '1200',
    }),
    __metadata("design:type", String)
], ScheduleFilterDto.prototype, "timeFrom", void 0);
__decorate([
    (0, isTimeformat_decorator_1.IsTimeFormat)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '(미구현)검색 종료기준 시간 (format:hhmm)',
        type: 'string',
        nullable: true,
        example: '1815',
    }),
    __metadata("design:type", String)
], ScheduleFilterDto.prototype, "timeTo", void 0);
//# sourceMappingURL=schedule-filter.dto.js.map