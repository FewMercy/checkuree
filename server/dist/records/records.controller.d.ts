import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { User } from '../users/entities/user.entity';
import { Record } from './entities/record.entity';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { CreateAllRecordDto } from './dto/createAll-record.dto';
import { RecordFilterDto } from './dto/record-filter.dto';
import { PageResponseDto } from '../common/response/pageResponse.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
export declare class RecordsController {
    private readonly recordsService;
    constructor(recordsService: RecordsService);
    createRecord(createRecordDto: CreateRecordDto, user: User): Promise<CommonResponseDto<any>>;
    createAllRecord(createAllRecordDto: CreateAllRecordDto, user: User): Promise<CommonResponseDto<any>>;
    findOne(id: string): Promise<CommonResponseDto<Record>>;
    findByAttendeeId(attendeeId: string, recordFilterDto: RecordFilterDto): Promise<ResponseWithoutPaginationDto<Record>>;
    findByAttendanceId(attendanceId: string, recordFilterDto: RecordFilterDto): Promise<PageResponseDto<Record>>;
    downloadAttendanceRecordExcel(res: any, attendanceId: string, recordFilterDto: RecordFilterDto): Promise<void>;
    downloadAttendeeRecordExcel(res: any, attendeeId: string, recordFilterDto: RecordFilterDto): Promise<void>;
    deleteAll(deleteRecordDto: DeleteRecordDto): Promise<CommonResponseDto<any>>;
}
