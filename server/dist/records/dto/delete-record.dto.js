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
exports.DeleteRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DeleteRecordDto {
}
exports.DeleteRecordDto = DeleteRecordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsPositive)({ each: true }),
    (0, swagger_1.ApiProperty)({
        description: '출석기록 ID 배열',
        type: 'Array',
        example: [1, 2, 3],
    }),
    __metadata("design:type", Array)
], DeleteRecordDto.prototype, "ids", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: '출석부 ID',
        type: 'string',
        example: 'attendanceId',
    }),
    __metadata("design:type", String)
], DeleteRecordDto.prototype, "attendanceId", void 0);
//# sourceMappingURL=delete-record.dto.js.map