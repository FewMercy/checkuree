import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LoginHistory } from './entity/login-history.entity';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Module({
  imports: [UsersModule, PassportModule, TypeOrmModule.forFeature([User, LoginHistory]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy],
})
export class AuthModule {}
