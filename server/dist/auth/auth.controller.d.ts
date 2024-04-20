import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { AvailabilityResult } from '../common/response/is-available-res';
import { TokenResponseDto } from './dto/token-response.dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(createAuthDto: CreateAuthDto): Promise<CommonResponseDto<User>>;
    signIn(signInDto: SignInDto, ip: string): Promise<CommonResponseDto<TokenResponseDto>>;
    kakaoLogin(req: Request, res: Response): void;
    kakaoLoginCallback(req: Request, res: Response, ip: string): Promise<void>;
    refreshAccessToken(refreshTokenDto: RefreshTokenDto, ip: string): Promise<CommonResponseDto<TokenResponseDto>>;
    checkEmailAvailability(email: string): Promise<CommonResponseDto<AvailabilityResult>>;
    checkMobileNumberAvailability(mobileNumber: string): Promise<CommonResponseDto<AvailabilityResult>>;
    checkUsernameAvailability(username: string): Promise<CommonResponseDto<AvailabilityResult>>;
}
