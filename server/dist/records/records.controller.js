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
exports.RecordsController = void 0;
const common_1 = require("@nestjs/common");
const records_service_1 = require("./records.service");
const create_record_dto_1 = require("./dto/create-record.dto");
const user_entity_1 = require("../users/entities/user.entity");
const user_decorator_1 = require("../common/decorator/user.decorator");
const swagger_1 = require("@nestjs/swagger");
const role_guard_1 = require("../roles/role.guard");
const role_decorator_1 = require("../roles/role.decorator");
const role_type_enum_1 = require("../roles/const/role-type.enum");
const passport_1 = require("@nestjs/passport");
const delete_record_dto_1 = require("./dto/delete-record.dto");
const createAll_record_dto_1 = require("./dto/createAll-record.dto");
const record_filter_dto_1 = require("./dto/record-filter.dto");
const pageResponse_dto_1 = require("../common/response/pageResponse.dto");
const responseWithoutPagination_dto_1 = require("../common/response/responseWithoutPagination.dto");
const common_response_dto_1 = require("../common/response/common-response.dto");
const date_record_summary_response_dto_1 = require("./dto/date-record-summary-response.dto");
const attendee_record_summary_dto_1 = require("./dto/attendee-record-summary.dto");
let RecordsController = class RecordsController {
    constructor(recordsService) {
        this.recordsService = recordsService;
    }
    async createRecord(createRecordDto, user) {
        return this.recordsService.create(createRecordDto, user);
    }
    async createAllRecord(createAllRecordDto, user) {
        return this.recordsService.createAll(createAllRecordDto, user);
    }
    findOne(id) {
        return this.recordsService.findOneById(+id);
    }
    async findByAttendeeId(attendeeId, recordFilterDto) {
        return this.recordsService.findByAttendeeId(attendeeId, recordFilterDto);
    }
    async getRecordSummaryByAttendeeId(attendanceId, attendeeRecordSummaryDto) {
        return this.recordsService.getRecordSummaryByAttendeeId(attendanceId, attendeeRecordSummaryDto);
    }
    async getRecordSummaryByAttendanceId(attendanceId, date) {
        return this.recordsService.getRecordSummaryByAttendanceId(attendanceId, date);
    }
    async findByAttendanceId(attendanceId, recordFilterDto) {
        return this.recordsService.findByAttendanceId(attendanceId, recordFilterDto);
    }
    async downloadAttendanceRecordExcel(res, attendanceId, recordFilterDto) {
        const buffer = await this.recordsService.excelDownload(attendanceId, recordFilterDto);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="Members.xlsx"',
        });
        res.end(buffer);
    }
    async downloadAttendeeRecordExcel(res, attendeeId, recordFilterDto) {
        const buffer = await this.recordsService.attendeeRecordExcelDownload(attendeeId, recordFilterDto);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="Members.xlsx"',
        });
        res.end(buffer);
    }
    deleteAll(deleteRecordDto) {
        return this.recordsService.deleteAll(deleteRecordDto);
    }
};
exports.RecordsController = RecordsController;
__decorate([
    (0, common_1.Post)('/records'),
    (0, swagger_1.ApiOperation)({
        description: '출석기록 생성 및 수정',
        summary: '출석기록 생성 및 수정',
    }),
    (0, swagger_1.ApiBody)({
        type: create_record_dto_1.CreateRecordDto,
        description: '출석기록 생성 DTO',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석기록 생성',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER, role_type_enum_1.RoleType.GENERAL),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_record_dto_1.CreateRecordDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "createRecord", null);
__decorate([
    (0, common_1.Post)('records/date'),
    (0, swagger_1.ApiOperation)({
        description: '선택한 날짜의 출석기록 일괄 생성',
        summary: '선택한 날짜의 출석기록 일괄 생성',
    }),
    (0, swagger_1.ApiBody)({
        type: createAll_record_dto_1.CreateAllRecordDto,
        description: '출석기록 일괄 생성 DTO',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석 기록 일괄 생성 후 affected Raws',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER, role_type_enum_1.RoleType.GENERAL),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createAll_record_dto_1.CreateAllRecordDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "createAllRecord", null);
__decorate([
    (0, common_1.Get)('records/:id'),
    (0, swagger_1.ApiOperation)({
        description: '출석기록 ID로 조회',
        summary: '출석기록 ID로 조회',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석기록 ID로 조회',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('attendee/:attendeeId/records'),
    (0, swagger_1.ApiOperation)({
        description: '출석대상에 속한 출석기록 조회',
        summary: '출석대상에 속한 출석기록 조회',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석대상에 속한 출석기록 조회',
        type: (responseWithoutPagination_dto_1.ResponseWithoutPaginationDto),
    }),
    __param(0, (0, common_1.Param)('attendeeId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, record_filter_dto_1.RecordFilterDto]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "findByAttendeeId", null);
__decorate([
    (0, common_1.Get)('attendance/:attendanceId/attendees/records/summary'),
    (0, swagger_1.ApiOperation)({
        description: '출석부에 속한 출석대상의 전체 기간 출석기록 요약',
        summary: '출석부에 속한 출석대상의 전체 기간 출석기록 요약',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석부에 속한 출석대상의 전체 기간 출석기록 요약',
        type: (pageResponse_dto_1.PageResponseDto),
    }),
    __param(0, (0, common_1.Param)('attendanceId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendee_record_summary_dto_1.AttendeeRecordSummaryDto]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "getRecordSummaryByAttendeeId", null);
__decorate([
    (0, common_1.Get)('attendance/:attendanceId/records/:date/summary'),
    (0, swagger_1.ApiOperation)({
        description: '선택한 날짜의 전체 출석기록 요약 조회',
        summary: '선택한 날짜의 전체 출석기록 요약 조회',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '선택한 날짜의 전체 출석기록 요약 조회',
        type: date_record_summary_response_dto_1.DateRecordSummaryResponseDto,
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER, role_type_enum_1.RoleType.GENERAL),
    __param(0, (0, common_1.Param)('attendanceId')),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "getRecordSummaryByAttendanceId", null);
__decorate([
    (0, common_1.Get)('attendance/:attendanceId/records'),
    (0, swagger_1.ApiOperation)({
        description: '출석부에 속한 출석기록 조회',
        summary: '출석부에 속한 출석기록 조회',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석부에 속한 출석기록 조회',
        type: (pageResponse_dto_1.PageResponseDto),
    }),
    __param(0, (0, common_1.Param)('attendanceId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, record_filter_dto_1.RecordFilterDto]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "findByAttendanceId", null);
__decorate([
    (0, common_1.Get)('attendance/:attendanceId/records/excel'),
    (0, swagger_1.ApiOperation)({
        description: '출석부에 속한 출석기록 엑셀 다운로드',
        summary: '출석부에 속한 출석기록 엑셀 다운로드',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석부에 속한 출석기록 엑셀 다운로드',
    }),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Param)('attendanceId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, record_filter_dto_1.RecordFilterDto]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "downloadAttendanceRecordExcel", null);
__decorate([
    (0, common_1.Get)('attendee/:attendeeId/records/excel'),
    (0, swagger_1.ApiOperation)({
        description: '출석대상에 속한 출석기록 엑셀 다운로드',
        summary: '출석대상에 속한 출석기록 엑셀 다운로드',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석대상에 속한 출석기록 엑셀 다운로드',
    }),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Param)('attendeeId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, record_filter_dto_1.RecordFilterDto]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "downloadAttendeeRecordExcel", null);
__decorate([
    (0, common_1.Delete)('/records'),
    (0, swagger_1.ApiOperation)({ summary: '출석기록 일괄 삭제' }),
    (0, swagger_1.ApiBody)({
        type: delete_record_dto_1.DeleteRecordDto,
        description: '출석기록 삭제 DTO',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: '출석기록 일괄 삭제',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_record_dto_1.DeleteRecordDto]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "deleteAll", null);
exports.RecordsController = RecordsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('출석기록'),
    (0, swagger_1.ApiBearerAuth)('token'),
    __metadata("design:paramtypes", [records_service_1.RecordsService])
], RecordsController);
//# sourceMappingURL=records.controller.js.map