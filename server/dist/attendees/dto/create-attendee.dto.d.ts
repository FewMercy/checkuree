import { Attendee } from '../entities/attendee.entity';
import { AttendeeGrade } from '../grade.enum';
import { Gender } from '../gender.enum';
export declare class CreateAttendeeDto {
    attendanceId: string;
    name: string;
    gender: Gender;
    mobileNumber: string;
    subMobileNumber: string;
    birth?: string;
    course?: string;
    grade?: AttendeeGrade;
    school?: string;
    description: string;
    createId: string;
    createdAt: string;
    toEntity(): Attendee;
}
