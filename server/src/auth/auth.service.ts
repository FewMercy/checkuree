import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { jwtConstants } from './const/auth.const';
import { JwtPayload } from './const/jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  public async signup(createAuthDto: CreateAuthDto): Promise<Partial<User>> {
    const user = createAuthDto.toEntity();
    await user.hashPassword();
    const { password, ...result } = await this.userRepository.save(user);
    return result;
  }

  private async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ relations: { userAttendance: true }, where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
  }

  public async signin(signinDto: SigninDto) {
    const user = await this.validateUser(signinDto.username, signinDto.password);

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      userAttendance: user.userAttendance,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  async regenerateAccessToken(user: User) {
    const found = await this.userRepository.findOne({ relations: { userAttendance: true }, where: { id: user.id } });

    const payload: JwtPayload = {
      id: found.id,
      username: found.username,
      userAttendance: found.userAttendance,
    };
    return {
      accessToken: this.generateAccessToken(payload),
    };
  }

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: jwtConstants.accessTokenExpiresIn,
    });
  }

  private generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: jwtConstants.refreshTokenExpiresIn,
    });
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }

  public async refreshToken(oldRefreshToken: string) {
    const decoded: JwtPayload = this.jwtService.verify(oldRefreshToken, { secret: jwtConstants.refreshTokenSecret });
    const user = await this.userRepository.findOneBy({ id: decoded.id });

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException();
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      username: user.username,
      userAttendance: user.userAttendance,
    };

    const newAccessToken = this.generateAccessToken(jwtPayload);
    const newRefreshToken = this.generateRefreshToken(jwtPayload);

    await this.saveRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
