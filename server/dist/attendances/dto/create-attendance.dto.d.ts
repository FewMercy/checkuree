/// <reference types="multer" />
import { Attendance } from '../entities/attendance.entity';
export declare class CreateAttendanceDto {
    title: string;
    description: string;
    availableFrom: string;
    availableTo: string;
    allowLateness: boolean;
    attendanceDays: string;
    image?: Express.Multer.File;
    toEntity(): Attendance;
}
