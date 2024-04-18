import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DeleteScheduleDto } from './dto/delete-schedule.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
export declare class SchedulesService {
    private scheduleRepository;
    constructor(scheduleRepository: Repository<Schedule>);
    create(createScheduleDto: CreateScheduleDto, user: User): Promise<CommonResponseDto<{
        ids: number[];
    }>>;
    findByAttendeeId(attendeeId: string): Promise<ResponseWithoutPaginationDto<Schedule>>;
    findAllByAttendanceId(attendanceId: string): Promise<ResponseWithoutPaginationDto<Schedule>>;
    findScheduleByAttendanceIdAndDate(attendanceId: string, dateString: string): Promise<ResponseWithoutPaginationDto<Schedule>>;
    deleteAll(deleteScheduleDto: DeleteScheduleDto): Promise<CommonResponseDto<any>>;
    private verifyAttendTime;
}
