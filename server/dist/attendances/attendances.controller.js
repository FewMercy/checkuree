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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendancesController = void 0;
const common_1 = require("@nestjs/common");
const attendances_service_1 = require("./attendances.service");
const create_attendance_dto_1 = require("./dto/create-attendance.dto");
const update_attendance_dto_1 = require("./dto/update-attendance.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../users/entities/user.entity");
const user_decorator_1 = require("../common/decorator/user.decorator");
const role_guard_1 = require("../roles/role.guard");
const role_type_enum_1 = require("../roles/entities/role-type.enum");
const role_decorator_1 = require("../roles/role.decorator");
const common_response_dto_1 = require("../common/response/common-response.dto");
const responseWithoutPagination_dto_1 = require("../common/response/responseWithoutPagination.dto");
const platform_express_1 = require("@nestjs/platform-express");
const image_validator_pipe_1 = require("../file-manager/const/image-validator.pipe");
const file_const_1 = require("../file-manager/const/file.const");
let AttendancesController = class AttendancesController {
    constructor(attendancesService) {
        this.attendancesService = attendancesService;
    }
    createAttendance(createAttendanceDto, user, image) {
        return this.attendancesService.create(createAttendanceDto, user, image);
    }
    findAllByUserId(user) {
        return this.attendancesService.findAllByUserId(user.id);
    }
    findOneById(attendanceId) {
        return this.attendancesService.findOneById(attendanceId);
    }
    update(attendanceId, updateAttendanceDto, image) {
        return this.attendancesService.update(attendanceId, updateAttendanceDto, image);
    }
    delete(attendanceId, user) {
        return this.attendancesService.delete(attendanceId, user.id);
    }
};
exports.AttendancesController = AttendancesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: '출석부 생성' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '출석부 생성',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, swagger_1.ApiBody)({
        type: create_attendance_dto_1.CreateAttendanceDto,
        description: '출석부 생성 DTO',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __param(2, (0, common_1.UploadedFile)((0, image_validator_pipe_1.ImageValidatorPipe)(file_const_1.PROFILE_IMAGE_MAX_SIZE_IN_MB))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_dto_1.CreateAttendanceDto,
        user_entity_1.User, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "createAttendance", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '로그인한 회원의 출석부 목록 조회' }),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: '로그인한 회원의 출석부 목록 조회',
        type: (responseWithoutPagination_dto_1.ResponseWithoutPaginationDto),
    }),
    __param(0, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "findAllByUserId", null);
__decorate([
    (0, common_1.Get)(':attendanceId'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER, role_type_enum_1.RoleType.GENERAL, role_type_enum_1.RoleType.READER),
    (0, swagger_1.ApiOperation)({ summary: '출석부 상세 조회' }),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: '출석부 정보 수정',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    __param(0, (0, common_1.Param)('attendanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Patch)(':attendanceId'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: '출석부 정보 수정' }),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: '출석부 정보 수정',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER, role_type_enum_1.RoleType.MANAGER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('attendanceId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)((0, image_validator_pipe_1.ImageValidatorPipe)(file_const_1.PROFILE_IMAGE_MAX_SIZE_IN_MB))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attendance_dto_1.UpdateAttendanceDto, typeof (_d = typeof Express !== "undefined" && (_c = Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':attendanceId'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(role_type_enum_1.RoleType.MASTER),
    (0, swagger_1.ApiOperation)({ summary: '출석부 삭제' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: '삭제 후 No Content 값 전달',
        type: (common_response_dto_1.CommonResponseDto),
    }),
    __param(0, (0, common_1.Param)('attendanceId')),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AttendancesController.prototype, "delete", null);
exports.AttendancesController = AttendancesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('attendances'),
    (0, swagger_1.ApiTags)('출석부'),
    (0, swagger_1.ApiBearerAuth)('token'),
    __metadata("design:paramtypes", [attendances_service_1.AttendancesService])
], AttendancesController);
//# sourceMappingURL=attendances.controller.js.map