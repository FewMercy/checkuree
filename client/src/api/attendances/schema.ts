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
    title: string;
    updateId: string | null;
    updatedAt: string;
}
export interface AttendanceDetail {
    data: AttendanceData;
    message: string;
    success: boolean;
}
