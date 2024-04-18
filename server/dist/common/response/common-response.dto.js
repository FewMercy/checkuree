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
exports.CommonResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CommonResponseDto {
    constructor(message, data, success = true) {
        this.success = success;
        this.message = message;
        if (data !== undefined) {
            this.data = data;
        }
    }
}
exports.CommonResponseDto = CommonResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '성공여부', type: 'boolean', example: true }),
    __metadata("design:type", Boolean)
], CommonResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '요청 성공 메시지', type: 'string', example: 'SUCCESS REQUEST' }),
    __metadata("design:type", String)
], CommonResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '데이터', type: 'object', example: {} }),
    __metadata("design:type", Object)
], CommonResponseDto.prototype, "data", void 0);
//# sourceMappingURL=common-response.dto.js.map