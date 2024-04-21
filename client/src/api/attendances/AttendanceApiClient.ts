import BaseApiClient, { Tokens } from '../BaseApiClient';
import { AttendanceDetail } from '@/api/attendances/schema';

export interface ICommonResponse<T> {
    code: number;
    message: string;
    result?: T;
}

/**
 * 페이지 데이터 오브젝트 타입
 */
export interface IPage<T> {
    data: T[];
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage?: number;
    prevPage?: number;
}

class AttendanceApiClient extends BaseApiClient {
    private static instance: AttendanceApiClient;

    public constructor(tokens?: Tokens) {
        super(process.env.NEXT_PUBLIC_API_ROOT!, tokens);
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new AttendanceApiClient();
        }
        return this.instance;
    }

    public getAttendanceList = () =>
        this.axios.request({
            method: 'GET',
            url: '/attendances',
        });

    /** 날짜에 따른 출석부 명단 */
    public getAttendanceById = (attendanceId: string, date: string) =>
        this.axios.request({
            method: 'GET',
            url: `/schedules/attendanceId/${attendanceId}/${date}`,
        });

    /** 오늘 출석 요약 */
    public getAttendanceSummary = (attendanceId: string, date: string) =>
        this.axios.request({
            method: 'GET',
            url: `/records/attendance/${attendanceId}/${date}/summary `,
        });

    /** 특정 출석부 정보(상세) */
    public getAttendanceDetail = (attendanceId: string) =>
        this.axios.request<AttendanceDetail>({
            method: 'GET',
            url: `/attendances/${attendanceId}`,
        });

    public createAttandance = (id: string) =>
        this.axios.request({
            method: 'POST',
            url: `/schedules/attendanceId/${id}?days=TUESDAY&days=MONDAY&timeFrom=0900&timeTo=1830`,
            data: '',
        });
}

export default AttendanceApiClient;
