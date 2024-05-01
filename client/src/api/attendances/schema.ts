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
    schedules: { id: number; day: string; time: string }[];
    school: string | null;
    status?: string;
    isDetailOpen?: boolean;
    subMobileNumber: string | null;
    updateId: string | null;
    updatedAt: string;
}

export interface AttendeeDetail {
    items: AttendeeData[];
    success: boolean;
    count: number;
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

export type SingleSchedulesType = { day: string; time: string }[];
export interface CreateSchedules {
    attendanceId: string;
    attendeeId: string;
    singleSchedules: SingleSchedulesType;
}
