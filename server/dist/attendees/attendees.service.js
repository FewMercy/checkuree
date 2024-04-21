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
exports.AttendeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attendee_entity_1 = require("./entities/attendee.entity");
const typeorm_2 = require("typeorm");
const common_response_dto_1 = require("../common/response/common-response.dto");
const responseWithoutPagination_dto_1 = require("../common/response/responseWithoutPagination.dto");
const grade_enum_1 = require("./grade.enum");
const gender_enum_1 = require("./gender.enum");
let AttendeesService = class AttendeesService {
    constructor(attendeeRepository) {
        this.attendeeRepository = attendeeRepository;
    }
    async createAttendee(createAttendeeDto, user) {
        const attendee = createAttendeeDto.toEntity();
        this.validateGender(attendee.gender);
        if (attendee.grade) {
            this.validateGrade(attendee.grade);
        }
        attendee.createId = user.id;
        const createdAttendee = await this.attendeeRepository.save(attendee);
        return new common_response_dto_1.CommonResponseDto('SUCCESS CREATE ATTENDEE', { id: createdAttendee.id });
    }
    async findAllByAttendanceId(attendanceId) {
        const [items, count] = await this.attendeeRepository.findAndCount({
            where: { attendanceId: attendanceId },
        });
        return new responseWithoutPagination_dto_1.ResponseWithoutPaginationDto(count, items);
    }
    async findOneById(id) {
        return new common_response_dto_1.CommonResponseDto('SUCCESS FIND ATTENDEE', await this.attendeeRepository.findOneBy({ id }));
    }
    async update(id, updateAttendeeDto) {
        if (updateAttendeeDto.gender) {
            this.validateGender(updateAttendeeDto.gender);
        }
        if (updateAttendeeDto.grade) {
            this.validateGrade(updateAttendeeDto.grade);
        }
        await this.attendeeRepository.update({ id, attendanceId: updateAttendeeDto.attendanceId }, updateAttendeeDto);
        return new common_response_dto_1.CommonResponseDto('SUCCESS UPDATE ATTENDEE', { id: id });
    }
    async deleteAll(deleteAttendeeDto) {
        const found = await this.attendeeRepository.count({
            where: {
                id: (0, typeorm_2.In)(deleteAttendeeDto.ids),
                attendanceId: deleteAttendeeDto.attendanceId,
            },
        });
        if (found !== deleteAttendeeDto.ids.length) {
            throw new common_1.BadRequestException('Attendance에 속한 Attendee만 삭제할 수 있습니다.');
        }
        await this.attendeeRepository.softDelete({
            id: (0, typeorm_2.In)(deleteAttendeeDto.ids),
            attendanceId: deleteAttendeeDto.attendanceId,
        });
        return new common_response_dto_1.CommonResponseDto('SUCCESS DELETE ATTENDEES');
    }
    validateGender(gender) {
        if (gender && !Object.values(gender_enum_1.Gender).includes(gender)) {
            throw new common_1.BadRequestException('성별이 올바르지 않습니다.');
        }
    }
    validateGrade(grade) {
        if (grade && !Object.values(grade_enum_1.AttendeeGrade).includes(grade)) {
            throw new common_1.BadRequestException('학년이 올바르지 않습니다.');
        }
    }
};
exports.AttendeesService = AttendeesService;
exports.AttendeesService = AttendeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendee_entity_1.Attendee)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttendeesService);
//# sourceMappingURL=attendees.service.js.map