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
exports.CreateAttendeeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const attendee_entity_1 = require("../entities/attendee.entity");
const error_message_1 = require("../../auth/const/error-message");
const phoneNumber_decorator_1 = require("../../common/decorator/phoneNumber.decorator");
const grade_enum_1 = require("../grade.enum");
const gender_enum_1 = require("../gender.enum");
class CreateAttendeeDto {
    toEntity() {
        const attendee = new attendee_entity_1.Attendee();
        attendee.name = this.name;
        attendee.gender = this.gender;
        attendee.attendanceId = this.attendanceId;
        attendee.mobileNumber = this.mobileNumber;
        attendee.subMobileNumber = this.subMobileNumber;
        attendee.description = this?.description;
        attendee.birth = this?.birth;
        attendee.course = this?.course;
        attendee.grade = this?.grade;
        attendee.school = this?.school;
        return attendee;
    }
}
exports.CreateAttendeeDto = CreateAttendeeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: '출석부 ID',
        type: 'string',
        example: 'attendanceId',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "attendanceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: '출석 대상 이름',
        type: 'string',
        example: 'attendee name',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: '출석 대상 성별 ( MALE / FEMALE )',
        type: 'string',
        example: 'MALE',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^01[01]{1}\d{7,8}$/, {
        message: error_message_1.INVALID_MOBILENUMBER_MESSAGE,
    }),
    (0, phoneNumber_decorator_1.MobileNumberTransform)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석 대상 전화번호',
        type: 'string',
        example: '01012345678',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^01[01]{1}\d{7,8}$/, {
        message: error_message_1.INVALID_MOBILENUMBER_MESSAGE,
    }),
    (0, phoneNumber_decorator_1.MobileNumberTransform)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석 대상 비상 전화번호',
        type: 'string',
        example: '01012345678',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "subMobileNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-[01][0-9]-[0-3][0-9]$/, { message: '생년월일이 올바르지 않습니다.' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석 대상 생년월일',
        type: 'string',
        example: '2000',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "birth", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석 대상 과정',
        type: 'string',
        example: '바이엘 1',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "course", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석 대상 학년',
        type: 'enum',
        enum: grade_enum_1.AttendeeGrade,
        example: grade_enum_1.AttendeeGrade.초등3학년,
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "grade", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: '출석 대상 학교',
        type: 'string',
        example: '장로회 신학 대학교',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "school", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: '출석 대상 설명',
        type: 'string',
        example: 'attendee description',
    }),
    __metadata("design:type", String)
], CreateAttendeeDto.prototype, "description", void 0);
//# sourceMappingURL=create-attendee.dto.js.map