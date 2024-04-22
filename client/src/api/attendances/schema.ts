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
