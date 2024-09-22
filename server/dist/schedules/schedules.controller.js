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
exports.SchedulesController = void 0;
const common_1 = require("@nestjs/common");
const schedules_service_1 = require("./schedules.service");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const user_decorator_1 = require("../common/decorator/user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const schedule_filter_dto_1 = require("./dto/schedule-filter.dto");
const delete_schedule_dto_1 = require("./dto/delete-schedule.dto");
const common_response_dto_1 = require("../common/response/common-response.dto");
const responseWithoutPagination_dto_1 = require("../common/response/responseWithoutPagination.dto");
let SchedulesController = class SchedulesController {
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
    }
    create(createScheduleDto, user) {
        return this.schedulesService.create(createScheduleDto, user);
    }
    findByAttendeeId(attendeeId) {
        return this.schedulesService.findByAttendeeId(attendeeId);
    }
    findByAttendanceId(attendanceId, scheduleFilterDto) {
        return this.schedulesService.findAllByAttendanceId(attendanceId, scheduleFilterDto);
    }
    findScheduleByAttendanceIdAndDate(attendanceId, dateString, scheduleFilterDto) {
        return this.schedulesService.findScheduleByAttendanceIdAndDate(attendanceId, dateString, scheduleFilterDto);
    }
    deleteAll(deleteScheduleDto) {
        return this.schedulesService.deleteAll(deleteScheduleDto);
    }
};
exports.SchedulesController = SchedulesController;
__decorate([
    (0, common_1.Post)('/schedules'),
    (0, swagger_1.ApiOperation)({ summary: '출석 스케쥴 생성 / 수정 (이전 스케쥴 삭제)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석 스케쥴 생성',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, swagger_1.ApiBody)({
        type: create_schedule_dto_1.CreateScheduleDto,
        description: '출석 스케쥴 생성 DTO',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/attendee/:attendeeId/schedules'),
    (0, swagger_1.ApiOperation)({ summary: '출석대상의 스케쥴 조회' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석대상의 스케쥴 조회',
        type: (responseWithoutPagination_dto_1.ResponseWithoutPaginationDto),
    }),
    __param(0, (0, common_1.Param)('attendeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "findByAttendeeId", null);
__decorate([
    (0, common_1.Get)('/attendanceId/:attendanceId/schedules'),
    (0, swagger_1.ApiOperation)({ summary: '출석부에 속한 모든 스케쥴 조회' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석부에 속한 모든 스케쥴 조회',
        type: (responseWithoutPagination_dto_1.ResponseWithoutPaginationDto),
    }),
    __param(0, (0, common_1.Param)('attendanceId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_filter_dto_1.ScheduleFilterDto]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "findByAttendanceId", null);
__decorate([
    (0, common_1.Get)('/attendanceId/:attendanceId/schedules/:date'),
    (0, swagger_1.ApiOperation)({ summary: '해당 출석부의 오늘의 스케쥴과 출석내역 조회' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '해당 출석부의 오늘의 스케쥴과 출석내역 조회',
        type: (responseWithoutPagination_dto_1.ResponseWithoutPaginationDto),
    }),
    __param(0, (0, common_1.Param)('attendanceId')),
    __param(1, (0, common_1.Param)('date')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, schedule_filter_dto_1.ScheduleFilterDto]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "findScheduleByAttendanceIdAndDate", null);
__decorate([
    (0, common_1.Delete)('/schedules'),
    (0, swagger_1.ApiOperation)({ summary: '스케쥴 일괄 삭제' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '스케쥴 일괄 삭제',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_schedule_dto_1.DeleteScheduleDto]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "deleteAll", null);
exports.SchedulesController = SchedulesController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiTags)('출석 스케쥴'),
    (0, swagger_1.ApiBearerAuth)('token'),
    __metadata("design:paramtypes", [schedules_service_1.SchedulesService])
], SchedulesController);
//# sourceMappingURL=schedules.controller.js.map