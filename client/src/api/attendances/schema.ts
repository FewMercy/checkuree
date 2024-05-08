export interface AttendanceData {
    allowLateness: boolean;
    attendanceDays: { attendanceId: string; day: string; id: number }[];
    days: string[];
    availableFrom: string;
    availableTo: string;
    createId: string;
    createdAt: string;
    deletedAt: string | null;
    description: '범수교회';
    id: string;
    name: string;
    title: string;
    updateId: string | null;
    updatedAt: string;
}
export interface AttendanceDetail {
    data: AttendanceData;
    success: boolean;
    count: number;
}

export interface ScheduleType {
    id: number;
    day: string;
    time: string;
}

export interface Attendance {
    id: string;
    title: string;
    description: string;
    availableFrom: string;
    availableTo: string;
    allowLateness: boolean;
    imageUrl: string;
    userAttendance: {
        userAttendanceId: number;
        userId: string;
        attendanceId: string;
        role: 'MASTER' | 'MANAGER' | 'GENERAL' | 'READER';
        // user*	User{...}
    };
    attendees: {};
    attendanceDays: {};
}

export interface Record {
    id: number;
    attendeeId: string;
    status: 'Present' | 'Late' | 'Absent';
    date: string;
    day:
        | 'SUNDAY'
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY';
    etc: string | null;
    lateTime: string | null;
    absenceType: string | null;
}

export interface AttendeeData {
    id: string;
    attendanceId: string;
    name: string;
    gender: string;
    mobileNumber: string;
    subMobileNumber: string | null;
    birth: string;
    course: string | null;
    school: string | null;
    grade: string | null;
    description: string | null;
    attendance: Attendance[];
    schedules: ScheduleType[];
    records: Record[];
    status?: string;
    isDetailOpen?: boolean;
}

export interface AttendeeList {
    data?: AttendeeData[];
    items?: AttendeeData[];
    success: boolean;
    count: number;
}

export interface AttendeeDetail {
    data: AttendeeData;
    success: boolean;
    message: string;
}

export interface AttendanceSchedulesByDateItem {
    attendee: AttendeeData;
    attendeeId: string;
    createdAt: string;
    day: string;
    id: number;
    time: string;
    status?: string;
    isDetailOpen?: boolean;
    etc?: string;
    lateTime?: string;
    absenceType?: string;
}

export interface AttendanceSchedulesByDateItemObj {
    [key: string]: AttendanceSchedulesByDateItem[];
}

export interface AttendanceSchedulesByDate {
    items: AttendanceSchedulesByDateItemObj[];
    count: number;
    pageSize: number;
    success: boolean;
    totalPage: number;
}

export interface CreateAttendee {
    attendanceId: string;
    name: string;
    gender: string;
    mobileNumber?: string;
    subMobileNumber?: string;
    birth: string;
    course?: string;
    grade?: string;
    school?: string;
    description?: string;
}

export type SingleSchedulesType = { id?: number; day: string; time: string }[];
export interface CreateSchedules {
    attendanceId: string;
    attendeeId: string;
    singleSchedules: SingleSchedulesType;
}

export interface CreateAttendance {
    title: string;
    description: string;
    availableFrom: string;
    availableTo: string;
    allowLateness: string;
    attendanceDays: string;
    image: File;
}

export interface SingleRecords {
    status: string;
    attendeeId: string;
    date: string;
    time: string;
    day: string;
    etc: string;
    lateTime?: string;
    absenceType?: string;
}
export interface CreateRecords {
    attendanceId: string;
    singleRecords: SingleRecords[];
}

export interface DeleteAttendees {
    ids: string[];
    attendanceId: string;
}
