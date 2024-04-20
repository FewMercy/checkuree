import { DayType } from '../../schedules/const/day-type.enum';
import { Record } from '../entities/record.entity';
import { AttendanceStatus } from '../const/record-type.enum';
export declare class CreateAllRecordDto {
    attendanceId: string;
    status: AttendanceStatus;
    date: string;
    day: DayType;
    toEntity(createId: string): Record;
}
