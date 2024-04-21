import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { User } from '../users/entities/user.entity';
import { Attendee } from './entities/attendee.entity';
import { DeleteAttendeeDto } from './dto/delete-attendee.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
export declare class AttendeesController {
    private readonly attendeesService;
    constructor(attendeesService: AttendeesService);
    create(createAttendeeDto: CreateAttendeeDto, user: User): Promise<CommonResponseDto<any>>;
    findAllByAttendanceId(attendanceId: string): Promise<ResponseWithoutPaginationDto<Attendee>>;
    findOne(id: string): Promise<CommonResponseDto<Attendee>>;
    update(id: string, updateAttendeeDto: UpdateAttendeeDto): Promise<CommonResponseDto<any>>;
    delete(deleteAttendeeDto: DeleteAttendeeDto): Promise<CommonResponseDto<any>>;
}
