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
import { TimeGroupedScheduleResDto } from './const/time-grouped-schedule-res.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, user: User): Promise<CommonResponseDto<{ ids: number[] }>> {
    // 이전 schedule 삭제
    await this.scheduleRepository.softDelete({
      attendeeId: createScheduleDto.attendeeId,
    });

    // 신규 schedule 저장
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

  async findAllByAttendanceId(attendanceId: string, scheduleFilterDto: ScheduleFilterDto): Promise<PageResponseDto<Schedule>> {
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
  ): Promise<PageResponseDto<TimeGroupedScheduleResDto>> {
    if (!this.isValideDateFormat(dateString)) {
      throw new BadRequestException('날짜 형식이 올바르지 않습니다.');
    }

    const date = new Date(dateString);
    const dayType = this.convertDayToDayType(date.getDay());

    const queryBuilder = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.attendee', 'attendee')
      .leftJoinAndSelect('attendee.records', 'records', 'records.date = :date', { date: dateString })
      .where('attendee.attendanceId = :attendanceId', { attendanceId })
      .andWhere('schedule.day = :day', { day: dayType })
      .skip(scheduleFilterDto.getOffset())
      .take(scheduleFilterDto.getLimit())
      .orderBy('schedule.time', 'ASC');

    const [items, count] = await queryBuilder.getManyAndCount();

    const groupedByTimeResult = new TimeGroupedScheduleResDto(items);

    return new PageResponseDto(scheduleFilterDto.pageSize, count, [groupedByTimeResult]);
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

  private convertDayToDayType = (dayNumber) => {
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

  private isValideDateFormat = (dateString) => {
    // YYYY-MM-DD 형식의 정규 표현식
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    // 정규 표현식에 따라 형식 검사
    if (!regex.test(dateString)) {
      return false; // 형식이 맞지 않으면 false 반환
    }

    // Date 객체를 생성하여 유효한 날짜인지 추가로 확인
    const date = new Date(dateString);

    // 날짜 객체가 유효한지, 변환된 날짜가 입력 문자열과 동일한지 확인
    if (!date) {
      return false;
    }

    return true;
  };
}
