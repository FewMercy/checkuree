import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../common/response/pagination';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { MobileNumberTransform } from '../common/decorator/phoneNumber.decorator';
import { GetUser } from '../common/decorator/user.decorator';
import { CommonResponseDto } from '../common/response/common-response.dto';

@Controller('users')
@ApiTags('회원')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // @ApiOperation({ summary: '회원 전체 검색' })
  // @ApiResponse({
  //   status: 201,
  //   description: '회원 전체 검색',
  //   type: User,
  // })
  // findAll(pagination: Pagination) {
  //   //: Promise<CommonResponseDto<User[]>>
  //   return this.usersService.findAll(pagination);
  // }

  @Get('/mobile/:mobileNumber')
  @ApiOperation({ summary: '휴대전화 번호로 회원 검색' })
  @ApiResponse({
    status: 201,
    description: '휴대전화 번호로 회원 검색',
    type: User,
  })
  @MobileNumberTransform()
  findOneByMobileNumber(@Param('mobileNumber') mobileNumber: string) {
    //: Promise<CommonResponseDto<User>>
    return this.usersService.findOneByMobileNumber(mobileNumber);
  }

  @Get()
  @ApiOperation({ summary: '로그인한 회원 정보 조회' })
  @ApiResponse({
    status: 201,
    description: '로그인한 회원 정보 조회',
    type: User,
  })
  findOneId(@GetUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //: Promise<CommonResponseDto<any>>
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string, @GetUser() userId: string): Promise<CommonResponseDto<any>> {
    return this.usersService.softDelete(id, userId);
  }
}
