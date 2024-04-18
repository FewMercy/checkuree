import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { User } from '../users/entities/user.entity';
import { Attendee } from './entities/attendee.entity';
import { Repository } from 'typeorm';
import { DeleteAttendeeDto } from './dto/delete-attendee.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
export declare class AttendeesService {
    private attendeeRepository;
    constructor(attendeeRepository: Repository<Attendee>);
    createAttendee(createAttendeeDto: CreateAttendeeDto, user: User): Promise<CommonResponseDto<any>>;
    findAllByAttendanceId(attendanceId: string): Promise<ResponseWithoutPaginationDto<Attendee>>;
    findOneById(id: string): Promise<CommonResponseDto<Attendee>>;
    update(id: string, updateAttendeeDto: UpdateAttendeeDto): Promise<CommonResponseDto<any>>;
    deleteAll(deleteAttendeeDto: DeleteAttendeeDto): Promise<CommonResponseDto<any>>;
}
