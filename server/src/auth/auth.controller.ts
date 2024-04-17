import { Controller, Post, Body, UseGuards, Get, Query, BadRequestException, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorator/user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { AvailabilityResult } from '../common/response/is-available-res';
import { TokenResponseDto } from './dto/token-response.dto';
import { CurrentIp } from '../common/decorator/current-ip.decorator';
import { Schedule } from '../schedules/entities/schedule.entity';
import { OAuth } from './const/oauth.interface';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('인증')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({
    status: 201,
    description: '회원 가입',
    type: CommonResponseDto<User>,
  })
  @ApiBody({
    type: CreateAuthDto,
    description: '회원 가입 DTO',
  })
  signup(@Body() createAuthDto: CreateAuthDto): Promise<CommonResponseDto<User>> {
    return this.authService.signup(createAuthDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인',
    type: CommonResponseDto<TokenResponseDto>,
  })
  @ApiBody({
    type: SignInDto,
    description: '로그인 DTO',
  })
  async signIn(@Body() signInDto: SignInDto, @CurrentIp() ip: string): Promise<CommonResponseDto<TokenResponseDto>> {
    return this.authService.signIn(signInDto, ip);
  }

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin(@Req() req: Request, @Res() res: Response) {}

  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req: Request, @Res() res: Response, @CurrentIp() ip: string) {
    const kakaoUser: OAuth = {
      username: req.user?.['username'],
      loginType: req.user?.['loginType'],
      name: req.user?.['name'],
      email: req.user?.['email'],
      mobileNumber: req.user?.['mobileNumber'],
    };

    const tokenResponse = await this.authService.oauthSignIn(kakaoUser, ip);

    res.appendHeader('Set-Cookie', `ACCESS_TOKEN=${tokenResponse.data.accessToken}`);
    res.appendHeader('Set-Cookie', `REFRESH_TOKEN=${tokenResponse.data.refreshToken}`);
    res.redirect('https://checkuree.com/attendance');
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: '리프레시 토큰' })
  @ApiResponse({
    status: 200,
    description: '리프레시 토큰',
    type: CommonResponseDto<TokenResponseDto>,
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: '로그인 DTO',
  })
  async refreshAccessToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @CurrentIp() ip: string,
  ): Promise<CommonResponseDto<TokenResponseDto>> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken, ip);
  }

  @Get('/check-email')
  @ApiOperation({ summary: '회원 이메일 중복 확인' })
  @ApiResponse({
    status: 200,
    description: '회원 이메일 중복 확인',
    type: CommonResponseDto<AvailabilityResult>,
  })
  async checkEmailAvailability(@Query('email') email: string): Promise<CommonResponseDto<AvailabilityResult>> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.isAvailableEmail(email);
  }

  @Get('/check-mobile-number')
  @ApiOperation({ summary: '회원 휴대전화번호 중복 확인' })
  @ApiResponse({
    status: 200,
    description: '회원 전화번호 중복 확인',
    type: CommonResponseDto<AvailabilityResult>,
  })
  async checkMobileNumberAvailability(@Query('mobileNumber') mobileNumber: string): Promise<CommonResponseDto<AvailabilityResult>> {
    if (!mobileNumber) {
      throw new BadRequestException('Mobile number is required');
    }
    return this.authService.isAvailableMobileNumber(mobileNumber);
  }

  @Get('/check-username')
  @ApiOperation({ summary: '회원 아이디 중복 확인' })
  @ApiResponse({
    status: 200,
    description: '회원 아이디 중복 확인',
    type: CommonResponseDto<AvailabilityResult>,
  })
  async checkUsernameAvailability(@Query('username') username: string): Promise<CommonResponseDto<AvailabilityResult>> {
    if (!username) {
      throw new BadRequestException('username is required');
    }
    return this.authService.isAvailableUsername(username);
  }
}
