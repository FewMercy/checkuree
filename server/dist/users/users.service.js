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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const common_response_dto_1 = require("../common/response/common-response.dto");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll(pagination) {
        const [list, count] = await this.userRepository.findAndCount({
            skip: pagination.getOffset(),
            take: pagination.getLimit(),
        });
        return {
            list: list,
            count: count,
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOneBy({ id });
        delete user.password;
        delete user.refreshToken;
        delete user.loginType;
        delete user.isAutoLogin;
        return user;
    }
    async findOneById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async findOneByMobileNumber(mobileNumber) {
        mobileNumber = mobileNumber.replaceAll('-', '');
        const { id, name, ...found } = await this.userRepository.findOne({
            where: { mobileNumber: mobileNumber },
        });
        const user = new user_entity_1.User();
        user.id = id;
        user.name = name;
        user.mobileNumber = mobileNumber;
        return user;
    }
    async update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    async softDelete(id, userId) {
        if (id !== userId) {
            throw new common_1.BadRequestException('본인의 아이디만 삭제 가능합니다.');
        }
        await this.userRepository.softDelete({ id: id });
        return new common_response_dto_1.CommonResponseDto('SUCCESS DELETE USER');
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map