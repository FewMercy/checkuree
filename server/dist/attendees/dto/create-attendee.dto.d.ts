import { Attendee } from '../entities/attendee.entity';
export declare class CreateAttendeeDto {
    name: string;
    attendanceId: string;
    mobileNumber: string;
    subMobileNumber: string;
    age: number;
    description: string;
    createId: string;
    createdAt: string;
    toEntity(): Attendee;
}
