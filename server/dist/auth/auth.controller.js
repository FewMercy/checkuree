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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_auth_dto_1 = require("./dto/create-auth.dto");
const swagger_1 = require("@nestjs/swagger");
const sign_in_dto_1 = require("./dto/sign-in.dto");
const passport_1 = require("@nestjs/passport");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const common_response_dto_1 = require("../common/response/common-response.dto");
const current_ip_decorator_1 = require("../common/decorator/current-ip.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signup(createAuthDto) {
        return this.authService.signup(createAuthDto);
    }
    async signIn(signInDto, ip) {
        return this.authService.signIn(signInDto, ip);
    }
    kakaoLogin(req, res) { }
    async kakaoLoginCallback(req, res, ip) {
        try {
            const kakaoUser = {
                username: req.user?.['username'],
                loginType: req.user?.['loginType'],
                name: req.user?.['name'],
                email: req.user?.['email'],
                mobileNumber: req.user?.['mobileNumber'],
            };
            const tokenResponse = await this.authService.oauthSignIn(kakaoUser, ip);
            res.appendHeader('Set-Cookie', `ACCESS_TOKEN=${tokenResponse.data.accessToken}; HttpOnly; Secure`);
            res.appendHeader('Set-Cookie', `REFRESH_TOKEN=${tokenResponse.data.refreshToken}; HttpOnly; Secure`);
            res.redirect('https://checkuree.com/attendance');
        }
        catch (error) {
            const errorMessage = encodeURIComponent(error.message || 'unknown_error');
            const errorCode = encodeURIComponent(error.code || 'unknown_error');
            res.redirect(`https://checkuree.com/auth/signin?errorMessage=${errorMessage}&errorCode=${errorCode}`);
        }
    }
    async refreshAccessToken(refreshTokenDto, ip) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken, ip);
    }
    async checkEmailAvailability(email) {
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
        }
        return this.authService.isAvailableEmail(email);
    }
    async checkMobileNumberAvailability(mobileNumber) {
        if (!mobileNumber) {
            throw new common_1.BadRequestException('Mobile number is required');
        }
        return this.authService.isAvailableMobileNumber(mobileNumber);
    }
    async checkUsernameAvailability(username) {
        if (!username) {
            throw new common_1.BadRequestException('username is required');
        }
        return this.authService.isAvailableUsername(username);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/signup'),
    (0, swagger_1.ApiOperation)({ summary: '회원 가입' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '회원 가입',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, swagger_1.ApiBody)({
        type: create_auth_dto_1.CreateAuthDto,
        description: '회원 가입 DTO',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.CreateAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('/signin'),
    (0, swagger_1.ApiOperation)({ summary: '로그인' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '로그인',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, swagger_1.ApiBody)({
        type: sign_in_dto_1.SignInDto,
        description: '로그인 DTO',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_ip_decorator_1.CurrentIp)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_dto_1.SignInDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)('/kakao'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "kakaoLogin", null);
__decorate([
    (0, common_1.Get)('/kakao/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, current_ip_decorator_1.CurrentIp)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoLoginCallback", null);
__decorate([
    (0, common_1.Post)('/refresh-token'),
    (0, swagger_1.ApiOperation)({ summary: '리프레시 토큰' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '리프레시 토큰',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, swagger_1.ApiBody)({
        type: refresh_token_dto_1.RefreshTokenDto,
        description: '로그인 DTO',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_ip_decorator_1.CurrentIp)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshAccessToken", null);
__decorate([
    (0, common_1.Get)('/check-email'),
    (0, swagger_1.ApiOperation)({ summary: '회원 이메일 중복 확인' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '회원 이메일 중복 확인',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkEmailAvailability", null);
__decorate([
    (0, common_1.Get)('/check-mobile-number'),
    (0, swagger_1.ApiOperation)({ summary: '회원 휴대전화번호 중복 확인' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '회원 전화번호 중복 확인',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    __param(0, (0, common_1.Query)('mobileNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkMobileNumberAvailability", null);
__decorate([
    (0, common_1.Get)('/check-username'),
    (0, swagger_1.ApiOperation)({ summary: '회원 아이디 중복 확인' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '회원 아이디 중복 확인',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    __param(0, (0, common_1.Query)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUsernameAvailability", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('인증'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map