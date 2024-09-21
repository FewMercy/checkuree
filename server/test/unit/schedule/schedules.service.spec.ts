import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from '../../../src/schedules/schedules.service';
import { TestModule } from '../../../src/test.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { User } from '../../../src/users/entities/user.entity';
import { Attendance } from '../../../src/attendances/entities/attendance.entity';
import { Schedule } from '../../../src/schedules/entities/schedule.entity';
import { DayType } from '../../../src/schedules/const/day-type.enum';
import { CreateScheduleDto } from '../../../src/schedules/dto/create-schedule.dto';
import { BadRequestException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { DeleteScheduleDto } from '../../../src/schedules/dto/delete-schedule.dto';
import { Record } from '../../../src/records/entities/record.entity';
import { AttendanceStatus } from '../../../src/records/const/record-type.enum';
import { createAttendee } from '../attendee/createAttendee';
import { SingleSchedule } from '../../../src/schedules/const/single-schedule.class';
import { ScheduleFilterDto } from '../../../src/schedules/dto/schedule-filter.dto';
import { Gender } from '../../../src/attendees/const/gender.enum';

describe('SchedulesService', () => {
  let module: TestingModule;
  let service: SchedulesService;
  let scheduleRepository: Repository<Schedule>;
  let recordRepository: Repository<Record>;
  let attendeeRepository: Repository<Attendee>;
  let attendanceRepository: Repository<Attendance>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Schedule])],
      providers: [SchedulesService],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
    scheduleRepository = module.get(getRepositoryToken(Schedule));
    recordRepository = module.get(getRepositoryToken(Record));
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

  describe('Create Schedules Test', () => {
    it('요청 성공시 success,message,ids를 리턴한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const scheduleDto = createSingleScheduleDto('Attendee Id 1', DayType.MONDAY, '1000');

      // When
      const sut = await service.create(scheduleDto, user);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS CREATE SCHEDULES');
      expect(sut.data.ids).toBeDefined();
    });

    it('선택한 요일과 시간으로 출석 대상의 스케쥴을 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const scheduleDto = createSingleScheduleDto('Attendee Id 1', DayType.MONDAY, '1000');

      // When
      const createdResponse = await service.create(scheduleDto, user);

      const sut = await scheduleRepository.findBy({ id: In(createdResponse.data.ids) });

      // Then
      sut.map((schedule) => {
        expect(schedule).toMatchObject({
          attendeeId: 'Attendee Id 1',
          day: 'MON',
          time: '1000',
        });
      });
    });

    it('입력 받은 SingleSchedule[]의 스케쥴을 생성한다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const singleSchedule_1 = new SingleSchedule();
      singleSchedule_1.day = DayType.TUESDAY;
      singleSchedule_1.time = '1800';

      const singleSchedule_2 = new SingleSchedule();
      singleSchedule_2.day = DayType.WEDNESDAY;
      singleSchedule_2.time = '1900';

      const scheduleDto = createSingleScheduleDto('Attendee Id 1', DayType.MONDAY, '1000');
      scheduleDto.singleSchedules = [singleSchedule_1, singleSchedule_2];

      // When
      const createdResponse = await service.create(scheduleDto, user);

      const sut = await scheduleRepository.findBy({ id: In(createdResponse.data.ids) });

      // Then
      expect(sut).toHaveLength(2);
      expect(sut.some((schedule) => schedule.day === DayType.TUESDAY && schedule.time === '1800')).toBeTruthy();
      expect(sut.some((schedule) => schedule.day === DayType.WEDNESDAY && schedule.time === '1900')).toBeTruthy();
    });

    it('입력한 시간이 0000~2400 범위에 있지 않으면 오류를 일으킨다.', async () => {
      // Given
      const user = new User();
      user.id = 'user id 1';

      const scheduleDto = createSingleScheduleDto('Attendee Id 1', DayType.MONDAY, '4500');

      // Then
      await expect(async () => {
        await service.create(scheduleDto, user);
      }).rejects.toThrowError(new BadRequestException('유효하지 않은 시간 포맷입니다.'));
    });
  });

  describe('findByAttendeeId Test.', () => {
    it('출석 대상의 모든 스케쥴을 조사한다.', async () => {
      // Given
      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
      const schedule_2 = createSchedule('Attendee Id 1', DayType.TUESDAY, '1330');

      const schedule_3 = createSchedule('Attendee Id 2', DayType.TUESDAY, '1330');

      await scheduleRepository.insert(schedule_1);
      await scheduleRepository.insert(schedule_2);
      await scheduleRepository.insert(schedule_3);

      // When
      const sut = await service.findByAttendeeId(attendee_1.id);

      // Then
      expect(sut.count).toBe(2);
      sut.items.map((result) => {
        expect(result.attendeeId).toBe('Attendee Id 1');
      });
    });

    it('스케쥴이 없는 경우 빈 배열을 리턴한다.', async () => {
      // Given
      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';

      // When
      const sut = await service.findByAttendeeId(attendee_1.id);

      // Then
      expect(sut.count).toBe(0);
      expect(sut.items).toBeInstanceOf(Array);
    });
  });

  describe('findAllByAttendanceId Test', () => {
    it('출석부에 속한 모든 출석대상의 스케쥴을 리턴한다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = targetAttendanceId;

      const attendee_2 = new Attendee();
      attendee_2.id = 'Attendee Id 2';
      attendee_2.attendanceId = 'notTestAttendanceId';

      const attendee_3 = new Attendee();
      attendee_3.id = 'Attendee Id 3';
      attendee_3.attendanceId = targetAttendanceId;

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
      const schedule_2 = createSchedule('Attendee Id 2', DayType.TUESDAY, '1330');
      const schedule_3 = createSchedule('Attendee Id 3', DayType.WEDNESDAY, '1430');
      await scheduleRepository.insert([schedule_1, schedule_2, schedule_3]);

      // When
      const sut = await service.findAllByAttendanceId(targetAttendanceId, ScheduleFilterDto.of());

      // Then
      expect(sut.count).toBe(2);
      sut.items.map((schedule) => {
        expect(schedule.attendee.attendanceId).toBe(targetAttendanceId);
      });
    });
  });

  describe('findScheduleByAttendanceIdAndDate', () => {
    it('스케쥴의 time 으로 grouped 된 schedule 과 record 를 리턴한다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = targetAttendanceId;

      const attendee_2 = new Attendee();
      attendee_2.id = 'Attendee Id 2';
      attendee_2.attendanceId = 'notTestAttendanceId';

      const attendee_3 = new Attendee();
      attendee_3.id = 'Attendee Id 3';
      attendee_3.attendanceId = targetAttendanceId;

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
      const schedule_2 = createSchedule('Attendee Id 2', DayType.TUESDAY, '1330');
      const schedule_3 = createSchedule('Attendee Id 3', DayType.WEDNESDAY, '1430');
      await scheduleRepository.insert([schedule_1, schedule_2, schedule_3]);

      const record_1 = new Record();
      record_1.attendeeId = attendee_1.id;
      record_1.status = AttendanceStatus.PRESENT;
      record_1.date = '2024-02-05';
      record_1.time = '1230';
      record_1.day = DayType.MONDAY;
      record_1.createId = 'user id 1';

      const record_2 = new Record();
      record_2.attendeeId = attendee_1.id;
      record_2.status = AttendanceStatus.PRESENT;
      record_2.date = '2024-02-06';
      record_2.time = '1330';
      record_2.day = DayType.TUESDAY;
      record_2.createId = 'user id 1';

      await recordRepository.insert([record_1, record_2]);

      // When
      // 2024-02-05는 월요일
      const sut = await service.findScheduleByAttendanceIdAndDate(targetAttendanceId, '2024-02-05', ScheduleFilterDto.of());

      // Then
      expect(sut.count).toBe(1);
      // 2024-02-05는 월요일 : 1230 schedule 만 포함되어야 함
      expect(Object.keys(sut.items[0])).toMatchObject(['1230']);
    });

    it('출석부에 스케쥴 중 조회날짜의 요일과의 스케줄과 조회 날짜의 record를 리턴한다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';
      attendee_1.attendanceId = targetAttendanceId;

      const attendee_2 = new Attendee();
      attendee_2.id = 'Attendee Id 2';
      attendee_2.attendanceId = 'notTestAttendanceId';

      const attendee_3 = new Attendee();
      attendee_3.id = 'Attendee Id 3';
      attendee_3.attendanceId = targetAttendanceId;

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
      const schedule_2 = createSchedule('Attendee Id 2', DayType.TUESDAY, '1330');
      const schedule_3 = createSchedule('Attendee Id 3', DayType.WEDNESDAY, '1430');
      await scheduleRepository.insert([schedule_1, schedule_2, schedule_3]);

      const record_1 = new Record();
      record_1.attendeeId = attendee_1.id;
      record_1.status = AttendanceStatus.PRESENT;
      record_1.date = '2024-02-05';
      record_1.time = '1230';
      record_1.day = DayType.MONDAY;
      record_1.createId = 'user id 1';

      const record_2 = new Record();
      record_2.attendeeId = attendee_1.id;
      record_2.status = AttendanceStatus.PRESENT;
      record_2.date = '2024-02-06';
      record_2.time = '1230';
      record_2.day = DayType.TUESDAY;
      record_2.createId = 'user id 1';

      await recordRepository.insert([record_1, record_2]);

      // When
      // 2024-02-05는 월요일
      const sut = await service.findScheduleByAttendanceIdAndDate(targetAttendanceId, '2024-02-05', ScheduleFilterDto.of());

      // Then
      expect(sut.count).toBe(1);
      sut.items[0]['1230'].map((schedule) => {
        expect(schedule.attendee.attendanceId).toBe(targetAttendanceId);
        expect(schedule.day).toBe(DayType.MONDAY);
        expect(schedule?.attendee.records).toBeDefined();
        expect(schedule?.attendee.records.length).toBeLessThanOrEqual(1);
      });
    });

    it('해당 요일의 스케쥴을 시간오름차순으로 정렬한다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      await attendeeRepository.query('DELETE FROM attendee;');

      const attendee_1 = createAttendee('name_1', targetAttendanceId, 'description', 'user id 1');
      attendee_1.id = 'Attendee Id 1';

      const attendee_2 = createAttendee('name_2', targetAttendanceId, 'description', 'user id 1');
      attendee_2.id = 'Attendee Id 2';

      const attendee_3 = createAttendee('name_3', targetAttendanceId, 'description', 'user id 1');
      attendee_3.id = 'Attendee Id 3';

      const attendee_4 = createAttendee('name_4', targetAttendanceId, 'description', 'user id 1');
      attendee_4.id = 'Attendee Id 4';

      const attendee_5 = createAttendee('name_5', targetAttendanceId, 'description', 'user id 1');
      attendee_5.id = 'Attendee Id 5';

      await attendeeRepository.save([attendee_1, attendee_2, attendee_3, attendee_4, attendee_5]);

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1330');
      const schedule_2 = createSchedule('Attendee Id 2', DayType.MONDAY, '1300');
      const schedule_3 = createSchedule('Attendee Id 3', DayType.MONDAY, '1200');
      const schedule_4 = createSchedule('Attendee Id 4', DayType.MONDAY, '1700');
      const schedule_5 = createSchedule('Attendee Id 5', DayType.MONDAY, '1000');
      await scheduleRepository.insert([schedule_1, schedule_2, schedule_3, schedule_4, schedule_5]);

      // When
      const sut = await service.findScheduleByAttendanceIdAndDate(targetAttendanceId, '2024-02-05', ScheduleFilterDto.of());

      // Then
      expect(sut.count).toBe(5);
      const isOrderedByTimeAscend = sut.items.every((schedule, index, array) => {
        if (index === 0) return true;
        return schedule.time >= array[index - 1].time;
      });

      expect(isOrderedByTimeAscend).toBeTruthy();
    });

    it('시간이 같은 경우 이름 오름차순으로 정렬한다.', async () => {
      // Given
      const targetAttendanceId = 'testAttendanceId';

      await attendeeRepository.query('DELETE FROM attendee;');

      const attendee_1 = createAttendee('name_1', targetAttendanceId, 'description', 'user id 1');
      attendee_1.id = 'Attendee Id 1';

      const attendee_2 = createAttendee('name_2', targetAttendanceId, 'description', 'user id 1');
      attendee_2.id = 'Attendee Id 2';

      const attendee_3 = createAttendee('name_3', targetAttendanceId, 'description', 'user id 1');
      attendee_3.id = 'Attendee Id 3';

      const attendee_4 = createAttendee('name_4', targetAttendanceId, 'description', 'user id 1');
      attendee_4.id = 'Attendee Id 4';

      const attendee_5 = createAttendee('name_5', targetAttendanceId, 'description', 'user id 1');
      attendee_5.id = 'Attendee Id 5';

      await attendeeRepository.save([attendee_1, attendee_2, attendee_3, attendee_4, attendee_5]);

      const schedule_1 = createSchedule('Attendee Id 3', DayType.MONDAY, '2220');
      const schedule_2 = createSchedule('Attendee Id 2', DayType.MONDAY, '2220');
      const schedule_3 = createSchedule('Attendee Id 4', DayType.MONDAY, '2220');
      const schedule_4 = createSchedule('Attendee Id 5', DayType.MONDAY, '2220');
      const schedule_5 = createSchedule('Attendee Id 1', DayType.MONDAY, '2220');
      await scheduleRepository.insert([schedule_1, schedule_2, schedule_3, schedule_4, schedule_5]);

      // When
      const sut = await service.findScheduleByAttendanceIdAndDate(targetAttendanceId, '2024-02-05', ScheduleFilterDto.of());

      // Then
      expect(sut.count).toBe(5);
      const isOrderedByTimeAscend = sut.items[0]['2220'].every((schedule, index, array) => {
        if (index === 0) return true;
        return schedule.time >= array[index - 1].time && schedule.attendee.name >= array[index - 1].attendee.name;
      });

      expect(isOrderedByTimeAscend).toBeTruthy();
    });
  });

  describe('deleteAll TEST', () => {
    it('배열에 입력한 모든 스케쥴을 soft delete 한다.', async () => {
      // Given
      const attendee_1 = new Attendee();
      attendee_1.id = 'Attendee Id 1';

      const schedule_1 = createSchedule('Attendee Id 1', DayType.MONDAY, '1230');
      const schedule_2 = createSchedule('Attendee Id 1', DayType.TUESDAY, '1330');

      const createdAttendee_1 = await attendeeRepository.save(attendee_1);

      const createdSchedule_1 = await scheduleRepository.save(schedule_1);
      const createdSchedule_2 = await scheduleRepository.save(schedule_2);

      // When
      const deleteDto = new DeleteScheduleDto();
      deleteDto.ids = [schedule_2.id, schedule_2.id];

      await service.deleteAll(deleteDto);

      const sut = await attendeeRepository.findBy({
        id: In(deleteDto.ids),
      });

      // Then
      expect(sut).toHaveLength(0);
    });
  });

  async function setupTest() {
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
    attendance_1.availableTo = '1800';
    attendance_1.createId = 'user id 1';
    attendance_1.createdAt = new Date();

    const attendance_2 = new Attendance();
    attendance_2.id = 'notTestAttendanceId';
    attendance_2.title = 'testAttendanceTitle2';
    attendance_2.description = 'description';
    attendance_2.availableFrom = '1200';
    attendance_2.availableTo = '1800';
    attendance_2.createId = 'user id 1';
    attendance_2.createdAt = new Date();

    await attendanceRepository.save([attendance_1, attendance_2]);

    const attendee_1 = new Attendee();
    attendee_1.id = 'Attendee Id 1';
    attendee_1.name = 'Attendee Name 1';
    attendee_1.gender = Gender.MALE;
    attendee_1.attendanceId = attendance_1.id;
    attendee_1.description = 'Attendee 1 description';
    attendee_1.createId = user_1.id;

    const attendee_2 = new Attendee();
    attendee_2.id = 'Attendee Id 2';
    attendee_2.name = 'Attendee Name 2';
    attendee_2.gender = Gender.MALE;
    attendee_2.attendanceId = attendance_2.id;
    attendee_2.description = 'Attendee 2 description';
    attendee_2.createId = user_1.id;

    const attendee_3 = new Attendee();
    attendee_3.id = 'Attendee Id 3';
    attendee_3.name = 'Attendee Name 2';
    attendee_3.gender = Gender.MALE;
    attendee_3.attendanceId = attendance_1.id;
    attendee_3.description = 'Attendee 2 description';
    attendee_3.createId = user_1.id;

    // await attendeeRepository.save
    await attendeeRepository.save([attendee_1, attendee_2, attendee_3]);
  }

  async function clear() {
    await recordRepository.query('DELETE FROM record;');
    await scheduleRepository.query('DELETE FROM schedule;');
    await attendeeRepository.query('DELETE FROM attendee;');
    await attendanceRepository.query('DELETE FROM attendance;');
    await userRepository.query(`DELETE FROM user;`);
  }
});

function createSingleScheduleDto(attendeeId: string, day: DayType, time: string) {
  const createScheduleDto = new CreateScheduleDto();
  createScheduleDto.attendeeId = attendeeId;

  const singleSchedule = new SingleSchedule();
  singleSchedule.day = day;
  singleSchedule.time = time;

  createScheduleDto.singleSchedules = [singleSchedule];

  return createScheduleDto;
}

function createSchedule(attendeeId: string, day: DayType, time: string) {
  const schedule = new Schedule();
  schedule.attendeeId = attendeeId;
  schedule.day = day;
  schedule.time = time;
  schedule.createId = 'user id 1';
  return schedule;
}
