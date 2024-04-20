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
exports.CreateRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const record_entity_1 = require("../entities/record.entity");
const singleRecord_class_1 = require("../const/singleRecord.class");
const class_transformer_1 = require("class-transformer");
class CreateRecordDto {
    toEntities(createId) {
        return this.singleRecords.map((singleRecord) => {
            const record = new record_entity_1.Record();
            record.status = singleRecord.status;
            record.date = singleRecord.date;
            record.day = singleRecord.day;
            record.etc = singleRecord?.etc;
            record.lateTime = singleRecord?.lateTime;
            record.absenceType = singleRecord?.absenceType;
            record.attendeeId = singleRecord.attendeeId;
            record.createId = createId;
            record.createdAt = new Date();
            return record;
        });
    }
}
exports.CreateRecordDto = CreateRecordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: '출석부 PK',
        type: 'string',
        example: 'uuid-1234-uuid',
    }),
    __metadata("design:type", String)
], CreateRecordDto.prototype, "attendanceId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => singleRecord_class_1.SingleRecord),
    (0, swagger_1.ApiProperty)({ description: '출석 기록', type: Array.of(singleRecord_class_1.SingleRecord) }),
    __metadata("design:type", Array)
], CreateRecordDto.prototype, "singleRecords", void 0);
//# sourceMappingURL=create-record.dto.js.map