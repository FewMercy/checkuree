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
exports.RecordsService = void 0;
const common_1 = require("@nestjs/common");
const record_entity_1 = require("./entities/record.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const record_type_enum_1 = require("./const/record-type.enum");
const numberToDayString_1 = require("./const/numberToDayString");
const excel_service_1 = require("../common/excel.service");
const pageResponse_dto_1 = require("../common/response/pageResponse.dto");
const responseWithoutPagination_dto_1 = require("../common/response/responseWithoutPagination.dto");
const common_response_dto_1 = require("../common/response/common-response.dto");
let RecordsService = class RecordsService {
    constructor(recordRepository, excelService) {
        this.recordRepository = recordRepository;
        this.excelService = excelService;
    }
    async create(createRecordDto, user) {
        const records = createRecordDto.toEntities(user.id);
        records.forEach((record) => {
            const realDay = numberToDayString_1.NumberToDayString[new Date(record.date).getDay()];
            if (record.day !== realDay.toUpperCase()) {
                throw new common_1.BadRequestException('요일이 정확하지 않습니다.');
            }
            if (record.status !== record_type_enum_1.AttendanceStatus.ABSENT) {
                delete record.absenceType;
            }
            if (record.status !== record_type_enum_1.AttendanceStatus.LATE) {
                delete record.lateTime;
            }
        });
        const uniqueRecords = this.removeDuplicateRecords(records);
        const result = await this.recordRepository.upsert(uniqueRecords, {
            conflictPaths: ['attendeeId', 'date'],
            upsertType: 'on-conflict-do-update',
        });
        return new common_response_dto_1.CommonResponseDto('SUCCESS CREATE RECORD', {
            ids: result.identifiers.map((identifier) => identifier.id),
        });
    }
    async createAll(createAllRecordDto, user) {
        const result = await this.recordRepository.query(`
    INSERT INTO record (attendeeId,status,date,day,createId)
    SELECT atd.id,?,?,?,?
    FROM attendee as atd
    LEFT JOIN record r ON r.attendeeId = atd.id AND r.date = ?
    LEFT JOIN schedule s ON s.attendeeId = atd.id AND s.day = ?
    WHERE atd.attendanceId = ? AND atd.deletedAt IS NULL AND r.id IS NULL AND s.id IS NOT NULL;`, [
            createAllRecordDto.status,
            createAllRecordDto.date,
            createAllRecordDto.day,
            user.id,
            createAllRecordDto.date,
            createAllRecordDto.day,
            createAllRecordDto.attendanceId,
        ]);
        return new common_response_dto_1.CommonResponseDto('SUCCESS CREATE ALL RECORDS', { affectedRows: result.affectedRows });
    }
    async findOneById(id) {
        return new common_response_dto_1.CommonResponseDto('SUCCESS FIND RECORD', await this.recordRepository.findOneBy({ id }));
    }
    async getRecordSummaryByAttendanceId(attendanceId, date) {
        if (!this.isValidDate(date)) {
            throw new common_1.BadRequestException('날짜 형식이 올바르지 않습니다.');
        }
        const summary = await this.recordRepository
            .createQueryBuilder('record')
            .select('record.status', 'status')
            .addSelect('COUNT(record.id)', 'count')
            .innerJoin('record.attendee', 'attendee', 'attendee.attendanceId = :attendanceId', {
            attendanceId: attendanceId,
        })
            .groupBy('record.status')
            .getRawMany();
        let presentCount = 0, absenceCount = 0, lateCount = 0;
        summary.forEach((record) => {
            switch (record.status) {
                case 'PRESENT':
                    presentCount = parseInt(record.count);
                    break;
                case 'ABSENT':
                    absenceCount = parseInt(record.count);
                    break;
                case 'LATE':
                    lateCount = parseInt(record.count);
                    break;
            }
        });
        const result = {
            date: date,
            presentCount,
            absenceCount,
            lateCount,
        };
        return result;
    }
    async getRecordSummaryByAttendeeId(attendanceId, attendeeRecordSummaryDto) {
        const qb = this.recordRepository
            .createQueryBuilder('record')
            .innerJoin('record.attendee', 'attendee', 'attendee.attendanceId = :attendanceId', {
            attendanceId,
        })
            .select('attendee.id', 'attendeeId')
            .addSelect('record.status', 'status')
            .addSelect('COUNT(record.id)', 'count')
            .where('attendee.id IN (:...attendeeIds)', { attendeeIds: attendeeRecordSummaryDto.attendeeIds })
            .groupBy('attendee.id,record.status');
        const summary = await qb.getRawMany();
        const results = [];
        attendeeRecordSummaryDto.attendeeIds.forEach((attendeeId) => {
            results.push({
                attendeeId: attendeeId,
                presentCount: 0,
                absenceCount: 0,
                lateCount: 0,
            });
        });
        console.log(summary);
        summary.forEach((record) => {
            const result = results.find((result) => result.attendeeId === record.attendeeId);
            const status = (record.status + '').toUpperCase();
            console.log(status);
            switch (status) {
                case 'PRESENT':
                    result.presentCount = parseInt(record.count);
                    break;
                case 'ABSENT':
                    result.absenceCount = parseInt(record.count);
                    break;
                case 'LATE':
                    result.lateCount = parseInt(record.count);
                    break;
            }
            console.log(result);
        });
        return results;
    }
    async findByAttendanceId(attendanceId, recordFilterDto) {
        const queryBuilder = this.recordRepository
            .createQueryBuilder('record')
            .innerJoinAndSelect('record.attendee', 'attendee', 'attendee.attendanceId = :attendanceId', {
            attendanceId: attendanceId,
        });
        if (recordFilterDto.date) {
            queryBuilder.andWhere({ date: recordFilterDto.date });
        }
        if (recordFilterDto.day) {
            queryBuilder.andWhere({ day: recordFilterDto.day });
        }
        if (recordFilterDto.status) {
            queryBuilder.andWhere({ status: recordFilterDto.status });
        }
        if (recordFilterDto.pageNo && recordFilterDto.pageSize) {
            queryBuilder.take(recordFilterDto.getLimit());
            queryBuilder.skip(recordFilterDto.getOffset());
        }
        const [items, count] = await queryBuilder.getManyAndCount();
        return new pageResponse_dto_1.PageResponseDto(recordFilterDto.pageSize, count, items);
    }
    async findByAttendeeId(attendeeId, recordFilterDto) {
        const queryBuilder = this.recordRepository
            .createQueryBuilder('record')
            .innerJoinAndSelect('record.attendee', 'attendee', 'attendee.id=:attendeeId', {
            attendeeId: attendeeId,
        });
        if (recordFilterDto.year && recordFilterDto.month) {
            const month = recordFilterDto.month < 10 ? '0' + recordFilterDto.month : recordFilterDto.month;
            queryBuilder.andWhere({ date: (0, typeorm_2.Like)(`${recordFilterDto.year}-${month}-%`) });
        }
        else if (recordFilterDto.year) {
            queryBuilder.andWhere({ date: (0, typeorm_2.Like)(`${recordFilterDto.year}-%`) });
        }
        if (recordFilterDto.dateFrom) {
            queryBuilder.andWhere('record.date >= :dateFrom', { dateFrom: recordFilterDto.dateFrom });
        }
        if (recordFilterDto.dateTo) {
            queryBuilder.andWhere('record.date < :dateTo', { dateTo: recordFilterDto.dateTo });
        }
        const result = await queryBuilder.getManyAndCount();
        return new responseWithoutPagination_dto_1.ResponseWithoutPaginationDto(result[1], result[0]);
    }
    async deleteAll(deleteRecordDto) {
        const found = await this.recordRepository.find({
            where: {
                attendee: { attendanceId: deleteRecordDto.attendanceId },
                id: (0, typeorm_2.In)(deleteRecordDto.ids),
            },
        });
        const filteredRecord = found.filter((record) => {
            return deleteRecordDto.ids.includes(record.id);
        });
        if (filteredRecord.length !== deleteRecordDto.ids.length) {
            throw new common_1.BadRequestException(`AttendanceId : ${deleteRecordDto.attendanceId} 에 속한 기록만 삭제할 수 있습니다..`);
        }
        await this.recordRepository.softDelete({
            id: (0, typeorm_2.In)(deleteRecordDto.ids),
        });
        return new common_response_dto_1.CommonResponseDto('SUCCESS DELETE RECORDS');
    }
    async excelDownload(attendanceId, recordFilterDto) {
        const rawData = await this.findByAttendanceIdForExcel(attendanceId, recordFilterDto);
        const dataToDbMapper = {};
        dataToDbMapper['attendee_name'] = '회원이름';
        dataToDbMapper['attendee_age'] = '나이';
        dataToDbMapper['record_day'] = '요일';
        dataToDbMapper['record_date'] = '날짜';
        dataToDbMapper['record_status'] = '출석상태';
        const excelBuffer = this.excelService.exportDataToExcel(rawData, dataToDbMapper);
        return excelBuffer;
    }
    async attendeeRecordExcelDownload(attendeeId, recordFilterDto) {
        const rawData = await this.findByAttendeeIdForExcel(attendeeId, recordFilterDto);
        const dataToDbMapper = {};
        dataToDbMapper['attendee_name'] = '회원이름';
        dataToDbMapper['attendee_age'] = '나이';
        dataToDbMapper['record_day'] = '요일';
        dataToDbMapper['record_date'] = '날짜';
        dataToDbMapper['record_status'] = '출석상태';
        const excelBuffer = this.excelService.exportDataToExcel(rawData, dataToDbMapper);
        return excelBuffer;
    }
    async findByAttendeeIdForExcel(attendeeId, recordFilterDto) {
        let queryBuilder;
        queryBuilder = this.recordRepository
            .createQueryBuilder('record')
            .innerJoinAndSelect('record.attendee', 'attendee', 'attendee.id=:attendeeId', {
            attendeeId: attendeeId,
        });
        if (recordFilterDto.year && recordFilterDto.month) {
            const month = recordFilterDto.month < 10 ? '0' + recordFilterDto.month : recordFilterDto.month;
            queryBuilder.andWhere({ date: (0, typeorm_2.Like)(`${recordFilterDto.year}-${month}-%`) });
        }
        else if (recordFilterDto.year) {
            queryBuilder.andWhere({ date: (0, typeorm_2.Like)(`${recordFilterDto.year}-%`) });
        }
        if (recordFilterDto.dateFrom) {
            queryBuilder.andWhere('record.date >= :dateFrom', { dateFrom: recordFilterDto.dateFrom });
        }
        if (recordFilterDto.dateTo) {
            queryBuilder.andWhere('record.date < :dateTo', { dateTo: recordFilterDto.dateTo });
        }
        return queryBuilder.getRawMany();
    }
    async findByAttendanceIdForExcel(attendanceId, recordFilterDto) {
        let queryBuilder;
        queryBuilder = this.recordRepository
            .createQueryBuilder('record')
            .innerJoinAndSelect('record.attendee', 'attendee', 'attendee.attendanceId = :attendanceId', {
            attendanceId: attendanceId,
        })
            .select('record')
            .addSelect('attendee.name')
            .addSelect('attendee.age');
        if (recordFilterDto.date) {
            queryBuilder.andWhere({ date: recordFilterDto.date });
        }
        if (recordFilterDto.day) {
            queryBuilder.andWhere({ day: recordFilterDto.day });
        }
        if (recordFilterDto.status) {
            queryBuilder.andWhere({ status: recordFilterDto.status });
        }
        queryBuilder.orderBy('attendee_name', 'ASC');
        return queryBuilder.getRawMany();
    }
    removeDuplicateRecords(records) {
        const uniqueRecordsMap = new Map();
        records.forEach((record) => {
            const key = `${record.attendeeId}-${record.date}`;
            uniqueRecordsMap.set(key, record);
        });
        return Array.from(uniqueRecordsMap.values());
    }
    isValidDate(date) {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        return datePattern.test(date);
    }
};
exports.RecordsService = RecordsService;
exports.RecordsService = RecordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(record_entity_1.Record)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        excel_service_1.ExcelService])
], RecordsService);
//# sourceMappingURL=records.service.js.map