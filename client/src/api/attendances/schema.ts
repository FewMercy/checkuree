export interface AttendanceData {
    allowLateness: boolean;
    attendanceDays: string[];
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
    items: AttendanceData[];
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

export interface CreateSchedules {
    attendanceId: string;
    attendeeId: string;
    singleSchedules: { day: string; time: string }[];
}
