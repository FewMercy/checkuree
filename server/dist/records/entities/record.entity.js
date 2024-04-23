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
exports.Record = void 0;
const BaseTimeEntity_1 = require("../../common/BaseTimeEntity");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const record_type_enum_1 = require("../const/record-type.enum");
const day_type_enum_1 = require("../../schedules/const/day-type.enum");
const attendee_entity_1 = require("../../attendees/entities/attendee.entity");
const late_time_type_enum_1 = require("../const/late-time-type.enum");
const absence_type_enum_1 = require("../const/absence-type.enum");
let Record = class Record extends BaseTimeEntity_1.BaseTimeEntity {
};
exports.Record = Record;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { comment: '출석 기록 PK', type: 'int' }),
    (0, swagger_1.ApiProperty)({ description: '출석 기록 PK', type: 'int' }),
    __metadata("design:type", Number)
], Record.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 대상 ID', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석 대상 ID', type: 'string' }),
    __metadata("design:type", String)
], Record.prototype, "attendeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 상태', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({
        description: '출석 상태',
        type: 'enum',
        enum: record_type_enum_1.AttendanceStatus,
    }),
    __metadata("design:type", String)
], Record.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 날짜', type: 'varchar' }),
    (0, swagger_1.ApiProperty)({ description: '출석 날짜', type: 'string' }),
    __metadata("design:type", String)
], Record.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '출석 요일', type: 'enum', enum: day_type_enum_1.DayType }),
    (0, swagger_1.ApiProperty)({
        description: '출석 요일',
        type: 'enum',
        enum: day_type_enum_1.DayType,
    }),
    __metadata("design:type", String)
], Record.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '비고', type: 'varchar', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '비고', type: 'string', nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "etc", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '지각 시간', type: 'varchar', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: '지각 시간', type: 'string', nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "lateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '결석 종류', type: 'varchar', nullable: true, default: null }),
    (0, swagger_1.ApiProperty)({ description: '결석 종류', type: 'string', nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "absenceType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attendee_entity_1.Attendee, (attendee) => attendee.records),
    (0, typeorm_1.JoinColumn)({ name: 'attendeeId', referencedColumnName: 'id' }),
    (0, swagger_1.ApiProperty)({ type: () => attendee_entity_1.Attendee }),
    __metadata("design:type", attendee_entity_1.Attendee)
], Record.prototype, "attendee", void 0);
exports.Record = Record = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['attendeeId', 'date'])
], Record);
//# sourceMappingURL=record.entity.js.map