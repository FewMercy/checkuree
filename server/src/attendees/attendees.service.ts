import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { In, Repository } from 'typeorm';
import { DeleteAttendeeDto } from './dto/delete-attendee.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { AttendeeGrade } from './grade.enum';
import { Gender } from './gender.enum';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
  ) {}
  async createAttendee(createAttendeeDto: CreateAttendeeDto, user: User): Promise<CommonResponseDto<any>> {
    const attendee = createAttendeeDto.toEntity();
    this.validateGender(attendee.gender);

    if (attendee.grade) {
      this.validateGrade(attendee.grade);
    }

    attendee.createId = user.id;

    const createdAttendee = await this.attendeeRepository.save(attendee);

    return new CommonResponseDto('SUCCESS CREATE ATTENDEE', { id: createdAttendee.id });
  }

  async findAllByAttendanceId(attendanceId: string): Promise<ResponseWithoutPaginationDto<Attendee>> {
    const [items, count] = await this.attendeeRepository.findAndCount({
      select: {
        schedules: {
          id: true,
          time: true,
          day: true,
        },
      },
      relations: { schedules: true },
      where: { attendanceId: attendanceId },
    });
    return new ResponseWithoutPaginationDto(count, items);
  }

  async findOneById(id: string): Promise<CommonResponseDto<Attendee>> {
    return new CommonResponseDto(
      'SUCCESS FIND ATTENDEE',
      await this.attendeeRepository.findOne({
        select: {
          schedules: {
            id: true,
            time: true,
            day: true,
          },
        },
        relations: {
          schedules: true,
        },
        where: {
          id,
        },
      }),
    );
  }

  async update(id: string, updateAttendeeDto: UpdateAttendeeDto): Promise<CommonResponseDto<any>> {
    if (updateAttendeeDto.gender) {
      this.validateGender(updateAttendeeDto.gender);
    }

    if (updateAttendeeDto.grade) {
      this.validateGrade(updateAttendeeDto.grade);
    }
    await this.attendeeRepository.update({ id, attendanceId: updateAttendeeDto.attendanceId }, updateAttendeeDto);
    return new CommonResponseDto('SUCCESS UPDATE ATTENDEE', { id: id });
  }

  async deleteAll(deleteAttendeeDto: DeleteAttendeeDto): Promise<CommonResponseDto<any>> {
    const found = await this.attendeeRepository.count({
      where: {
        id: In(deleteAttendeeDto.ids),
        attendanceId: deleteAttendeeDto.attendanceId,
      },
    });

    if (found !== deleteAttendeeDto.ids.length) {
      throw new BadRequestException('Attendance에 속한 Attendee만 삭제할 수 있습니다.');
    }

    await this.attendeeRepository.softDelete({
      id: In(deleteAttendeeDto.ids),
      attendanceId: deleteAttendeeDto.attendanceId,
    });
    return new CommonResponseDto('SUCCESS DELETE ATTENDEES');
  }

  private validateGender(gender: Gender | undefined): void {
    if (gender && !Object.values(Gender).includes(gender)) {
      throw new BadRequestException('성별이 올바르지 않습니다.');
    }
  }

  private validateGrade(grade: AttendeeGrade | undefined): void {
    if (grade && !Object.values(AttendeeGrade).includes(grade)) {
      throw new BadRequestException('학년이 올바르지 않습니다.');
    }
  }
}
