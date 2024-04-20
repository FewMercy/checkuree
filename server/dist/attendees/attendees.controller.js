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
exports.AttendeesController = void 0;
const common_1 = require("@nestjs/common");
const attendees_service_1 = require("./attendees.service");
const create_attendee_dto_1 = require("./dto/create-attendee.dto");
const update_attendee_dto_1 = require("./dto/update-attendee.dto");
const user_decorator_1 = require("../common/decorator/user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const role_guard_1 = require("../roles/role.guard");
const role_decorator_1 = require("../roles/role.decorator");
const role_type_enum_1 = require("../roles/entities/role-type.enum");
const delete_attendee_dto_1 = require("./dto/delete-attendee.dto");
const common_response_dto_1 = require("../common/response/common-response.dto");
const responseWithoutPagination_dto_1 = require("../common/response/responseWithoutPagination.dto");
let AttendeesController = class AttendeesController {
    constructor(attendeesService) {
        this.attendeesService = attendeesService;
    }
    async create(createAttendeeDto, user) {
        return this.attendeesService.createAttendee(createAttendeeDto, user);
    }
    async findAllByAttendanceId(attendanceId) {
        return this.attendeesService.findAllByAttendanceId(attendanceId);
    }
    async findOne(id) {
        return this.attendeesService.findOneById(id);
    }
    async update(id, updateAttendeeDto) {
        return this.attendeesService.update(id, updateAttendeeDto);
    }
    delete(deleteAttendeeDto) {
        return this.attendeesService.deleteAll(deleteAttendeeDto);
    }
};
exports.AttendeesController = AttendeesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '출석 대상 생성' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석 대상 생성',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, swagger_1.ApiBody)({
        type: create_attendee_dto_1.CreateAttendeeDto,
        description: '출석 대상 생성 DTO',
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER, role_type_enum_1.RoleType.GENERAL),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendee_dto_1.CreateAttendeeDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AttendeesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('attendanceId/:attendanceId'),
    (0, swagger_1.ApiOperation)({ summary: '로그인한 회원의 출석부 출석 대상 조회' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '해당 출석부의 출석 대상 조회',
        type: (responseWithoutPagination_dto_1.ResponseWithoutPaginationDto),
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.GENERAL, role_type_enum_1.RoleType.MANAGER, role_type_enum_1.RoleType.READER),
    __param(0, (0, common_1.Param)('attendanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendeesController.prototype, "findAllByAttendanceId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '출석 대상 상세 조회' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석 대상 상세 조회',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '출석대상 수정' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석대상 수정',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER, role_type_enum_1.RoleType.GENERAL),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attendee_dto_1.UpdateAttendeeDto]),
    __metadata("design:returntype", Promise)
], AttendeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: '출석대상 일괄 삭제' }),
    (0, swagger_1.ApiBody)({
        type: delete_attendee_dto_1.DeleteAttendeeDto,
        description: '출석대상 삭제 DTO',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: '출석대상 일괄 삭제',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER, role_type_enum_1.RoleType.GENERAL),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_attendee_dto_1.DeleteAttendeeDto]),
    __metadata("design:returntype", Promise)
], AttendeesController.prototype, "delete", null);
exports.AttendeesController = AttendeesController = __decorate([
    (0, common_1.Controller)('attendees'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiTags)('출석 대상'),
    (0, swagger_1.ApiBearerAuth)('token'),
    __metadata("design:paramtypes", [attendees_service_1.AttendeesService])
], AttendeesController);
//# sourceMappingURL=attendees.controller.js.map