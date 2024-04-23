"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendancesModule = void 0;
const common_1 = require("@nestjs/common");
const attendances_service_1 = require("./attendances.service");
const attendances_controller_1 = require("./attendances.controller");
const typeorm_1 = require("@nestjs/typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const user_attendance_entity_1 = require("./entities/user-attendance.entity");
const attendance_day_entity_1 = require("./entities/attendance-day.entity");
const file_manager_service_1 = require("../file-manager/file-manager.service");
const s3_service_1 = require("../file-manager/s3.service");
const image_processor_service_1 = require("../file-manager/image-processor.service");
let AttendancesModule = class AttendancesModule {
};
exports.AttendancesModule = AttendancesModule;
exports.AttendancesModule = AttendancesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([attendance_entity_1.Attendance, user_attendance_entity_1.UserAttendance, attendance_day_entity_1.AttendanceDay])],
        controllers: [attendances_controller_1.AttendancesController],
        providers: [attendances_service_1.AttendancesService, file_manager_service_1.FileManagerService, s3_service_1.S3Service, image_processor_service_1.ImageProcessorService],
    })
], AttendancesModule);
//# sourceMappingURL=attendances.module.js.map