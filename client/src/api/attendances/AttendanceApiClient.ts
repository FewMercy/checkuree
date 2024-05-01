import BaseApiClient, { Tokens } from '../BaseApiClient';
import {
    AttendanceData,
    AttendanceDetail,
    AttendeeDetail,
    CreateAttendance,
    CreateAttendee,
    CreateSchedules,
} from '@/api/attendances/schema';

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

    /** 특정 출석부 상세 조회 */
    public getAttendanceDetail = (attendanceId: string) =>
        this.axios.request<AttendanceDetail>({
            method: 'GET',
            url: `/attendances/${attendanceId}`,
        });

    /** 날짜에 따른 출석부 명단 */
    public getAttendanceById = (attendanceId: string, date: string) =>
        this.axios.request({
            method: 'GET',
            url: `/schedules/attendanceId/${attendanceId}/${date}`,
        });

    /** 출석 요약 */
    public getAttendanceSummary = (
        attendanceId: string,
        attendeeIds: string[]
    ) =>
        this.axios.request({
            method: 'GET',
            url: `/records/attendance/${attendanceId}/summary`,
            params: {
                attendeeIds,
            },
        });

    /** 날짜별 출석 요약 */
    public getAttendanceSummaryByDate = (attendanceId: string, date: string) =>
        this.axios.request({
            method: 'GET',
            url: `/records/attendance/${attendanceId}/${date}/summary`,
        });

    /** 특정 출석부의 출석대상 명단 */
    public getAttendeeList = (attendanceId: string) =>
        this.axios.request<AttendeeDetail>({
            method: 'GET',
            url: `/attendees/attendanceId/${attendanceId}`,
        });

    /** 출석대상의 스케쥴조회 */
    public getAttendeeSchedule = (attendeeId: string) =>
        this.axios.request<AttendanceData[]>({
            method: 'GET',
            url: `/schedules/attendee/${attendeeId}`,
        });
    /** 출석부 생성 */
    public createAttandance = (request: CreateAttendance) =>
        this.axios.request({
            method: 'POST',
            url: `/attendances`,
            data: request,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

    /** 명단관리 > 출석대상 등록 */
    public createAttendee = (parameters: CreateAttendee) =>
        this.axios.request({
            method: 'POST',
            url: `/attendees`,
            data: parameters,
        });

    /** 명단관리 > 출석대상 등록 후 스케쥴 등록 */
    public createSchedules = (parameters: CreateSchedules) =>
        this.axios.request({
            method: 'POST',
            url: `/schedules`,
            data: parameters,
        });
}

export default AttendanceApiClient;
