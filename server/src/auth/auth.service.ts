import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { jwtConstants } from './const/auth.const';
import { JwtPayload } from './const/jwtPayload.interface';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { LoginHistory } from './entity/login-history.entity';
import { AvailabilityResult } from '../common/response/is-available-res';
import { OAuth } from './const/oauth.interface';
import { UserType } from '../users/const/user-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(LoginHistory) private loginHistoryRepository: Repository<LoginHistory>,
    private jwtService: JwtService,
  ) {}
  public async signup(createAuthDto: CreateAuthDto): Promise<CommonResponseDto<User>> {
    const user = createAuthDto.toEntity();
    await user.hashPassword();
    const result = await this.userRepository.save(user);

    delete result.password;

    return new CommonResponseDto('SUCCESS SIGNUP', result);
  }

  public async validateUser(username: string, password: string) {
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
    throw new BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
  }

  public async signIn(signInDto: SignInDto, ip: string, loginAt: Date = new Date()): Promise<CommonResponseDto<TokenResponseDto>> {
    const user = await this.validateUser(signInDto.username, signInDto.password);

    const payload: JwtPayload = {
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

    return new CommonResponseDto('SUCCESS SIGN IN', new TokenResponseDto(accessToken, refreshToken));
  }

  public async oauthSignIn(oauthUser: OAuth, ip: string, loginAt: Date = new Date()): Promise<CommonResponseDto<TokenResponseDto>> {
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

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      userType: user.type,
      // 신규 가입 회원은 userAttendance가 없으므로 빈 배열
      userAttendance: user.userAttendance ?? [],
    };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload, true);

    await this.saveRefreshToken(user.id, refreshToken);
    await this.createLoginHistory(user.id, ip, loginAt);

    return new CommonResponseDto('SUCCESS SIGN IN', new TokenResponseDto(accessToken, refreshToken));
  }

  private async createOAuthMember(oauthUser: OAuth) {
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
        throw new BadRequestException('이미 가입된 회원입니다.');
      }
    }

    const newUser = new User();
    newUser.username = oauthUser.username;
    newUser.type = UserType.GENERAL;
    newUser.loginType = oauthUser.loginType;
    newUser.name = oauthUser.name;
    newUser.email = oauthUser.email;
    newUser.loginType = oauthUser.loginType;
    newUser.isAutoLogin = false;
    newUser.createId = oauthUser.username;

    const createdUser = await this.userRepository.save(newUser);
    return createdUser;
  }

  public async refreshToken(oldRefreshToken: string, ip: string): Promise<CommonResponseDto<TokenResponseDto>> {
    const decoded: JwtPayload = this.verifyRefreshToken(oldRefreshToken);

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
      throw new UnauthorizedException('리프레시토큰이 유효하지 않습니다.');
    }

    if (!recentLoginHistory || recentLoginHistory.currentIp !== ip) {
      throw new UnauthorizedException('마지막으로 로그인 한 기기가 아닙니다.');
    }

    const jwtPayload: JwtPayload = {
      id: recentLoginHistory.user.id,
      username: recentLoginHistory.user.username,
      userType: recentLoginHistory.user.type,
      userAttendance: recentLoginHistory.user.userAttendance,
    };

    const newAccessToken = this.generateAccessToken(jwtPayload);
    const newRefreshToken = this.generateRefreshToken(jwtPayload, recentLoginHistory.user.isAutoLogin);

    await this.saveRefreshToken(recentLoginHistory.user.id, newRefreshToken);

    return new CommonResponseDto('SUCCESS REFRESH TOKEN', new TokenResponseDto(newAccessToken, newRefreshToken));
  }

  public async isAvailableEmail(email: string) {
    const found = await this.userRepository.findOneBy({ email });

    return new CommonResponseDto('Email Valid check success', new AvailabilityResult(!!!found));
  }

  public async isAvailableMobileNumber(mobileNumber: string): Promise<CommonResponseDto<AvailabilityResult>> {
    const found = await this.userRepository.findOneBy({ mobileNumber });
    return new CommonResponseDto('', new AvailabilityResult(!!!found));
  }

  public async isAvailableUsername(username: string): Promise<CommonResponseDto<AvailabilityResult>> {
    const found = await this.userRepository.findOneBy({ username });
    return new CommonResponseDto('', new AvailabilityResult(!!!found));
  }

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants().accessTokenSecret,
      expiresIn: jwtConstants().accessTokenExpiresIn,
    });
  }

  private generateRefreshToken(payload: JwtPayload, isAutoLogin: boolean) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants().refreshTokenSecret,
      expiresIn: isAutoLogin ? jwtConstants().autoLoginRefreshTokenExpiresIn : jwtConstants().refreshTokenExpiresIn,
    });
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }

  private verifyRefreshToken(oldRefreshToken: string) {
    try {
      return this.jwtService.verify(oldRefreshToken, { secret: jwtConstants().refreshTokenSecret });
    } catch (err) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
  }

  private async createLoginHistory(userId: string, ip: string, loginAt: Date): Promise<null> {
    const loginHistory = new LoginHistory();
    loginHistory.userId = userId;
    loginHistory.currentIp = ip;
    loginHistory.loginAt = loginAt;

    await this.loginHistoryRepository.insert(loginHistory);
    return;
  }
}
