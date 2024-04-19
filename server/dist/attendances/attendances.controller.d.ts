import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { User } from '../users/entities/user.entity';
import { Attendance } from './entities/attendance.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
export declare class AttendancesController {
    private readonly attendancesService;
    constructor(attendancesService: AttendancesService);
    createAttendance(createAttendanceDto: CreateAttendanceDto, user: User, image?: Express.Multer.File): Promise<CommonResponseDto<any>>;
    findAllByUserId(user: User): Promise<ResponseWithoutPaginationDto<UserAttendance>>;
    findOneById(attendanceId: string): Promise<CommonResponseDto<Attendance>>;
    update(attendanceId: string, updateAttendanceDto: UpdateAttendanceDto, image?: Express.Multer.File): Promise<CommonResponseDto<any>>;
    delete(attendanceId: string, user: User): Promise<CommonResponseDto<any>>;
}
