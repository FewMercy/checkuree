"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const orm_config_1 = require("./common/const/orm.config");
const user_entity_1 = require("./users/entities/user.entity");
const attendance_entity_1 = require("./attendances/entities/attendance.entity");
const attendances_module_1 = require("./attendances/attendances.module");
const user_attendance_entity_1 = require("./attendances/entities/user-attendance.entity");
const attendees_module_1 = require("./attendees/attendees.module");
const schedules_module_1 = require("./schedules/schedules.module");
const schedule_entity_1 = require("./schedules/entities/schedule.entity");
const records_module_1 = require("./records/records.module");
const record_entity_1 = require("./records/entities/record.entity");
const config_1 = require("@nestjs/config");
const invitations_module_1 = require("./invitations/invitations.module");
const invitation_entity_1 = require("./invitations/entities/invitation.entity");
const login_history_entity_1 = require("./auth/entity/login-history.entity");
const file_manager_module_1 = require("./file-manager/file-manager.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                ...(0, orm_config_1.getOrmConfig)(),
                entities: [user_entity_1.User, attendance_entity_1.Attendance, user_attendance_entity_1.UserAttendance, schedule_entity_1.Schedule, record_entity_1.Record, invitation_entity_1.Invitation, login_history_entity_1.LoginHistory],
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            attendances_module_1.AttendancesModule,
            attendees_module_1.AttendeesModule,
            schedules_module_1.SchedulesModule,
            records_module_1.RecordsModule,
            invitations_module_1.InvitationsModule,
            file_manager_module_1.FileManagerModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map