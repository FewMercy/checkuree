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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateScheduleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const schedule_entity_1 = require("../entities/schedule.entity");
const single_schedule_class_1 = require("../const/single-schedule.class");
const class_transformer_1 = require("class-transformer");
class CreateScheduleDto {
    toEntities(createId) {
        const schedules = [];
        this.singleSchedules.forEach((singleSchedule) => {
            const schedule = new schedule_entity_1.Schedule();
            schedule.attendeeId = this.attendeeId;
            schedule.day = singleSchedule.day;
            schedule.time = singleSchedule.time;
            schedule.createId = createId;
            schedules.push(schedule);
        });
        return schedules;
    }
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: '출석부 PK',
        type: 'string',
        example: 'uuid-1234-uuid',
    }),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "attendanceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: '출석 대상 ID',
        type: 'string',
        example: 'uuid-1234-uuid',
    }),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "attendeeId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => single_schedule_class_1.SingleSchedule),
    (0, swagger_1.ApiProperty)({ description: '출석 요일과 시간', type: Array.of(single_schedule_class_1.SingleSchedule) }),
    __metadata("design:type", Array)
], CreateScheduleDto.prototype, "singleSchedules", void 0);
//# sourceMappingURL=create-schedule.dto.js.map