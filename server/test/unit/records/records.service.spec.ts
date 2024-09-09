import { Test, TestingModule } from '@nestjs/testing';
import { RecordsService } from '../../../src/records/records.service';
import { User } from '../../../src/users/entities/user.entity';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { AttendanceType } from '../../../src/attendances/const/attendance-type.enum';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../../../src/records/entities/record.entity';
import { CreateRecordDto } from '../../../src/records/dto/create-record.dto';
import { DayType } from '../../../src/schedules/const/day-type.enum';
import { AttendanceStatus } from '../../../src/records/const/record-type.enum';
import { In, Repository } from 'typeorm';
import { DeleteRecordDto } from '../../../src/records/dto/delete-record.dto';
import { createSimpleAttendee } from '../attendee/createSimpleAttendee';
import { CreateAllRecordDto } from '../../../src/records/dto/createAll-record.dto';
import { Schedule } from '../../../src/schedules/entities/schedule.entity';
import { RecordFilterDto } from '../../../src/records/dto/record-filter.dto';
import { ExcelService } from '../../../src/common/excel.service';
import { SingleRecord } from '../../../src/records/const/singleRecord.class';
import { Gender } from '../../../src/attendees/const/gender.enum';
import { HhMm, YyMmDd } from '../../../src/common/contracts';

describe('RecordsService', () => {
  let module: TestingModule;
  let service: RecordsService;
  let recordRepository: Repository<Record>;
  let scheduleRepository: Repository<Schedule>;
  let attendeeRepository: Repository<Attendee>;
  let attendanceRepository: Repository<Attendance>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Record])],
      providers: [RecordsService, ExcelService],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
    recordRepository = module.get(getRepositoryToken(Record));
    scheduleRepository = module.get(getRepositoryToken(Schedule));
    attendeeRepository = module.get(getRepositoryToken(Attendee));
    attendanceRepository = module.get(getRepositoryToken(Attendance));
    userRepository = module.get(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await setupTest();
  });

  afterEach(async () => {
    // Delete tables after each test
    await clear();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Record Test', () => {
    it('출석기록 생성시 success, message, id를 리턴한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const recordDto = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, '1200', attendee.id);

      // When
      const sut = await service.create(recordDto, user);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS CREATE RECORD');
      expect(sut.data.ids).toBeDefined();
    });

    it('입력한 값으로 출석기록을 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const recordDto = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, '1200', attendee.id);

      // When
      const createResponse = await service.create(recordDto, user);

      const sut = await recordRepository.findOneBy({ id: createResponse.data.ids[0] });

      // Then
      expect(sut.attendeeId).toBe('Attendee Id 1');
      expect(sut.date).toBe('2024-01-15');
      expect(sut.day).toBe('MONDAY');
      expect(sut.status).toBe('Present');
    });

    it('복수의 records를 입력 받아 출석기록을 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';

      const attendee_2 = new Attendee();
      attendee_2.id = 'Attendee Id 2';

      const recordDto = new CreateRecordDto();
      recordDto.singleRecords = [
        createSingleRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, '1200', attendee_1.id),
        createSingleRecord('2024-01-16', DayType.TUESDAY, AttendanceStatus.ABSENT, '1200', attendee_1.id),
        createSingleRecord('2024-01-17', DayType.WEDNESDAY, AttendanceStatus.PRESENT, '1200', attendee_2.id),
      ];
      // When
      const createResponse = await service.create(recordDto, user);

      const sut = await recordRepository.findBy({ id: In(createResponse.data.ids) });

      // Then
      expect(sut).toHaveLength(3);

      const expectedRecords = [
        { date: '2024-01-15', day: DayType.MONDAY, status: AttendanceStatus.PRESENT, attendeeId: attendee_1.id },
        { date: '2024-01-16', day: DayType.TUESDAY, status: AttendanceStatus.ABSENT, attendeeId: attendee_1.id },
        { date: '2024-01-17', day: DayType.WEDNESDAY, status: AttendanceStatus.PRESENT, attendeeId: attendee_2.id },
      ];

      expectedRecords.forEach((expectedRecord, index) => {
        const actualRecord = sut[index];
        expect(actualRecord.date).toEqual(expectedRecord.date);
        expect(actualRecord.day).toEqual(expectedRecord.day);
        expect(actualRecord.status).toEqual(expectedRecord.status);
        expect(actualRecord.attendeeId).toEqual(expectedRecord.attendeeId);
      });
    });

    it('같은 attendeeId,data의 records가 복수개인 경우 마지막 데이터로 record를 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const recordDto = new CreateRecordDto();
      recordDto.singleRecords = [
        createSingleRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, '1200', attendee.id),
        createSingleRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.LATE, '1200', attendee.id),
        createSingleRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.ABSENT, '1200', attendee.id),
      ];
      // When
      const createResponse = await service.create(recordDto, user);

      const sut = await recordRepository.findBy({ id: In(createResponse.data.ids) });

      // Then
      expect(sut).toHaveLength(1);
      expect(sut[0].day).toBe('MONDAY');
      expect(sut[0].date).toBe('2024-01-15');
      expect(sut[0].status).toBe(AttendanceStatus.ABSENT);
      expect(sut[0].attendeeId).toBe('Attendee Id 1');
    });

    it('같은 attendeeId,data의 records가 복수개인 경우 가장 최신의 record만 upsert 한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const recordDto = new CreateRecordDto();
      recordDto.singleRecords = [
        createSingleRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, '1200', attendee.id),
        createSingleRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.LATE, '1200', attendee.id),
        createSingleRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.ABSENT, '1200', attendee.id),
      ];

      const spyUpsert = jest.spyOn(recordRepository, 'upsert');

      // When
      const createResponse = await service.create(recordDto, user);

      const sut = await recordRepository.findBy({ id: In(createResponse.data.ids) });

      // Then
      const recordParameter = spyUpsert.mock.calls[0][0];

      expect(recordParameter).toHaveLength(1);

      expect(recordParameter[0]).toEqual(
        expect.objectContaining({
          date: '2024-01-15',
          day: 'MONDAY',
          status: AttendanceStatus.ABSENT,
          attendeeId: 'Attendee Id 1',
        }),
      );
    });

    it('입력한 date의 실제 요일이 입력한 day가 아닌 경우 오류를 발생시킨다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      // 실제 2024-01-15는 월요일
      const recordDto = createRecordDto('2024-01-15', DayType.FRIDAY, AttendanceStatus.PRESENT, '1200', attendee.id);

      // When / Then
      expect(async () => {
        await service.create(recordDto, user);
      }).rejects.toThrowError('요일이 정확하지 않습니다.');
    });

    it('출석상태가 지각이 아닌 경우 lateReason이 입력되지 않는다.', async () => {
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const singleRecord = new SingleRecord();
      singleRecord.day = DayType.MONDAY;
      singleRecord.date = '2024-01-15';
      singleRecord.status = AttendanceStatus.PRESENT;
      singleRecord.attendeeId = attendee.id;

      const recordDto = new CreateRecordDto();
      recordDto.singleRecords = [singleRecord];

      const createResponse = await service.create(recordDto, user);

      const sut = await recordRepository.findOneBy({ id: createResponse.data.ids[0] });

      expect(sut.attendeeId).toBe('Attendee Id 1');
      expect(sut.date).toBe('2024-01-15');
      expect(sut.day).toBe('MONDAY');
      expect(sut.status).toBe('Present');
    });

    it('출석부 생성 시 createId, createdAt을 기록한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const now = new Date();

      const recordDto = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, '1200', attendee.id);
      recordDto.createdAt = now;

      // When
      const createResponse = await service.create(recordDto, user);

      const sut = await recordRepository.findOneBy({ id: createResponse.data.ids[0] });

      // Then
      expect(sut.createdAt).toStrictEqual(now);
      expect(sut.createId).toBe('user id 1');
    });

    it('선택한 날짜에 선택한 출석대상의 출석내용이 이미 존재하는 경우 Update 한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendee = new Attendee();
      attendee.id = 'Attendee Id 1';

      const recordDto_1 = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.PRESENT, '1200', attendee.id);

      await service.create(recordDto_1, user);

      const recordDto_2 = createRecordDto('2024-01-15', DayType.MONDAY, AttendanceStatus.ABSENT, '1200', attendee.id);

      // When
      const createResponse = await service.create(recordDto_2, user);

      const sut = await recordRepository.findOneBy({ id: createResponse.data.ids[0] });

      // Then
      expect(sut.attendeeId).toBe('Attendee Id 1');
      expect(sut.date).toBe('2024-01-15');
      expect(sut.day).toBe('MONDAY');
      expect(sut.status).not.toBe('Present');
      expect(sut.status).toBe('Absent');
    });
  });

  describe('CreateAll Test', () => {
    it('일괄 생성 성공시 success,message,affectedRows를 리턴한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', attendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', attendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', attendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const attendeeIds = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const schedule1 = createSchedule(attendeeIds[0].id, DayType.TUESDAY, '0930');
      const schedule2 = createSchedule(attendeeIds[1].id, DayType.TUESDAY, '1210');
      const schedule3 = createSchedule(attendeeIds[2].id, DayType.TUESDAY, '1500');

      await scheduleRepository.save([schedule1, schedule2, schedule3]);

      const createAllRecordDto = new CreateAllRecordDto();
      createAllRecordDto.day = DayType.TUESDAY;
      createAllRecordDto.date = '2024-01-30';
      createAllRecordDto.status = AttendanceStatus.PRESENT;
      createAllRecordDto.attendanceId = attendanceId;

      // When
      const sut = await service.createAll(createAllRecordDto, user);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS CREATE ALL RECORDS');
      expect(sut.data.affectedRows).toBeDefined();
    });

    it('선택한 날짜에 스케쥴이 있는 모든 출석대상의 출석기록을 일괄 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', attendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', attendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', attendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const attendeeIds = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const schedule1 = createSchedule(attendeeIds[0].id, DayType.TUESDAY, '0930');
      const schedule2 = createSchedule(attendeeIds[1].id, DayType.TUESDAY, '1210');
      const schedule3 = createSchedule(attendeeIds[2].id, DayType.TUESDAY, '1500');

      await scheduleRepository.save([schedule1, schedule2, schedule3]);

      const createAllRecordDto = new CreateAllRecordDto();
      createAllRecordDto.day = DayType.TUESDAY;
      createAllRecordDto.date = '2024-01-30';
      createAllRecordDto.status = AttendanceStatus.PRESENT;
      createAllRecordDto.attendanceId = attendanceId;

      // When
      await service.createAll(createAllRecordDto, user);

      const sut = await recordRepository.find({
        where: {
          attendee: {
            attendanceId: createAllRecordDto.attendanceId,
          },
          date: createAllRecordDto.date,
        },
      });
      // Then
      expect(sut).toHaveLength(3);
      sut.map((record) => {
        expect(record.status).toBe(AttendanceStatus.PRESENT);
        expect(record.date).toBe('2024-01-30');
        expect(record.day).toBe(DayType.TUESDAY);
        expect(record.createId).toBe(user.id);
      });
    });

    it('스케쥴이 없는 경우 출석기록이 생성되지 않는다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', attendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', attendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', attendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const attendeeIds = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const schedule1 = createSchedule(attendeeIds[0].id, DayType.MONDAY, '0930');
      const schedule2 = createSchedule(attendeeIds[1].id, DayType.TUESDAY, '1210');
      const schedule3 = createSchedule(attendeeIds[2].id, DayType.WEDNESDAY, '1500');

      await scheduleRepository.save([schedule1, schedule2, schedule3]);

      const createAllRecordDto = new CreateAllRecordDto();
      createAllRecordDto.day = DayType.TUESDAY;
      createAllRecordDto.date = '2024-01-30';
      createAllRecordDto.status = AttendanceStatus.PRESENT;
      createAllRecordDto.attendanceId = attendanceId;

      // When
      await service.createAll(createAllRecordDto, user);

      const sut = await recordRepository.find({
        where: {
          attendee: {
            attendanceId: createAllRecordDto.attendanceId,
          },
          date: createAllRecordDto.date,
        },
      });

      // Then
      expect(sut).toHaveLength(1);
      expect(sut[0].status).toBe(AttendanceStatus.PRESENT);
      expect(sut[0].date).toBe('2024-01-30');
      expect(sut[0].day).toBe(DayType.TUESDAY);
      expect(sut[0].createId).toBe(user.id);
    });

    it('선택한 날짜에 스케쥴이 있는 모든 출석대상의 출석기록을 일괄 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', attendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', attendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', attendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const attendeeIds = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const schedule1 = createSchedule(attendeeIds[0].id, DayType.TUESDAY, '0930');
      const schedule2 = createSchedule(attendeeIds[1].id, DayType.TUESDAY, '1210');
      const schedule3 = createSchedule(attendeeIds[2].id, DayType.TUESDAY, '1500');

      await scheduleRepository.save([schedule1, schedule2, schedule3]);

      const createAllRecordDto = new CreateAllRecordDto();
      createAllRecordDto.day = DayType.TUESDAY;
      createAllRecordDto.date = '2024-01-30';
      createAllRecordDto.status = AttendanceStatus.PRESENT;
      createAllRecordDto.attendanceId = attendanceId;

      // When
      await service.createAll(createAllRecordDto, user);

      const sut = await recordRepository.find({
        where: {
          attendee: {
            attendanceId: createAllRecordDto.attendanceId,
          },
          date: createAllRecordDto.date,
        },
      });

      // Then
      expect(sut).toHaveLength(3);
      sut.map((record) => {
        expect(record.status).toBe(AttendanceStatus.PRESENT);
        expect(record.date).toBe('2024-01-30');
        expect(record.day).toBe(DayType.TUESDAY);
        expect(record.createId).toBe(user.id);
      });
    });

    it('출석 내역이 없는 경우에 대해서만 일괄 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const attendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', attendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', attendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', attendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');

      const [createAttendee_1, createAttendee_2, createAttendee_3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const schedule1 = createSchedule(createAttendee_1.id, DayType.TUESDAY, '0930');
      const schedule2 = createSchedule(createAttendee_2.id, DayType.TUESDAY, '1210');
      const schedule3 = createSchedule(createAttendee_3.id, DayType.TUESDAY, '1500');

      await scheduleRepository.save([schedule1, schedule2, schedule3]);

      const record = createRecord('2024-01-30', DayType.TUESDAY, AttendanceStatus.PRESENT, createAttendee_1.id, user.id);
      await recordRepository.save(record);

      const createAllRecordDto = new CreateAllRecordDto();
      createAllRecordDto.day = DayType.TUESDAY;
      createAllRecordDto.date = '2024-01-30';
      createAllRecordDto.status = AttendanceStatus.PRESENT;
      createAllRecordDto.attendanceId = attendanceId;

      // When
      const sut = await service.createAll(createAllRecordDto, user);

      // Then
      expect(sut.data.affectedRows).toBe(2);
    });
  });

  describe('FindByAttendanceId Test', () => {
    it('요청 성공 시 success,count,totalPage,pageSize,items를 리턴한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', targetAttendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', targetAttendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', targetAttendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const [createdAttendee1, createdAttendee2, createdAttendee3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const record1_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);

      await recordRepository.save([record1_1, record1_2, record1_3, record2_1, record2_2, record2_3, record3_1, record3_2, record3_3]);

      // When
      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.pageSize = 10;
      recordFilterDto.pageNo = 0;
      const sut = await service.findByAttendanceId(targetAttendanceId, recordFilterDto);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.count).toBe(9);
      expect(sut.totalPage).toBe(1);
      expect(sut.pageSize).toBe(10);
      expect(sut.items).toBeDefined();
    });

    it('attendanceId에 속한 모든 record를 조사한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', targetAttendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', targetAttendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', targetAttendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const [createdAttendee1, createdAttendee2, createdAttendee3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const record1_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);

      await recordRepository.save([record1_1, record1_2, record1_3, record2_1, record2_2, record2_3, record3_1, record3_2, record3_3]);

      // When
      const recordFilterDto = new RecordFilterDto();
      const sut = await service.findByAttendanceId(targetAttendanceId, recordFilterDto);

      // Then
      expect(sut.count).toBe(9);
      sut.items.map((result) => {
        expect(['2024-01-31', '2024-02-01', '2024-02-02']).toContain(result.date);
        expect([createdAttendee1.id, createdAttendee2.id, createdAttendee3.id]).toContain(result.attendeeId);
        expect(result.attendee.id).not.toBeNull();
      });
    });

    it('attendanceId에 속하지 않은 attendee의 record는 조회되지 않는다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', targetAttendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', targetAttendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', 'notTestAttendanceId', 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const [createdAttendee1, createdAttendee2, createdAttendee3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const record1_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);

      await recordRepository.save([record1_1, record1_2, record1_3, record2_1, record2_2, record2_3, record3_1, record3_2, record3_3]);

      // When
      const recordFilterDto = new RecordFilterDto();
      const sut = await service.findByAttendanceId(targetAttendanceId, recordFilterDto);

      // Then
      expect(sut.count).toBe(6);
      sut.items.map((result) => {
        expect([createdAttendee1.id, createdAttendee2.id]).toContain(result.attendeeId);
      });
    });
  });

  describe('FindByAttendanceId RecordFilterDto Test', () => {
    it('recordFilterDto의 date에 속한 record만 조회한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', targetAttendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', targetAttendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', targetAttendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const [createdAttendee1, createdAttendee2, createdAttendee3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const record1_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);

      await recordRepository.save([record1_1, record1_2, record1_3, record2_1, record2_2, record2_3, record3_1, record3_2, record3_3]);

      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.date = '2024-01-31';

      // When
      const sut = await service.findByAttendanceId(targetAttendanceId, recordFilterDto);

      // Then
      expect(sut.count).toBe(3);
      sut.items.map((result) => {
        expect(result.date).toBe('2024-01-31');
        expect([createdAttendee1.id, createdAttendee2.id, createdAttendee3.id]).toContain(result.attendeeId);
      });
    });

    it('recordFilterDto의 day에 속한 record만 조회한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', targetAttendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', targetAttendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', targetAttendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const [createdAttendee1, createdAttendee2, createdAttendee3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const record1_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);
      const record1_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee2.id, user_1.id);
      const record3_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee3.id, user_1.id);

      await recordRepository.save([record1_1, record1_2, record1_3, record2_1, record2_2, record2_3, record3_1, record3_2, record3_3]);

      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.day = DayType.WEDNESDAY;

      // When
      const sut = await service.findByAttendanceId(targetAttendanceId, recordFilterDto);

      // Then
      expect(sut.count).toBe(3);
      sut.items.map((result) => {
        expect(result.day).toBe(DayType.WEDNESDAY);
        expect([createdAttendee1.id, createdAttendee2.id, createdAttendee3.id]).toContain(result.attendeeId);
      });
    });

    it('recordFilterDto의 status에 속한 record만 조회한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', targetAttendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', targetAttendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', targetAttendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const [createdAttendee1, createdAttendee2, createdAttendee3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const record1_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);
      const record1_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);
      const record1_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);

      await recordRepository.save([record1_1, record1_2, record1_3, record2_1, record2_2, record2_3, record3_1, record3_2, record3_3]);

      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.status = AttendanceStatus.PRESENT;

      // When
      const sut = await service.findByAttendanceId(targetAttendanceId, recordFilterDto);

      // Then
      expect(sut.count).toBe(3);
      sut.items.map((result) => {
        expect(result.status).toBe(AttendanceStatus.PRESENT);
        expect([createdAttendee1.id, createdAttendee2.id, createdAttendee3.id]).toContain(result.attendeeId);
      });
    });
  });

  describe('FindByAttendanceId Pagination Test', () => {
    it('recordFilterDto의 take 수 만큼만 결과를 가지고 온다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', targetAttendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', targetAttendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', targetAttendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const [createdAttendee1, createdAttendee2, createdAttendee3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const record1_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);
      const record1_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);
      const record1_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);

      await recordRepository.save([record1_1, record1_2, record1_3, record2_1, record2_2, record2_3, record3_1, record3_2, record3_3]);

      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.pageSize = 5;
      recordFilterDto.pageNo = 1;

      // When
      const sut = await service.findByAttendanceId(targetAttendanceId, recordFilterDto);

      // Then
      expect(sut.count).toBe(9);
      expect(sut.items.length).toBe(5);
      sut.items.map((result) => {
        expect([createdAttendee1.id, createdAttendee2.id, createdAttendee3.id]).toContain(result.attendeeId);
      });
    });

    it('recordFilterDto의 skip 수를 제외한 만큼 결과를 가지고 온다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const attendee1 = createSimpleAttendee('attendee_1', targetAttendanceId, 'user id 1');
      const attendee2 = createSimpleAttendee('attendee_2', targetAttendanceId, 'user id 1');
      const attendee3 = createSimpleAttendee('attendee_3', targetAttendanceId, 'user id 1');

      await attendeeRepository.query('DELETE FROM attendee;');
      const [createdAttendee1, createdAttendee2, createdAttendee3] = await attendeeRepository.save([attendee1, attendee2, attendee3]);

      const record1_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);
      const record1_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);
      const record1_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, createdAttendee1.id, user_1.id);
      const record2_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.ABSENT, createdAttendee2.id, user_1.id);
      const record3_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.LATE, createdAttendee3.id, user_1.id);

      await recordRepository.save([record1_1, record1_2, record1_3, record2_1, record2_2, record2_3, record3_1, record3_2, record3_3]);

      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.pageNo = 2;
      recordFilterDto.pageSize = 5;

      // When
      const sut = await service.findByAttendanceId(targetAttendanceId, recordFilterDto);

      // Then
      expect(sut.count).toBe(9);
      expect(sut.items.length).toBe(4);
      sut.items.map((result) => {
        expect([createdAttendee1.id, createdAttendee2.id, createdAttendee3.id]).toContain(result.attendeeId);
      });
    });
  });

  describe('FindByAttendeeId Test', () => {
    it('attendeeId에 속한 전체 record를 조사한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendanceId = 'testAttendanceId';

      const targetAttendeeId = 'Attendee Id 1';

      const attendee_2_id = 'Attendee Id 2';

      const targetRecord_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const record_4 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, attendee_2_id, user_1.id);

      await recordRepository.save([targetRecord_1, targetRecord_2, targetRecord_3, record_4]);

      // When
      const recordFilterDto = new RecordFilterDto();
      const sut = await service.findByAttendeeId(targetAttendeeId, recordFilterDto);

      // Then
      expect(sut.count).toBe(3);
      sut.items.map((record) => {
        expect(record.attendeeId).toBe(targetAttendeeId);
        expect(record.attendee.id).not.toBeNull();
      });
    });

    it('filterDto의 year에 해당하는 record만 조회한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendeeId = 'Attendee Id 1';

      const attendee_2_id = 'Attendee Id 2';

      const targetRecord_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_3 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const record_4 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, attendee_2_id, user_1.id);

      await recordRepository.save([targetRecord_1, targetRecord_2, targetRecord_3, record_4]);

      // When
      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.year = 2024;
      const sut = await service.findByAttendeeId(targetAttendeeId, recordFilterDto);

      // Then
      expect(sut.count).toBe(2);
      sut.items.map((record) => {
        expect(record.date.split('-')[0]).toBe('2024');
      });
    });

    it('filterDto의 year와 month에 해당하는 record만 조회한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendeeId = 'Attendee Id 1';

      const attendee_2_id = 'Attendee Id 2';

      const targetRecord_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_4 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const record_4 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, attendee_2_id, user_1.id);

      await recordRepository.save([targetRecord_1, targetRecord_2, targetRecord_3, targetRecord_4, record_4]);

      // When
      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.year = 2024;
      recordFilterDto.month = 2;

      const sut = await service.findByAttendeeId(targetAttendeeId, recordFilterDto);

      // Then
      expect(sut.count).toBe(2);
      sut.items.map((record) => {
        expect(record.date.substring(0, 7)).toBe('2024-02');
      });
    });

    it('filterDto의 dateFrom 이상에 해당하는 Record를 조회한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendeeId = 'Attendee Id 1';

      const attendee_2_id = 'Attendee Id 2';

      const targetRecord_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_4 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const record_4 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, attendee_2_id, user_1.id);

      await recordRepository.save([targetRecord_1, targetRecord_2, targetRecord_3, targetRecord_4, record_4]);

      // When
      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.dateFrom = '2024-02-01';

      const sut = await service.findByAttendeeId(targetAttendeeId, recordFilterDto);

      // Then
      expect(sut.count).toBe(3);
      sut.items.map((record) => {
        expect(new Date(record.date).getTime()).toBeGreaterThanOrEqual(new Date('2024-02-01').getTime());
      });
    });

    it('filterDto의 dateTo 미만에 해당하는 Record를 조회한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendeeId = 'Attendee Id 1';

      const attendee_2_id = 'Attendee Id 2';

      const targetRecord_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_4 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const record_4 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, attendee_2_id, user_1.id);

      await recordRepository.save([targetRecord_1, targetRecord_2, targetRecord_3, targetRecord_4, record_4]);

      // When
      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.dateTo = '2024-02-02';

      const sut = await service.findByAttendeeId(targetAttendeeId, recordFilterDto);

      // Then
      expect(sut.count).toBe(2);
      sut.items.map((record) => {
        expect(new Date(record.date).getTime()).toBeLessThanOrEqual(new Date('2024-02-02').getTime());
      });
    });

    it('filterDto의 dateFrom 이상 dateFrom 미만에 해당하는 Record를 조회한다.', async () => {
      // Given
      const user_1 = new User();
      user_1.id = 'user id 1';

      const targetAttendeeId = 'Attendee Id 1';

      const attendee_2_id = 'Attendee Id 2';

      const targetRecord_1 = createRecord('2024-01-31', DayType.WEDNESDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_2 = createRecord('2024-02-01', DayType.THURSDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_3 = createRecord('2024-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const targetRecord_4 = createRecord('2024-02-03', DayType.SATURDAY, AttendanceStatus.PRESENT, targetAttendeeId, user_1.id);
      const record_4 = createRecord('2222-02-02', DayType.FRIDAY, AttendanceStatus.PRESENT, attendee_2_id, user_1.id);

      await recordRepository.save([targetRecord_1, targetRecord_2, targetRecord_3, targetRecord_4, record_4]);

      // When
      const recordFilterDto = new RecordFilterDto();
      recordFilterDto.dateFrom = '2024-02-01';
      recordFilterDto.dateTo = '2024-02-03';

      const sut = await service.findByAttendeeId(targetAttendeeId, recordFilterDto);

      // Then
      expect(sut.count).toBe(2);
      sut.items.map((record) => {
        expect(['2024-02-01', '2024-02-02']).toContain(record.date);
      });
    });
  });

  describe('deleteAll TEST', () => {
    it('배열에 입력한 모든 출석기록을 soft delete 한다.', async () => {
      // Given
      const attendance = new Attendance();
      attendance.id = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = attendance.id;

      const record_1 = createRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.ABSENT, attendee_1.id, user_1.id);
      const record_2 = createRecord('2024-01-16', DayType.MONDAY, AttendanceStatus.ABSENT, attendee_1.id, user_1.id);

      const createdRecord_1 = await recordRepository.save(record_1);
      const createdRecord_2 = await recordRepository.save(record_2);

      const deleteDto = new DeleteRecordDto();
      deleteDto.ids = [createdRecord_1.id, createdRecord_2.id];
      deleteDto.attendanceId = 'testAttendanceId';

      // When
      await service.deleteAll(deleteDto);

      const sut = await recordRepository.findBy({
        id: In(deleteDto.ids),
      });

      // Then
      expect(sut).toHaveLength(0);
    });

    it('Attendance에 속하지 않은 Record를 삭제하면 에러를 발생시킨다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      const user_1 = new User();
      user_1.id = 'user id 1';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = targetAttendanceId;

      const attendee_2 = new Attendee();
      attendee_2.id = 'Attendee Id 2';
      attendee_2.attendanceId = 'notTestAttendanceId';

      const record_1 = createRecord('2024-01-15', DayType.MONDAY, AttendanceStatus.ABSENT, attendee_1.id, user_1.id);
      const record_2 = createRecord('2024-01-16', DayType.MONDAY, AttendanceStatus.ABSENT, attendee_2.id, user_1.id);

      const createdRecord_1 = await recordRepository.save(record_1);
      const createdRecord_2 = await recordRepository.save(record_2);

      const deleteDto = new DeleteRecordDto();
      deleteDto.ids = [createdRecord_1.id, createdRecord_2.id];
      deleteDto.attendanceId = targetAttendanceId;

      // When / Then
      expect(async () => {
        await service.deleteAll(deleteDto);
      }).rejects.toThrowError();
    });
  });

  async function setupTest() {
    await recordRepository.query('DELETE FROM record;');
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);

    const user_1 = new User();
    user_1.id = 'user id 1';
    user_1.username = 'test id';
    user_1.password = 'testPWD';
    user_1.mobileNumber = '010-8098-1398';
    user_1.name = 'test name';
    user_1.createId = 'user id';

    await userRepository.save(user_1);

    const attendance_1 = new Attendance();
    attendance_1.id = 'testAttendanceId';
    attendance_1.title = 'testAttendanceTitle';
    attendance_1.description = 'description';
    attendance_1.availableFrom = '1200';
    attendance_1.availableTo = '2000';
    attendance_1.createId = 'user id 1';
    attendance_1.createdAt = new Date();

    const attendance_2 = new Attendance();
    attendance_2.id = 'notTestAttendanceId';
    attendance_2.title = 'testAttendanceTitle2';
    attendance_2.description = 'description';
    attendance_2.availableFrom = '1200';
    attendance_2.availableTo = '2000';
    attendance_2.createId = 'user id 1';
    attendance_2.createdAt = new Date();

    await attendanceRepository.save(attendance_1);
    await attendanceRepository.save(attendance_2);

    const attendee_1 = new Attendee();
    attendee_1.id = 'Attendee Id 1';
    attendee_1.name = 'Attendee Name 1';
    attendee_1.attendanceId = attendance_1.id;
    attendee_1.gender = Gender.MALE;
    attendee_1.description = 'Attendee 1 description';
    attendee_1.createId = user_1.id;

    const attendee_2 = new Attendee();
    attendee_2.id = 'Attendee Id 2';
    attendee_2.name = 'Attendee Name 2';
    attendee_2.gender = Gender.FEMALE;
    attendee_2.attendanceId = attendance_2.id;
    attendee_2.description = 'Attendee 2 description';
    attendee_2.createId = user_1.id;

    await attendeeRepository.save(attendee_1);
    await attendeeRepository.save(attendee_2);
  }

  async function clear() {
    await recordRepository.query('DELETE FROM record;');
    await scheduleRepository.query('DELETE FROM schedule;');
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);
  }
});

function createSingleRecord(date: YyMmDd, day: DayType, status: AttendanceStatus, time: HhMm, attendeeId: string) {
  const singleRecord = new SingleRecord();
  singleRecord.date = date;
  singleRecord.day = day;
  singleRecord.status = status;
  singleRecord.time = time;
  singleRecord.attendeeId = attendeeId;
  return singleRecord;
}

function createRecordDto(date: YyMmDd, day: DayType, status: AttendanceStatus, time: HhMm, attendeeId: string) {
  const singleRecord = createSingleRecord(date, day, status, time, attendeeId);

  const recordDto = new CreateRecordDto();
  recordDto.singleRecords = [singleRecord];

  return recordDto;
}

function createRecord(date: YyMmDd, day: DayType, status: AttendanceStatus, attendeeId, userId) {
  const record = new Record();
  record.date = date;
  record.day = day;
  record.status = status;
  record.attendeeId = attendeeId;
  record.createId = userId;
  return record;
}

function createSchedule(attendeeId: string, day: DayType, time: string) {
  const schedule = new Schedule();
  schedule.attendeeId = attendeeId;
  schedule.day = day;
  schedule.time = time;
  schedule.createId = 'user id 1';
  return schedule;
}
