import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Attendee } from '../attendees/entities/attendee.entity';
import { Record } from './entities/record.entity';
import { RoleGuard } from '../roles/role.guard';
import { Roles } from '../roles/role.decorator';
import { RoleType } from '../roles/entities/role-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { CreateAttendeeDto } from '../attendees/dto/create-attendee.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('records')
@ApiTags('출석기록')
@ApiBearerAuth('token')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({
    description: '출석기록 생성',
    summary: '출석기록 생성 요약',
  })
  @ApiBody({
    type: CreateRecordDto,
    description: '출석기록 생성 DTO',
  })
  @ApiResponse({
    status: 200,
    description: '출석기록 생성',
    type: Record,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async createRecord(
    @Body() createRecordDto: CreateRecordDto,
    @GetUser() user: User,
  ) {
    return this.recordsService.create(createRecordDto, user);
  }

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }
}
