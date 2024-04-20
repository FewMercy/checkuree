import { AttendanceStatus } from '../const/record-type.enum';
import { DayType } from '../../schedules/const/day-type.enum';
import { Pagination } from '../../common/response/pagination';
export declare class RecordFilterDto extends Pagination {
    status: AttendanceStatus;
    date: string;
    day: DayType;
    year: number;
    month: number;
    dateFrom: string;
    dateTo: string;
}
