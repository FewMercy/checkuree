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
exports.Pagination = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class Pagination {
    constructor() {
        this.pageNo = 0;
        this.pageSize = 10;
    }
    getOffset() {
        return (this.pageNo - 1) * this.pageSize;
    }
    getLimit() {
        return this.pageSize;
    }
}
exports.Pagination = Pagination;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'number',
        description: '스킵할 개수',
        default: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], Pagination.prototype, "pageNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'number',
        description: '가지고 올 개수',
        default: 10,
    }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], Pagination.prototype, "pageSize", void 0);
//# sourceMappingURL=pagination.js.map