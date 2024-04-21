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
exports.DateRecordSummaryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DateRecordSummaryResponseDto {
}
exports.DateRecordSummaryResponseDto = DateRecordSummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '출석 날짜', type: 'string' }),
    __metadata("design:type", String)
], DateRecordSummaryResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '출석 인원', type: 'number' }),
    __metadata("design:type", Number)
], DateRecordSummaryResponseDto.prototype, "presentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '결석 인원', type: 'number' }),
    __metadata("design:type", Number)
], DateRecordSummaryResponseDto.prototype, "absenceCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '지각 인원', type: 'number' }),
    __metadata("design:type", Number)
], DateRecordSummaryResponseDto.prototype, "lateCount", void 0);
//# sourceMappingURL=date-record-summary-response.dto.js.map