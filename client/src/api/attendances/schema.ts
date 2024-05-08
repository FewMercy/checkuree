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

export interface AttendeeData {
    attendanceId: string;
    birth: string;
    course: string | null;
    createId: string;
    createdAt: string;
    deletedAt: string | null;
    description: string | null;
    gender: string;
    grade: string | null;
    id: string;
    mobileNumber: string;
    name: string;
    schedules: ScheduleType[];
    school: string | null;
    status?: string;
    isDetailOpen?: boolean;
    subMobileNumber: string | null;
    updateId: string | null;
    updatedAt: string;
}

export interface AttendeeDetail {
    data?: AttendeeData[];
    items?: AttendeeData[];
    success: boolean;
    count: number;
}

export interface AttendanceSchedulesByDateItem {
    attendee: AttendeeData;
    attendeeId: string;
    createId: string;
    createdAt: string;
    day: string;
    deletedAt: string | null;
    id: number;
    time: string;
    updateId: string | null;
    updatedAt: string;
    status?: string;
    isDetailOpen?: boolean;
    etc?: string;
    lateTime?: string;
    absenceType?: string;
}

export interface AttendanceSchedulesByDate {
    items: AttendanceSchedulesByDateItem[];
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
