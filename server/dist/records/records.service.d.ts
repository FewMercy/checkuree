/// <reference types="node" />
import { CreateRecordDto } from './dto/create-record.dto';
import { User } from '../users/entities/user.entity';
import { Record } from './entities/record.entity';
import { Repository } from 'typeorm';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { RecordFilterDto } from './dto/record-filter.dto';
import { ExcelService } from '../common/excel.service';
import { PageResponseDto } from '../common/response/pageResponse.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { CreateAllRecordDto } from './dto/createAll-record.dto';
import { MultiIdsResponseDto } from '../common/response/multi-ids-response.dto';
export declare class RecordsService {
    private recordRepository;
    private excelService;
    constructor(recordRepository: Repository<Record>, excelService: ExcelService);
    create(createRecordDto: CreateRecordDto, user: User): Promise<CommonResponseDto<MultiIdsResponseDto>>;
    createAll(createAllRecordDto: CreateAllRecordDto, user: User): Promise<CommonResponseDto<any>>;
    findOneById(id: number): Promise<CommonResponseDto<Record>>;
    findByAttendanceId(attendanceId: string, recordFilterDto: RecordFilterDto): Promise<PageResponseDto<Record>>;
    findByAttendeeId(attendeeId: string, recordFilterDto: RecordFilterDto): Promise<ResponseWithoutPaginationDto<Record>>;
    deleteAll(deleteRecordDto: DeleteRecordDto): Promise<CommonResponseDto<any>>;
    excelDownload(attendanceId: string, recordFilterDto: RecordFilterDto): Promise<Buffer>;
    attendeeRecordExcelDownload(attendeeId: string, recordFilterDto: RecordFilterDto): Promise<Buffer>;
    private findByAttendeeIdForExcel;
    private findByAttendanceIdForExcel;
    private removeDuplicateRecords;
}
