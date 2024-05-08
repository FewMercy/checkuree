'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Next
import { usePathname } from 'next/navigation';

// Utils
import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { dateFormat } from '@/utils';

// Styles
import { Colors, Icons } from '@/styles/globalStyles';
import { AttendanceIdContainer } from '@/styles/app/attendancesId.styles';

// Api
import {
    QueryClient,
    dehydrate,
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import AttendanceApiClient from '@/api/attendances/AttendanceApiClient';

// Components
import Icon from '@/components/Icon';
import Navigation from '@/app/attendances/_components/Navigation';
import AttendanceItem from '@/app/attendances/_components/AttendanceItem';

// Types
import {
    Attendance,
    AttendanceSchedulesByDateItem,
    AttendanceSchedulesByDateItemObj,
    CreateRecords,
} from '@/api/attendances/schema';

export type HandleListItemType = (
    index: number,
    time: string,
    field: string,
    value: string | boolean
) => void;

export type ParsedAttendeeListType = Record<
    string,
    AttendanceSchedulesByDateItem[]
>;

const Index = () => {
    const attendanceId = usePathname().split('/')[2];

    const today = dateFormat(new Date(), 'dash');
    const day = dayjs(new Date()).locale('en').format('dddd');

    const [attendeeList, setAttendeeList] = useState<ParsedAttendeeListType>(
        {}
    );

    const queryClient = useQueryClient();

    // 출석대상 명단 조회
    const { data: attendance, isSuccess } = useQuery({
        queryKey: ['attendanceToday', attendanceId],
        queryFn: async (): Promise<AttendanceSchedulesByDateItemObj> => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceSchedulesByDate(
                    attendanceId,
                    today
                );

            if (
                response.status === 200 &&
                _.has(response, 'data') &&
                _.has(response.data, 'items')
            ) {
                const result: AttendanceSchedulesByDateItemObj =
                    response.data.items[0];

                for (const key in result) {
                    if (result.hasOwnProperty(key)) {
                        result[key].forEach((item) => {
                            const records = item.attendee.records[0];

                            item.status = records?.status ?? '';
                            item.newStatus = '';
                            item.lateTime = records?.lateTime ?? '';
                            item.absenceType = records?.absenceType ?? '';
                            item.etc = records?.etc ?? '';
                            item.isDetailOpen = false;
                        });
                    }
                }

                return result;
            }

            return {} as AttendanceSchedulesByDateItemObj;
        },
    });

    // 출석, 지각, 결석 수 조회
    const { data: summaryData } = useQuery({
        queryKey: ['attendanceSummary', attendanceId],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceSummaryByDate(
                    attendanceId,
                    today
                );
            return response.data;
        },
    });

    // 출석부 이름 조회용
    const { data: detailData } = useQuery({
        queryKey: ['attendanceDetail', attendanceId],
        queryFn: async (): Promise<Attendance> => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceDetail(
                    attendanceId
                );

            if ((_.has(response, 'data'), _.has(response.data, 'data'))) {
                return response.data.data;
            }

            return {} as Attendance;
        },
    });

    // 출석기록 생성 및 수정
    const {
        mutate: createRecords,
        isPending: isCreateRecordsPending,
        isSuccess: isCreateRecordsSuccess,
    } = useMutation({
        mutationKey: ['records'],
        mutationFn: async (parameters: CreateRecords) =>
            AttendanceApiClient.getInstance().createRecords(parameters),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['attendanceToday'],
            });
        },
    });

    const shouldShowNavigation = Object.keys(attendeeList).some((key) => {
        console.log('attendeeList[key]', attendeeList[key]);
        return attendeeList[key].some((item) => item.newStatus !== '');
    });

    const statusIcons: { icon: string; count: number }[] = [
        {
            icon: 'groups',
            count:
                summaryData?.presentCount +
                summaryData?.lateCount +
                summaryData?.absenceCount,
        },
        {
            icon: 'sentiment_satisfied_alt',
            count: summaryData?.presentCount || 0,
        },
        { icon: 'watch_later', count: summaryData?.lateCount || 0 },
        { icon: 'highlight_off', count: summaryData?.absenceCount || 0 },
    ];

    /**
     * @description 출석/지각/결석 선택 및 상세사유 입력 등 출석대상 목록의 값을 변경하는 함수
     */
    const handleListItem: HandleListItemType = (index, time, field, value) => {
        setAttendeeList((prevState) => {
            const updatedState = { ...prevState }; // 이전 상태를 복사하여 새로운 상태를 만듭니다.

            if (updatedState[time]) {
                updatedState[time] = updatedState[time].map((item, idx) => {
                    if (index === idx) {
                        return { ...item, [field]: value };
                    }
                    return item;
                });
            }

            return updatedState;
        });
    };

    const onSaveAction = () => {
        const parameters: CreateRecords = {
            attendanceId: !_.isEmpty(detailData) ? detailData.id : '',
            singleRecords: [],
        };

        Object.values(attendeeList).forEach((value) =>
            value.forEach((item) => {
                if (item.newStatus === 'Present') {
                    parameters.singleRecords.push({
                        status: item.newStatus,
                        attendeeId: item.attendeeId,
                        date: today,
                        time: item.time,
                        day: day.toUpperCase(),
                        etc: item.etc || '',
                    });
                }
                if (item.newStatus === 'Late') {
                    parameters.singleRecords.push({
                        status: item.newStatus,
                        attendeeId: item.attendeeId,
                        date: today,
                        time: item.time,
                        day: day.toUpperCase(),
                        etc: item.etc || '',
                        lateTime: item.lateTime || '',
                    });
                }
                if (item.newStatus === 'Absent') {
                    parameters.singleRecords.push({
                        status: item.newStatus,
                        attendeeId: item.attendeeId,
                        date: today,
                        time: item.time,
                        day: day.toUpperCase(),
                        etc: item.etc || '',
                        absenceType: item.absenceType ?? '',
                    });
                }
            })
        );

        createRecords(parameters);
    };

    useEffect(() => {
        if (isSuccess && attendance) {
            setAttendeeList(attendance);
        }
    }, [attendance]);

    return (
        <AttendanceIdContainer>
            <section className="attendance-header">
                <div className="attendance-img">
                    {detailData?.imageUrl && (
                        <Image
                            src={detailData.imageUrl}
                            alt="attendance-img"
                            width={32}
                            height={32}
                        />
                    )}
                </div>

                <section className="attendance-info">
                    <div className="name">
                        {/* @ts-ignore */}
                        {detailData?.title || '출석부 이름'}
                    </div>
                    <div className="date-container">
                        <div className="date">{today.split('-')[1]}</div>
                        <div className="date">{today.split('-')[2]}</div>
                        <div className="date">
                            {dayjs().locale('ko').format('ddd')}
                        </div>
                    </div>
                </section>

                <section className="attendance-status-container">
                    {statusIcons.map((item) => (
                        <div
                            className="status"
                            key={`attendance-status__${item.icon}`}
                        >
                            <Icon
                                icon={Icons[item.icon]}
                                color={Colors.Gray80}
                                size={16}
                            />
                            <div className="count">{item.count || 0}</div>
                        </div>
                    ))}
                </section>
            </section>

            {/* 출석부 명단 */}
            <section className="attendance-list">
                {Object.keys(attendeeList).map((time) => {
                    return (
                        <section
                            className="attendance-list-by-time"
                            key={`time__${time}`}
                        >
                            <div className="attendance-time">{`${time.slice(0, 2)}:${time.slice(2, 4)}`}</div>
                            <div className="attendee-list">
                                {attendeeList[time].map((item, index) => (
                                    <AttendanceItem
                                        item={item}
                                        time={time}
                                        index={index}
                                        handleListItem={handleListItem}
                                        key={`attendee__${item.id}`}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </section>
            <Navigation
                status={shouldShowNavigation}
                setAttendeeList={setAttendeeList}
                onSaveAction={onSaveAction}
            />
        </AttendanceIdContainer>
    );
};

export default Index;

// TODO: 좀 더 작업 해야 함

Index.GetServerSideProps = async (context: any) => {
    const queryClient = new QueryClient();
    const id = context.params!.id as string;
    const today = context.params!.today as string;
    await queryClient.prefetchQuery({
        queryKey: ['attendance', id],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceSchedulesByDate(
                    id,
                    today
                );
            return response.data;
        },
    });
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};
