import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}
