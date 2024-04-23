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
exports.CreateAuthDto = void 0;
const class_validator_1 = require("class-validator");
const error_message_1 = require("../const/error-message");
const user_entity_1 = require("../../users/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
const phoneNumber_decorator_1 = require("../../common/decorator/phoneNumber.decorator");
class CreateAuthDto {
    toEntity(createdAt = new Date()) {
        const user = new user_entity_1.User();
        user.username = this.username;
        user.password = this.password;
        user.name = this.name;
        user.mobileNumber = this.mobileNumber;
        user.email = this?.email || null;
        user.birthday = this?.birthday || null;
        user.birthYear = +this?.birthYear || null;
        user.createId = this.username;
        user.createdAt = createdAt;
        return user;
    }
}
exports.CreateAuthDto = CreateAuthDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: error_message_1.INVALID_ID_MIN_LENGTH_MESSAGE }),
    (0, class_validator_1.MaxLength)(12, { message: error_message_1.INVALID_ID_MAX_LENGTH_MESSAGE }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9]+$/, {
        message: error_message_1.INVALID_ID_MESSAGE,
    }),
    (0, swagger_1.ApiProperty)({
        description: '회원 아이디',
        type: 'string',
        example: 'testID',
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: error_message_1.INVALID_PASSWORD_MIN_LENGTH_MESSAGE }),
    (0, class_validator_1.MaxLength)(12, { message: error_message_1.INVALID_PASSWORD_MAX_LENGTH_MESSAGE }),
    (0, class_validator_1.Matches)(/^(?=.*?[a-zA-Z])(?=.*?\d)(?=.*?[!@#$%^&*]).{6,13}$/, {
        message: error_message_1.INVALID_PASSWORD_MESSAGE,
    }),
    (0, swagger_1.ApiProperty)({
        description: '회원 비밀번호',
        type: 'string',
        example: 'pwd123!@#',
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: error_message_1.INVALID_NAME_MIN_LENGTH_MESSAGE }),
    (0, class_validator_1.MaxLength)(20, { message: error_message_1.INVALID_NAME_MAX_LENGTH_MESSAGE }),
    (0, class_validator_1.Matches)(/^[가-힣a-zA-Z0-9]+$/, {
        message: error_message_1.INVALID_NAME_MESSAGE,
    }),
    (0, swagger_1.ApiProperty)({ description: '회원 이름', type: 'string', example: '이승형' }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^01[01]{1}\d{7,8}$/, {
        message: error_message_1.INVALID_MOBILENUMBER_MESSAGE,
    }),
    (0, phoneNumber_decorator_1.MobileNumberTransform)(),
    (0, swagger_1.ApiProperty)({
        description: '회원 전화번호',
        type: 'string',
        example: '01012345678',
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}$/, {
        message: error_message_1.INVALID_BIRTHYEAR_MESSAGE,
    }),
    (0, swagger_1.ApiPropertyOptional)({
        description: '회원 생년',
        type: 'string',
        example: '1993',
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "birthYear", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}$/, {
        message: error_message_1.INVALID_BIRTHDAY_MESSAGE,
    }),
    (0, swagger_1.ApiPropertyOptional)({
        description: '회원 생일',
        type: 'string',
        example: '0623',
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "birthday", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Matches)(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, {
        message: error_message_1.INVALID_EMAIL_MESSAGE,
    }),
    (0, swagger_1.ApiPropertyOptional)({
        description: '회원 이메일',
        type: 'string',
        example: 'daum@naver.com',
    }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "email", void 0);
//# sourceMappingURL=create-auth.dto.js.map