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
exports.AttendancesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const typeorm_2 = require("@nestjs/typeorm");
const user_attendance_entity_1 = require("./entities/user-attendance.entity");
const role_type_enum_1 = require("../roles/const/role-type.enum");
const responseWithoutPagination_dto_1 = require("../common/response/responseWithoutPagination.dto");
const common_response_dto_1 = require("../common/response/common-response.dto");
const attendance_day_entity_1 = require("./entities/attendance-day.entity");
const file_manager_service_1 = require("../file-manager/file-manager.service");
const day_type_enum_1 = require("../schedules/const/day-type.enum");
let AttendancesService = class AttendancesService {
    constructor(attendanceRepository, userAttendanceRepository, attendanceDayRepository, fileManagerService) {
        this.attendanceRepository = attendanceRepository;
        this.userAttendanceRepository = userAttendanceRepository;
        this.attendanceDayRepository = attendanceDayRepository;
        this.fileManagerService = fileManagerService;
    }
    async create(createAttendanceDto, user, image) {
        const attendanceDays = this.convertToAttendanceDays(createAttendanceDto.attendanceDays);
        if (!this.isValidDays(attendanceDays)) {
            throw new common_1.BadRequestException('출석부 요일이 올바르지 않습니다.');
        }
        const attendance = createAttendanceDto.toEntity();
        attendance.createId = user.id;
        if (image) {
            const imageUrl = await this.fileManagerService.saveImgFile(image);
            attendance.imageUrl = imageUrl;
        }
        const createdAttendance = await this.attendanceRepository.save(attendance);
        const userAttendance = new user_attendance_entity_1.UserAttendance();
        userAttendance.attendanceId = createdAttendance.id;
        userAttendance.userId = user.id;
        userAttendance.role = role_type_enum_1.RoleType.MASTER;
        userAttendance.createId = user.id;
        await this.userAttendanceRepository.save(userAttendance);
        await this.attendanceDayRepository.save(attendanceDays.map((day) => {
            return {
                attendanceId: createdAttendance.id,
                day: day,
            };
        }));
        return new common_response_dto_1.CommonResponseDto('SUCCESS CREATE ATTENDANCE', { id: createdAttendance.id });
    }
    async findAllByUserId(userId) {
        const [items, count] = await this.userAttendanceRepository
            .createQueryBuilder('userAttendance')
            .innerJoinAndSelect('userAttendance.attendance', 'attendance', 'attendance.deletedAt IS NULL')
            .leftJoinAndSelect('attendance.attendanceDays', 'attendanceDays')
            .loadRelationCountAndMap('attendance.attendeeCount', 'attendance.attendees')
            .where('userAttendance.userId = :userId', { userId })
            .getManyAndCount();
        items.forEach((item) => {
            item.attendance.days = item.attendance.attendanceDays.map((day) => day.day);
        });
        return new responseWithoutPagination_dto_1.ResponseWithoutPaginationDto(count, items);
    }
    async findOneById(id) {
        const attendance = await this.attendanceRepository.findOne({
            relations: {
                attendanceDays: true,
            },
            where: {
                id,
            },
        });
        attendance.days = attendance.attendanceDays.map((day) => day.day);
        return new common_response_dto_1.CommonResponseDto('SUCCESS FIND ATTENDANCE', attendance);
    }
    async update(id, updateAttendanceDto, image) {
        const attendance = await this.attendanceRepository.findOneBy({ id });
        if (!attendance) {
            throw new common_1.BadRequestException('존재하지 않는 출석부입니다.');
        }
        Object.assign(attendance, updateAttendanceDto);
        attendance.allowLateness = !!+updateAttendanceDto.allowLateness ?? attendance.allowLateness;
        const attendanceDays = this.convertToAttendanceDays(updateAttendanceDto?.attendanceDays);
        if (!this.isValidDays(attendanceDays)) {
            throw new common_1.BadRequestException('출석부 요일이 올바르지 않습니다.');
        }
        if (image) {
            const imageUrl = await this.fileManagerService.saveImgFile(image);
            attendance.imageUrl = imageUrl;
        }
        delete attendance.attendanceDays;
        await this.attendanceRepository.update(id, attendance);
        if (attendanceDays.length > 0) {
            await this.attendanceDayRepository.delete({ attendanceId: id });
            await this.attendanceDayRepository.save(attendanceDays.map((day) => {
                return {
                    attendanceId: id,
                    day: day,
                };
            }));
        }
        return new common_response_dto_1.CommonResponseDto('SUCCESS UPDATE ATTENDANCE');
    }
    async delete(attendanceId, userId) {
        await this.attendanceRepository.softDelete(attendanceId);
        await this.userAttendanceRepository.softDelete({ attendanceId, userId });
        return new common_response_dto_1.CommonResponseDto('SUCCESS DELETE ATTENDANCE');
    }
    convertToAttendanceDays(daysString) {
        if (!daysString) {
            return [];
        }
        const arrayAttendanceDays = daysString.split(',').map((day) => {
            return day.trim();
        });
        return arrayAttendanceDays;
    }
    isValidDays(days) {
        return days.every((day) => Object.values(day_type_enum_1.DayType).includes(day));
    }
};
exports.AttendancesService = AttendancesService;
exports.AttendancesService = AttendancesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_2.InjectRepository)(user_attendance_entity_1.UserAttendance)),
    __param(2, (0, typeorm_2.InjectRepository)(attendance_day_entity_1.AttendanceDay)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        file_manager_service_1.FileManagerService])
], AttendancesService);
//# sourceMappingURL=attendances.service.js.map