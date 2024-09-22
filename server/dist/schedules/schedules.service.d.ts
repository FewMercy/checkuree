import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DeleteScheduleDto } from './dto/delete-schedule.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { ScheduleFilterDto } from './dto/schedule-filter.dto';
import { PageResponseDto } from '../common/response/pageResponse.dto';
import { TimeGroupedScheduleResDto } from './const/time-grouped-schedule-res.dto';
export declare class SchedulesService {
    private scheduleRepository;
    constructor(scheduleRepository: Repository<Schedule>);
    create(createScheduleDto: CreateScheduleDto, user: User): Promise<CommonResponseDto<{
        ids: number[];
    }>>;
    findByAttendeeId(attendeeId: string): Promise<ResponseWithoutPaginationDto<Schedule>>;
    findAllByAttendanceId(attendanceId: string, scheduleFilterDto: ScheduleFilterDto): Promise<PageResponseDto<Schedule>>;
    findScheduleByAttendanceIdAndDate(attendanceId: string, dateString: string, scheduleFilterDto: ScheduleFilterDto): Promise<PageResponseDto<TimeGroupedScheduleResDto>>;
    deleteAll(deleteScheduleDto: DeleteScheduleDto): Promise<CommonResponseDto<any>>;
    private verifyAttendTime;
    private convertDayToDayType;
    private isValideDateFormat;
}
