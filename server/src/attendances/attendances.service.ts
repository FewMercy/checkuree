import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { RoleType } from '../roles/entities/role-type.enum';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { AttendanceDay } from './entities/attendance-day.entity';
import { FileManagerService } from '../file-manager/file-manager.service';
import { DayType } from '../schedules/const/day-type.enum';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(UserAttendance)
    private userAttendanceRepository: Repository<UserAttendance>,
    @InjectRepository(AttendanceDay)
    private attendanceDayRepository: Repository<AttendanceDay>,
    private fileManagerService: FileManagerService,
  ) {}
  async create(createAttendanceDto: CreateAttendanceDto, user: User, image?: Express.Multer.File): Promise<CommonResponseDto<any>> {
    const attendanceDays = this.convertToAttendanceDays(createAttendanceDto.attendanceDays);

    if (!this.isValidDays(attendanceDays)) {
      throw new BadRequestException('출석부 요일이 올바르지 않습니다.');
    }

    const attendance = createAttendanceDto.toEntity();
    attendance.createId = user.id;

    if (image) {
      const imageUrl = await this.fileManagerService.saveImgFile(image);
      attendance.imageUrl = imageUrl;
    }

    const createdAttendance = await this.attendanceRepository.save(attendance);

    // UserAttendance 저장, 권한 생성
    const userAttendance = new UserAttendance();
    userAttendance.attendanceId = createdAttendance.id;
    userAttendance.userId = user.id;
    userAttendance.role = RoleType.MASTER;
    userAttendance.createId = user.id;

    await this.userAttendanceRepository.save(userAttendance);

    // AttendanceDays 저장
    await this.attendanceDayRepository.save(
      attendanceDays.map((day) => {
        return {
          attendanceId: createdAttendance.id,
          day: day,
        };
      }),
    );

    return new CommonResponseDto('SUCCESS CREATE ATTENDANCE', { id: createdAttendance.id });
  }

  async findAllByUserId(userId: string): Promise<ResponseWithoutPaginationDto<UserAttendance>> {
    const [items, count] = await this.userAttendanceRepository
      .createQueryBuilder('userAttendance')
      .innerJoinAndSelect('userAttendance.attendance', 'attendance', 'attendance.deletedAt IS NULL')
      .leftJoinAndSelect('attendance.attendanceDays', 'attendanceDays')
      .loadRelationCountAndMap('attendance.attendeeCount', 'attendance.attendees')
      .where('userAttendance.userId = :userId', { userId })
      .getManyAndCount();

    items.forEach((item) => {
      item.attendance.days = item.attendance.attendanceDays.map((day) => day.day);
    });
    return new ResponseWithoutPaginationDto(count, items);
  }

  async findOneById(id: string): Promise<CommonResponseDto<Attendance>> {
    const attendance = await this.attendanceRepository.findOne({
      relations: {
        attendanceDays: true,
      },
      where: {
        id,
      },
    });

    attendance.days = attendance.attendanceDays.map((day) => day.day);

    return new CommonResponseDto('SUCCESS FIND ATTENDANCE', attendance);
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto, image?: Express.Multer.File): Promise<CommonResponseDto<any>> {
    const attendance = await this.attendanceRepository.findOneBy({ id });

    if (!attendance) {
      throw new BadRequestException('존재하지 않는 출석부입니다.');
    }

    Object.assign(attendance, updateAttendanceDto);
    attendance.allowLateness = !!+updateAttendanceDto.allowLateness ?? attendance.allowLateness;

    // 입력 받은 AttendanceDays String을 Array로 변환 및 검증
    const attendanceDays = this.convertToAttendanceDays(updateAttendanceDto?.attendanceDays);

    if (!this.isValidDays(attendanceDays)) {
      throw new BadRequestException('출석부 요일이 올바르지 않습니다.');
    }

    if (image) {
      const imageUrl = await this.fileManagerService.saveImgFile(image);
      attendance.imageUrl = imageUrl;
    }

    // AttendanceDays는 Attendance Entity에 포함되어 있지 않기 때문에 삭제 후 따로 업데이트
    delete attendance.attendanceDays;

    await this.attendanceRepository.update(id, attendance);

    if (attendanceDays.length > 0) {
      await this.attendanceDayRepository.delete({ attendanceId: id });

      await this.attendanceDayRepository.save(
        attendanceDays.map((day) => {
          return {
            attendanceId: id,
            day: day,
          };
        }),
      );
    }

    return new CommonResponseDto('SUCCESS UPDATE ATTENDANCE');
  }

  async delete(attendanceId: string, userId: string): Promise<CommonResponseDto<any>> {
    await this.attendanceRepository.softDelete(attendanceId);
    await this.userAttendanceRepository.softDelete({ attendanceId, userId });
    return new CommonResponseDto('SUCCESS DELETE ATTENDANCE');
  }

  private convertToAttendanceDays(daysString: string | undefined) {
    if (!daysString) {
      return [];
    }

    const arrayAttendanceDays = daysString.split(',').map((day) => {
      return day.trim() as DayType;
    });
    return arrayAttendanceDays;
  }

  private isValidDays(days: string[]) {
    return days.every((day) => Object.values(DayType).includes(day as DayType));
  }
}
