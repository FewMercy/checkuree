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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const auth_const_1 = require("./const/auth.const");
const common_response_dto_1 = require("../common/response/common-response.dto");
const token_response_dto_1 = require("./dto/token-response.dto");
const login_history_entity_1 = require("./entity/login-history.entity");
const is_available_res_1 = require("../common/response/is-available-res");
const user_type_enum_1 = require("../users/const/user-type.enum");
let AuthService = class AuthService {
    constructor(userRepository, loginHistoryRepository, jwtService) {
        this.userRepository = userRepository;
        this.loginHistoryRepository = loginHistoryRepository;
        this.jwtService = jwtService;
    }
    async signup(createAuthDto) {
        const user = createAuthDto.toEntity();
        await user.hashPassword();
        const result = await this.userRepository.save(user);
        delete result.password;
        return new common_response_dto_1.CommonResponseDto('SUCCESS SIGNUP', result);
    }
    async validateUser(username, password) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userAttendance', 'userAttendance')
            .addSelect('userAttendance.userId')
            .addSelect('userAttendance.attendanceId')
            .addSelect('userAttendance.role')
            .where('user.username = :username', { username })
            .getOne();
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        throw new common_1.BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
    }
    async signIn(signInDto, ip, loginAt = new Date()) {
        const user = await this.validateUser(signInDto.username, signInDto.password);
        const payload = {
            id: user.id,
            username: user.username,
            userType: user.type,
            userAttendance: user.userAttendance,
        };
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload, signInDto.isAutoLogin);
        await this.saveRefreshToken(user.id, refreshToken);
        await this.createLoginHistory(user.id, ip, loginAt);
        await this.userRepository.update(user.id, { isAutoLogin: signInDto.isAutoLogin ?? false });
        return new common_response_dto_1.CommonResponseDto('SUCCESS SIGN IN', new token_response_dto_1.TokenResponseDto(accessToken, refreshToken));
    }
    async oauthSignIn(oauthUser, ip, loginAt = new Date()) {
        let user = await this.userRepository.findOne({
            relations: {
                userAttendance: true,
            },
            where: {
                loginType: oauthUser.loginType,
                username: oauthUser.username,
            },
        });
        if (!user) {
            user = await this.createOAuthMember(oauthUser);
        }
        const payload = {
            id: user.id,
            username: user.username,
            userType: user.type,
            userAttendance: user.userAttendance ?? [],
        };
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload, true);
        await this.saveRefreshToken(user.id, refreshToken);
        await this.createLoginHistory(user.id, ip, loginAt);
        return new common_response_dto_1.CommonResponseDto('SUCCESS SIGN IN', new token_response_dto_1.TokenResponseDto(accessToken, refreshToken));
    }
    async createOAuthMember(oauthUser) {
        const findOption = [];
        if (oauthUser.email) {
            findOption.push({ email: oauthUser.email });
        }
        if (oauthUser.mobileNumber) {
            findOption.push({ mobileNumber: oauthUser.mobileNumber });
        }
        if (findOption.length > 0) {
            const found = await this.userRepository.findOne({ where: findOption });
            if (found) {
                throw new common_1.BadRequestException('이미 가입된 회원입니다.');
            }
        }
        const newUser = new user_entity_1.User();
        newUser.username = oauthUser.username;
        newUser.type = user_type_enum_1.UserType.GENERAL;
        newUser.loginType = oauthUser.loginType;
        newUser.name = oauthUser.name;
        newUser.email = oauthUser.email;
        newUser.loginType = oauthUser.loginType;
        newUser.isAutoLogin = false;
        newUser.createId = oauthUser.username;
        const createdUser = await this.userRepository.save(newUser);
        return createdUser;
    }
    async refreshToken(oldRefreshToken, ip) {
        const decoded = this.verifyRefreshToken(oldRefreshToken);
        const recentLoginHistory = await this.loginHistoryRepository.findOne({
            relations: {
                user: {
                    userAttendance: true,
                },
            },
            where: { userId: decoded.id },
            order: { loginAt: 'DESC' },
        });
        if (!recentLoginHistory?.user || recentLoginHistory?.user.refreshToken !== oldRefreshToken) {
            throw new common_1.UnauthorizedException('리프레시토큰이 유효하지 않습니다.');
        }
        if (!recentLoginHistory || recentLoginHistory.currentIp !== ip) {
            throw new common_1.UnauthorizedException('마지막으로 로그인 한 기기가 아닙니다.');
        }
        const jwtPayload = {
            id: recentLoginHistory.user.id,
            username: recentLoginHistory.user.username,
            userType: recentLoginHistory.user.type,
            userAttendance: recentLoginHistory.user.userAttendance,
        };
        const newAccessToken = this.generateAccessToken(jwtPayload);
        const newRefreshToken = this.generateRefreshToken(jwtPayload, recentLoginHistory.user.isAutoLogin);
        await this.saveRefreshToken(recentLoginHistory.user.id, newRefreshToken);
        return new common_response_dto_1.CommonResponseDto('SUCCESS REFRESH TOKEN', new token_response_dto_1.TokenResponseDto(newAccessToken, newRefreshToken));
    }
    async isAvailableEmail(email) {
        const found = await this.userRepository.findOneBy({ email });
        return new common_response_dto_1.CommonResponseDto('Email Valid check success', new is_available_res_1.AvailabilityResult(!!!found));
    }
    async isAvailableMobileNumber(mobileNumber) {
        const found = await this.userRepository.findOneBy({ mobileNumber });
        return new common_response_dto_1.CommonResponseDto('', new is_available_res_1.AvailabilityResult(!!!found));
    }
    async isAvailableUsername(username) {
        const found = await this.userRepository.findOneBy({ username });
        return new common_response_dto_1.CommonResponseDto('', new is_available_res_1.AvailabilityResult(!!!found));
    }
    generateAccessToken(payload) {
        return this.jwtService.sign(payload, {
            secret: (0, auth_const_1.jwtConstants)().accessTokenSecret,
            expiresIn: (0, auth_const_1.jwtConstants)().accessTokenExpiresIn,
        });
    }
    generateRefreshToken(payload, isAutoLogin) {
        return this.jwtService.sign(payload, {
            secret: (0, auth_const_1.jwtConstants)().refreshTokenSecret,
            expiresIn: isAutoLogin ? (0, auth_const_1.jwtConstants)().autoLoginRefreshTokenExpiresIn : (0, auth_const_1.jwtConstants)().refreshTokenExpiresIn,
        });
    }
    async saveRefreshToken(userId, refreshToken) {
        await this.userRepository.update(userId, { refreshToken });
    }
    verifyRefreshToken(oldRefreshToken) {
        try {
            return this.jwtService.verify(oldRefreshToken, { secret: (0, auth_const_1.jwtConstants)().refreshTokenSecret });
        }
        catch (err) {
            throw new common_1.UnauthorizedException('토큰이 만료되었습니다.');
        }
    }
    async createLoginHistory(userId, ip, loginAt) {
        const loginHistory = new login_history_entity_1.LoginHistory();
        loginHistory.userId = userId;
        loginHistory.currentIp = ip;
        loginHistory.loginAt = loginAt;
        await this.loginHistoryRepository.insert(loginHistory);
        return;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(login_history_entity_1.LoginHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map