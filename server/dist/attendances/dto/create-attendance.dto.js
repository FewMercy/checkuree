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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAttendanceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const attendance_entity_1 = require("../entities/attendance.entity");
const class_transformer_1 = require("class-transformer");
class CreateAttendanceDto {
    toEntity() {
        const attendance = new attendance_entity_1.Attendance();
        attendance.title = this?.title;
        attendance.description = this?.description;
        attendance.availableFrom = this?.availableFrom;
        attendance.availableTo = this?.availableTo;
        attendance.allowLateness = !!+this.allowLateness;
        return attendance;
    }
}
exports.CreateAttendanceDto = CreateAttendanceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: '출석부 제목',
        type: 'string',
        example: 'attendance title',
    }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, common_1.Optional)(),
    (0, swagger_1.ApiProperty)({
        description: '출석부 설명',
        type: 'string',
        example: 'attendance description',
    }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '출석부 사용 시작 시간', type: 'string', example: '1200' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[0-9]{4}$/, { message: '출석부 사용 시작 시간은 4자리 숫자여야 합니다.' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "availableFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '출석부 사용 종료 시간', type: 'string', example: '2000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[0-9]{4}$/, { message: '출석부 사용 시작 시간은 4자리 숫자여야 합니다.' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "availableTo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({ description: '지각 상태 사용 유무', type: 'enum', enum: ['0', '1'] }),
    __metadata("design:type", Boolean)
], CreateAttendanceDto.prototype, "allowLateness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '출석부 사용 요일 ( 요일을 쉼표로 구분한 String )',
        type: 'string',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "attendanceDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'file',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object)
], CreateAttendanceDto.prototype, "image", void 0);
//# sourceMappingURL=create-attendance.dto.js.map