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
exports.ResponseWithoutPaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ResponseWithoutPaginationDto {
    constructor(count, items, success = true) {
        this.count = count;
        this.items = items;
        this.success = success;
    }
}
exports.ResponseWithoutPaginationDto = ResponseWithoutPaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '성공여부', type: 'boolean', example: true }),
    __metadata("design:type", Boolean)
], ResponseWithoutPaginationDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '총 개수', type: 'number', example: 53 }),
    __metadata("design:type", Number)
], ResponseWithoutPaginationDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '조회 결과', type: 'object' }),
    __metadata("design:type", Array)
], ResponseWithoutPaginationDto.prototype, "items", void 0);
//# sourceMappingURL=responseWithoutPagination.dto.js.map