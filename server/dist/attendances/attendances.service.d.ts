/// <reference types="multer" />
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from '../users/entities/user.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { AttendanceDay } from './entities/attendance-day.entity';
import { FileManagerService } from '../file-manager/file-manager.service';
export declare class AttendancesService {
    private attendanceRepository;
    private userAttendanceRepository;
    private attendanceDayRepository;
    private fileManagerService;
    constructor(attendanceRepository: Repository<Attendance>, userAttendanceRepository: Repository<UserAttendance>, attendanceDayRepository: Repository<AttendanceDay>, fileManagerService: FileManagerService);
    create(createAttendanceDto: CreateAttendanceDto, user: User, image?: Express.Multer.File): Promise<CommonResponseDto<any>>;
    findAllByUserId(userId: string): Promise<ResponseWithoutPaginationDto<UserAttendance>>;
    findOneById(id: string): Promise<CommonResponseDto<Attendance>>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto, image?: Express.Multer.File): Promise<CommonResponseDto<any>>;
    delete(attendanceId: string, userId: string): Promise<CommonResponseDto<any>>;
    private convertToAttendanceDays;
    private isValidDays;
}
