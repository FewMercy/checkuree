import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { User } from '../users/entities/user.entity';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, InsertResult, Repository } from 'typeorm';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { CreateAllRecordDto } from './dto/createAll-record.dto';
import { AttendanceStatus } from './record-type.enum';
import { RecordFilterDto } from './dto/record-filter.dto';
import { NumberToDayString } from './numberToDayString';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}
  async create(createRecordDto: CreateRecordDto, user: User) {
    const record = createRecordDto.toEntity(user.id);

    const realDay = NumberToDayString[new Date(record.date).getDay()];

    if (record.day !== realDay.toUpperCase()) {
      throw new BadRequestException('요일이 정확하지 않습니다.');
    }

    if (record.status !== AttendanceStatus.ABSENT) {
      delete record.lateReason;
    }

    const result: InsertResult = await this.recordRepository.upsert(record, {
      conflictPaths: ['attendeeId', 'date'],
      upsertType: 'on-conflict-do-update',
    });

    return this.findOneById(result.raw?.insertId);
  }

  async createAll(createAllRecordDto: CreateAllRecordDto, user: User): Promise<number> {
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
    return result.affectedRows;
  }

  async findOneById(id: number) {
    return this.recordRepository.findOneBy({ id });
  }

  async findByAttendanceId(attendanceId: string, recordFilterDto: RecordFilterDto): Promise<Record[]> {
    const queryBuilder = await this.recordRepository
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
    queryBuilder.take(recordFilterDto.take);
    queryBuilder.skip(recordFilterDto.skip);

    return queryBuilder.getMany();
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return `This action updates a #${id} record`;
  }

  async deleteAll(deleteRecordDto: DeleteRecordDto) {
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
    return;
  }
}
