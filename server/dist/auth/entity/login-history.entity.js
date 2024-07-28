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
exports.LoginHistory = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
let LoginHistory = class LoginHistory {
};
exports.LoginHistory = LoginHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    (0, swagger_1.ApiProperty)({ description: '로그인 이력 PK', type: 'number' }),
    __metadata("design:type", Number)
], LoginHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '회원 PK', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '회원 PK', type: 'string' }),
    __metadata("design:type", String)
], LoginHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '로그인 ip', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '로그인 ip', type: 'string' }),
    __metadata("design:type", String)
], LoginHistory.prototype, "currentIp", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    (0, swagger_1.ApiProperty)({ description: '로그인 시간', example: '2021-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], LoginHistory.prototype, "loginAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], LoginHistory.prototype, "user", void 0);
exports.LoginHistory = LoginHistory = __decorate([
    (0, typeorm_1.Entity)()
], LoginHistory);
//# sourceMappingURL=login-history.entity.js.map