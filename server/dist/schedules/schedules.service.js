"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_entity_1 = require("./entities/schedule.entity");
const typeorm_2 = require("typeorm");
const day_type_enum_1 = require("./const/day-type.enum");
const common_response_dto_1 = require("../common/response/common-response.dto");
const responseWithoutPagination_dto_1 = require("../common/response/responseWithoutPagination.dto");
const pageResponse_dto_1 = require("../common/response/pageResponse.dto");
const time_grouped_schedule_res_dto_1 = require("./const/time-grouped-schedule-res.dto");
let SchedulesService = class SchedulesService {
    constructor(scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
        this.convertDayToDayType = (dayNumber) => {
            const days = [
                day_type_enum_1.DayType.SUNDAY,
                day_type_enum_1.DayType.MONDAY,
                day_type_enum_1.DayType.TUESDAY,
                day_type_enum_1.DayType.WEDNESDAY,
                day_type_enum_1.DayType.THURSDAY,
                day_type_enum_1.DayType.FRIDAY,
                day_type_enum_1.DayType.SATURDAY,
            ];
            return days[dayNumber % 7];
        };
        this.isValideDateFormat = (dateString) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(dateString)) {
                return false;
            }
            const date = new Date(dateString);
            if (!date) {
                return false;
            }
            return true;
        };
    }
    async create(createScheduleDto, user) {
        await this.scheduleRepository.softDelete({
            attendeeId: createScheduleDto.attendeeId,
        });
        const schedules = createScheduleDto.toEntities(user.id);
        if (!schedules.some((schedule) => this.verifyAttendTime(schedule.time))) {
            throw new common_1.BadRequestException('유효하지 않은 시간 포맷입니다.');
        }
        const createdResponse = await this.scheduleRepository.save(schedules);
        return new common_response_dto_1.CommonResponseDto('SUCCESS CREATE SCHEDULES', { ids: createdResponse.map((schedule) => schedule.id) });
    }
    async findByAttendeeId(attendeeId) {
        const [items, count] = await this.scheduleRepository.findAndCountBy({
            attendeeId,
        });
        return new responseWithoutPagination_dto_1.ResponseWithoutPaginationDto(count, items);
    }
    async findAllByAttendanceId(attendanceId, scheduleFilterDto) {
        const [items, count] = await this.scheduleRepository.findAndCount({
            relations: {
                attendee: true,
            },
            select: {
                attendee: {
                    attendanceId: true,
                },
            },
            where: {
                attendee: {
                    attendanceId: attendanceId,
                },
            },
            skip: scheduleFilterDto.getOffset(),
            take: scheduleFilterDto.getLimit(),
            order: {
                time: 'ASC',
            },
        });
        return new pageResponse_dto_1.PageResponseDto(scheduleFilterDto.pageSize, count, items);
    }
    async findScheduleByAttendanceIdAndDate(attendanceId, dateString, scheduleFilterDto) {
        if (!this.isValideDateFormat(dateString)) {
            throw new common_1.BadRequestException('날짜 형식이 올바르지 않습니다.');
        }
        const date = new Date(dateString);
        const dayType = this.convertDayToDayType(date.getDay());
        const queryBuilder = this.scheduleRepository
            .createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.attendee', 'attendee')
            .leftJoinAndSelect('attendee.records', 'records', 'records.date = :date AND schedule.time = records.time', { date: dateString })
            .where('attendee.attendanceId = :attendanceId', { attendanceId })
            .andWhere('schedule.day = :day', { day: dayType })
            .skip(scheduleFilterDto.getOffset())
            .take(scheduleFilterDto.getLimit())
            .orderBy('schedule.time', 'ASC');
        const [items, count] = await queryBuilder.getManyAndCount();
        const groupedByTimeResult = new time_grouped_schedule_res_dto_1.TimeGroupedScheduleResDto(items);
        return new pageResponse_dto_1.PageResponseDto(scheduleFilterDto.pageSize, count, [groupedByTimeResult]);
    }
    async deleteAll(deleteScheduleDto) {
        await this.scheduleRepository.softDelete({
            id: (0, typeorm_2.In)(deleteScheduleDto.ids),
        });
        return new common_response_dto_1.CommonResponseDto('SUCCESS DELETE SCHEDULES');
    }
    verifyAttendTime(time) {
        const timeStringLength = 4;
        if (time.length !== timeStringLength) {
            return false;
        }
        const hour = time.slice(0, 2);
        const minute = time.slice(2);
        return !(parseInt(hour) >= 24 || parseInt(minute) >= 60);
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map