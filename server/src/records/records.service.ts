import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { User } from '../users/entities/user.entity';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, InsertResult, Like, Repository, SelectQueryBuilder } from 'typeorm';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { AttendanceStatus } from './const/record-type.enum';
import { RecordFilterDto } from './dto/record-filter.dto';
import { NumberToDayString } from './const/numberToDayString';
import { ExcelService } from '../common/excel.service';
import { PageResponseDto } from '../common/response/pageResponse.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { CreateAllRecordDto } from './dto/createAll-record.dto';
import { MultiIdsResponseDto } from '../common/response/multi-ids-response.dto';
import { DateRecordSummaryResponseDto } from './dto/date-record-summary-response.dto';
import { AttendeeRecordSummaryDto } from './dto/attendee-record-summary.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    private excelService: ExcelService,
  ) {}
  async create(createRecordDto: CreateRecordDto, user: User): Promise<CommonResponseDto<MultiIdsResponseDto>> {
    const records = createRecordDto.toEntities(user.id);

    records.forEach((record) => {
      const realDay = NumberToDayString[new Date(record.date).getDay()];

      if (record.day !== realDay.toUpperCase()) {
        throw new BadRequestException('요일이 정확하지 않습니다.');
      }

      if (record.status !== AttendanceStatus.ABSENT) {
        delete record.absenceType;
      }
      if (record.status !== AttendanceStatus.LATE) {
        delete record.lateTime;
      }
    });

    const uniqueRecords = this.removeDuplicateRecords(records);

    const result: InsertResult = await this.recordRepository.upsert(uniqueRecords, {
      conflictPaths: ['attendeeId', 'date'],
      upsertType: 'on-conflict-do-update',
    });

    return new CommonResponseDto('SUCCESS CREATE RECORD', {
      ids: result.identifiers.map((identifier) => identifier.id),
    });
  }

  async createAll(createAllRecordDto: CreateAllRecordDto, user: User): Promise<CommonResponseDto<any>> {
    const result = await this.recordRepository.query(
      `
    INSERT INTO record (attendeeId,status,date,day,createId)
    SELECT atd.id,?,?,?,?
    FROM attendee as atd
    LEFT JOIN record r ON r.attendeeId = atd.id AND r.date = ?
    LEFT JOIN schedule s ON s.attendeeId = atd.id AND s.day = ?
    WHERE atd.attendanceId = ? AND atd.deletedAt IS NULL AND r.id IS NULL AND s.id IS NOT NULL;`,
      [
        createAllRecordDto.status,
        createAllRecordDto.date,
        createAllRecordDto.day,
        user.id,
        createAllRecordDto.date,
        createAllRecordDto.day,
        createAllRecordDto.attendanceId,
      ],
    );

    return new CommonResponseDto('SUCCESS CREATE ALL RECORDS', { affectedRows: result.affectedRows });
  }

  async findOneById(id: number): Promise<CommonResponseDto<Record>> {
    return new CommonResponseDto('SUCCESS FIND RECORD', await this.recordRepository.findOneBy({ id }));
  }

  async getRecordSummaryByAttendanceId(attendanceId: string, date: string): Promise<any> {
    if (!this.isValidDate(date)) {
      throw new BadRequestException('날짜 형식이 올바르지 않습니다.');
    }

    const summary = await this.recordRepository
      .createQueryBuilder('record')
      .select('record.status', 'status')
      .addSelect('COUNT(record.id)', 'count')
      .innerJoin('record.attendee', 'attendee', 'attendee.attendanceId = :attendanceId', {
        attendanceId: attendanceId,
      })
      .groupBy('record.status')
      .getRawMany();

    let presentCount = 0,
      absenceCount = 0,
      lateCount = 0;
    summary.forEach((record) => {
      switch (record.status) {
        case 'PRESENT':
          presentCount = parseInt(record.count);
          break;
        case 'ABSENT':
          absenceCount = parseInt(record.count);
          break;
        case 'LATE':
          lateCount = parseInt(record.count);
          break;
      }
    });

    const result: DateRecordSummaryResponseDto = {
      date: date,
      presentCount,
      absenceCount,
      lateCount,
    };

    return result;
  }

  async getRecordSummaryByAttendeeId(attendanceId: string, attendeeRecordSummaryDto: AttendeeRecordSummaryDto) {
    const qb = this.recordRepository
      .createQueryBuilder('record')
      .innerJoin('record.attendee', 'attendee', 'attendee.attendanceId = :attendanceId', {
        attendanceId,
      })
      .select('attendee.id', 'attendeeId')
      .addSelect('record.status', 'status')
      .addSelect('COUNT(record.id)', 'count')
      .where('attendee.id IN (:...attendeeIds)', { attendeeIds: attendeeRecordSummaryDto.attendeeIds })
      .groupBy('attendee.id,record.status');

    const summary = await qb.getRawMany();

    const results = [];
    attendeeRecordSummaryDto.attendeeIds.forEach((attendeeId) => {
      results.push({
        attendeeId: attendeeId,
        presentCount: 0,
        absenceCount: 0,
        lateCount: 0,
      });
    });

    console.log(summary);

    summary.forEach((record) => {
      const result = results.find((result) => result.attendeeId === record.attendeeId);
      const status = (record.status + '').toUpperCase();
      console.log(status);
      switch (status) {
        case 'PRESENT':
          result.presentCount = parseInt(record.count);
          break;
        case 'ABSENT':
          result.absenceCount = parseInt(record.count);
          break;
        case 'LATE':
          result.lateCount = parseInt(record.count);
          break;
      }

      console.log(result);
    });

    return results;
  }

  async findByAttendanceId(attendanceId: string, recordFilterDto: RecordFilterDto): Promise<PageResponseDto<Record>> {
    const queryBuilder = this.recordRepository
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.attendee', 'attendee', 'attendee.attendanceId = :attendanceId', {
        attendanceId: attendanceId,
      });

    if (recordFilterDto.date) {
      queryBuilder.andWhere({ date: recordFilterDto.date });
    }

    if (recordFilterDto.day) {
      queryBuilder.andWhere({ day: recordFilterDto.day });
    }

    if (recordFilterDto.status) {
      queryBuilder.andWhere({ status: recordFilterDto.status });
    }

    // Pagination
    if (recordFilterDto.pageNo && recordFilterDto.pageSize) {
      queryBuilder.take(recordFilterDto.getLimit());
      queryBuilder.skip(recordFilterDto.getOffset());
    }

    const [items, count] = await queryBuilder.getManyAndCount();

    return new PageResponseDto<Record>(recordFilterDto.pageSize, count, items);
  }

  async findByAttendeeId(attendeeId: string, recordFilterDto: RecordFilterDto): Promise<ResponseWithoutPaginationDto<Record>> {
    const queryBuilder: SelectQueryBuilder<Record> = this.recordRepository
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.attendee', 'attendee', 'attendee.id=:attendeeId', {
        attendeeId: attendeeId,
      });

    if (recordFilterDto.year && recordFilterDto.month) {
      const month = recordFilterDto.month < 10 ? '0' + recordFilterDto.month : recordFilterDto.month;
      queryBuilder.andWhere({ date: Like(`${recordFilterDto.year}-${month}-%`) });
    } else if (recordFilterDto.year) {
      queryBuilder.andWhere({ date: Like(`${recordFilterDto.year}-%`) });
    }

    if (recordFilterDto.dateFrom) {
      queryBuilder.andWhere('record.date >= :dateFrom', { dateFrom: recordFilterDto.dateFrom });
    }

    if (recordFilterDto.dateTo) {
      queryBuilder.andWhere('record.date < :dateTo', { dateTo: recordFilterDto.dateTo });
    }

    const result = await queryBuilder.getManyAndCount();
    return new ResponseWithoutPaginationDto<Record>(result[1], result[0]);
  }
  async deleteAll(deleteRecordDto: DeleteRecordDto): Promise<CommonResponseDto<any>> {
    const found = await this.recordRepository.find({
      where: {
        attendee: { attendanceId: deleteRecordDto.attendanceId },
        id: In(deleteRecordDto.ids),
      },
    });

    const filteredRecord = found.filter((record) => {
      return deleteRecordDto.ids.includes(record.id);
    });

    if (filteredRecord.length !== deleteRecordDto.ids.length) {
      throw new BadRequestException(`AttendanceId : ${deleteRecordDto.attendanceId} 에 속한 기록만 삭제할 수 있습니다..`);
    }

    await this.recordRepository.softDelete({
      id: In(deleteRecordDto.ids),
    });
    return new CommonResponseDto('SUCCESS DELETE RECORDS');
  }

  async excelDownload(attendanceId: string, recordFilterDto: RecordFilterDto) {
    const rawData = await this.findByAttendanceIdForExcel(attendanceId, recordFilterDto);

    const dataToDbMapper = {};

    dataToDbMapper['attendee_name'] = '회원이름';
    dataToDbMapper['attendee_age'] = '나이';
    dataToDbMapper['record_day'] = '요일';
    dataToDbMapper['record_date'] = '날짜';
    dataToDbMapper['record_status'] = '출석상태';

    const excelBuffer = this.excelService.exportDataToExcel(rawData, dataToDbMapper);
    return excelBuffer;
  }

  async attendeeRecordExcelDownload(attendeeId: string, recordFilterDto: RecordFilterDto) {
    const rawData = await this.findByAttendeeIdForExcel(attendeeId, recordFilterDto);

    const dataToDbMapper = {};

    dataToDbMapper['attendee_name'] = '회원이름';
    dataToDbMapper['attendee_age'] = '나이';
    dataToDbMapper['record_day'] = '요일';
    dataToDbMapper['record_date'] = '날짜';
    dataToDbMapper['record_status'] = '출석상태';

    const excelBuffer = this.excelService.exportDataToExcel(rawData, dataToDbMapper);
    return excelBuffer;
  }

  private async findByAttendeeIdForExcel(attendeeId: string, recordFilterDto: RecordFilterDto): Promise<Record[]> {
    const queryBuilder: SelectQueryBuilder<Record> = this.recordRepository
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.attendee', 'attendee', 'attendee.id=:attendeeId', {
        attendeeId: attendeeId,
      });

    if (recordFilterDto.year && recordFilterDto.month) {
      const month = recordFilterDto.month < 10 ? '0' + recordFilterDto.month : recordFilterDto.month;
      queryBuilder.andWhere({ date: Like(`${recordFilterDto.year}-${month}-%`) });
    } else if (recordFilterDto.year) {
      queryBuilder.andWhere({ date: Like(`${recordFilterDto.year}-%`) });
    }

    if (recordFilterDto.dateFrom) {
      queryBuilder.andWhere('record.date >= :dateFrom', { dateFrom: recordFilterDto.dateFrom });
    }

    if (recordFilterDto.dateTo) {
      queryBuilder.andWhere('record.date < :dateTo', { dateTo: recordFilterDto.dateTo });
    }

    return queryBuilder.getRawMany();
  }

  private async findByAttendanceIdForExcel(attendanceId: string, recordFilterDto: RecordFilterDto): Promise<Record[]> {
    const queryBuilder: SelectQueryBuilder<Record> = this.recordRepository
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.attendee', 'attendee', 'attendee.attendanceId = :attendanceId', {
        attendanceId: attendanceId,
      })
      .select('record')
      .addSelect('attendee.name')
      .addSelect('attendee.age');

    if (recordFilterDto.date) {
      queryBuilder.andWhere({ date: recordFilterDto.date });
    }

    if (recordFilterDto.day) {
      queryBuilder.andWhere({ day: recordFilterDto.day });
    }

    if (recordFilterDto.status) {
      queryBuilder.andWhere({ status: recordFilterDto.status });
    }

    queryBuilder.orderBy('attendee_name', 'ASC');

    return queryBuilder.getRawMany();
  }

  private removeDuplicateRecords(records: Record[]): Record[] {
    // 레코드 분류 및 중복 제거
    const uniqueRecordsMap = new Map();
    records.forEach((record) => {
      const key = `${record.attendeeId}-${record.date}`;
      uniqueRecordsMap.set(key, record); // 같은 키로 들어오는 레코드를 덮어쓰기. 마지막 레코드만 남음
    });

    // Map에서 레코드 배열을 재구성
    return Array.from(uniqueRecordsMap.values());
  }

  private isValidDate(date: string): boolean {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(date);
  }
}
