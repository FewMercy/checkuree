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
exports.Schedule = void 0;
const typeorm_1 = require("typeorm");
const BaseTimeEntity_1 = require("../../common/BaseTimeEntity");
const swagger_1 = require("@nestjs/swagger");
const attendee_entity_1 = require("../../attendees/entities/attendee.entity");
const day_type_enum_1 = require("../const/day-type.enum");
let Schedule = class Schedule extends BaseTimeEntity_1.BaseTimeEntity {
};
exports.Schedule = Schedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    (0, swagger_1.ApiProperty)({ description: '출석대상의 출석 스케쥴' }),
    __metadata("design:type", Number)
], Schedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 대상 ID', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석 대상 ID', type: 'string' }),
    __metadata("design:type", String)
], Schedule.prototype, "attendeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 요일', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석 요일', type: 'enum', enum: day_type_enum_1.DayType }),
    __metadata("design:type", String)
], Schedule.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 시간', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석 시간', type: 'string' }),
    __metadata("design:type", String)
], Schedule.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attendee_entity_1.Attendee, (attendee) => attendee.schedules),
    (0, typeorm_1.JoinColumn)({ name: 'attendeeId', referencedColumnName: 'id' }),
    (0, swagger_1.ApiProperty)({ type: () => attendee_entity_1.Attendee }),
    __metadata("design:type", attendee_entity_1.Attendee)
], Schedule.prototype, "attendee", void 0);
exports.Schedule = Schedule = __decorate([
    (0, typeorm_1.Entity)()
], Schedule);
//# sourceMappingURL=schedule.entity.js.map