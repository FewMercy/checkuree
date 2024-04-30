import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './const/auth.const';
import { LoginHistory } from './entity/login-history.entity';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { FileManagerService } from '../file-manager/file-manager.service';
import { S3Service } from '../file-manager/s3.service';
import { ImageProcessorService } from '../file-manager/image-processor.service';

@Module({
  imports: [UsersModule, PassportModule, TypeOrmModule.forFeature([User, LoginHistory]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy],
})
export class AuthModule {}
