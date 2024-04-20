import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DeleteScheduleDto } from './dto/delete-schedule.dto';
import { DayType } from './const/day-type.enum';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { ScheduleFilterDto } from './dto/schedule-filter.dto';
import { PageResponseDto } from '../common/response/pageResponse.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, user: User): Promise<CommonResponseDto<{ ids: number[] }>> {
    const schedules = createScheduleDto.toEntities(user.id);

    if (!schedules.some((schedule) => this.verifyAttendTime(schedule.time))) {
      throw new BadRequestException('유효하지 않은 시간 포맷입니다.');
    }
    const createdResponse = await this.scheduleRepository.save(schedules);

    return new CommonResponseDto('SUCCESS CREATE SCHEDULES', { ids: createdResponse.map((schedule) => schedule.id) });
  }

  async findByAttendeeId(attendeeId: string): Promise<ResponseWithoutPaginationDto<Schedule>> {
    const [items, count] = await this.scheduleRepository.findAndCountBy({
      attendeeId,
    });

    return new ResponseWithoutPaginationDto(count, items);
  }

  async findAllByAttendanceId(
    attendanceId: string,
    scheduleFilterDto: ScheduleFilterDto,
  ): Promise<PageResponseDto<Schedule>> {
    const [items, count] = await this.scheduleRepository.findAndCount({
      relations: {
        attendee: true,
      },
      select: {
        attendee: {
          attendanceId: true,
        },
      },
      where: {
        attendee: {
          attendanceId: attendanceId,
        },
      },
      skip: scheduleFilterDto.getOffset(),
      take: scheduleFilterDto.getLimit(),
      order: {
        time: 'ASC',
      },
    });

    return new PageResponseDto(scheduleFilterDto.pageSize, count, items);
  }

  async findScheduleByAttendanceIdAndDate(
    attendanceId: string,
    dateString: string,
    scheduleFilterDto: ScheduleFilterDto,
  ): Promise<PageResponseDto<Schedule>> {
    const date = new Date(dateString);
    const dayNumber = date.getDay();

    const convertNumberToDay = (dayNumber) => {
      const days = [
        DayType.SUNDAY,
        DayType.MONDAY,
        DayType.TUESDAY,
        DayType.WEDNESDAY,
        DayType.THURSDAY,
        DayType.FRIDAY,
        DayType.SATURDAY,
      ];

      return days[dayNumber % 7];
    };

    const dayType = convertNumberToDay(dayNumber);

    const querybuilder = this.scheduleRepository
      .createQueryBuilder('schedule')
      .select([
        'schedule', // 필요한 schedule 필드 선택
        'attendee',
        'records', // 필요한 records 필드 선택
      ])
      .leftJoinAndSelect('schedule.attendee', 'attendee')
      .leftJoinAndSelect('attendee.records', 'records', 'records.date = :date', { date: dateString })
      .where('attendee.attendanceId = :attendanceId', { attendanceId })
      .andWhere('schedule.day = :day', { day: dayType })
      .skip(scheduleFilterDto.getOffset())
      .take(scheduleFilterDto.getLimit())
      .orderBy('schedule.time , attendee.name', 'ASC');

    const [items, count] = await querybuilder.getManyAndCount();

    return new PageResponseDto(scheduleFilterDto.pageSize, count, items);
  }

  async deleteAll(deleteScheduleDto: DeleteScheduleDto): Promise<CommonResponseDto<any>> {
    await this.scheduleRepository.softDelete({
      id: In(deleteScheduleDto.ids),
    });
    return new CommonResponseDto('SUCCESS DELETE SCHEDULES');
  }

  private verifyAttendTime(time: string) {
    const timeStringLength = 4;
    if (time.length !== timeStringLength) {
      return false;
    }
    const hour = time.slice(0, 2);
    const minute = time.slice(2);

    return !(parseInt(hour) >= 24 || parseInt(minute) >= 60);
  }
}
