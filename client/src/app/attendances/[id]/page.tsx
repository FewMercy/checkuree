'use client';

import React, { useEffect, useState } from 'react';

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
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import AttendanceApiClient from '@/api/attendances/AttendanceApiClient';

// Components
import Icon from '@/components/Icon';
import Navigation from '@/app/attendances/_components/Navigation';
import AttendanceItem from '@/app/attendances/_components/AttendanceItem';
import { AttendanceSchedulesByDateItem } from '@/api/attendances/schema';

// Types
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

    dayjs.locale('ko');
    const today = dateFormat(new Date(), 'dash');

    const [attendeeList, setAttendeeList] = useState<ParsedAttendeeListType>(
        {}
    );

    // 출석대상 명단 조회
    const { data: attendance, isSuccess } = useQuery({
        queryKey: ['attendanceToday'],
        queryFn: async (): Promise<ParsedAttendeeListType> => {
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
                const parsedAttendeeList: ParsedAttendeeListType = {};

                response.data.items.forEach((item) => {
                    const { time } = item;
                    if (!_.has(parsedAttendeeList, time)) {
                        parsedAttendeeList[time] = [];
                    }
                    parsedAttendeeList[time].push({
                        ...item,
                        status: '',
                        isDetailOpen: false,
                    });
                });

                return parsedAttendeeList;
            }

            return {};
        },
    });

    // 출석, 지각, 결석 수 조회
    const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
        queryKey: ['attendanceSummary'],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceSummaryByDate(
                    attendanceId,
                    today
                );
            return response.data;
        },
    });

    const shouldShowNavigation = Object.keys(attendeeList).some((key) => {
        attendeeList[key].some((el) => el.status !== '');
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

            // 주어진 time과 일치하는 시간대의 항목만 수정하고 나머지는 변경하지 않습니다.
            if (updatedState[time]) {
                updatedState[time] = updatedState[time].map((item, idx) => {
                    console.log('???', index);
                    if (index === idx) {
                        return { ...item, [field]: value };
                    }
                    return item;
                });
            }

            return updatedState;

            // return Object.fromEntries(
            //     Object.entries(prevState).map(([timeKey, items]) => {
            //         if (time === timeKey) {
            //             return [
            //                 time,
            //                 items.map((item, idx) => {
            //                     if (index === idx) {
            //                         return {
            //                             ...item,
            //                             [field]: value,
            //                         };
            //                     } else {
            //                         return item;
            //                     }
            //                 }),
            //             ];
            //         } else {
            //             return [time, items];
            //         }
            //     })
            // );
        });
    };

    useEffect(() => {
        if (isSuccess && attendance) {
            setAttendeeList(attendance);
        }
    }, [attendance]);

    console.log('attendeeList', attendeeList);

    return (
        <AttendanceIdContainer>
            <section className="attendance-header">
                <div className="attendance-img"></div>

                <section className="attendance-info">
                    {/* // TODO: 추후 데이터 제대로 내려오면 api 값으로 변경 필요 */}
                    <div className="name">출석부 이름</div>
                    <div className="date-container">
                        <div className="date">{today.split('-')[1]}</div>
                        <div className="date">{today.split('-')[2]}</div>
                        <div className="date">{dayjs().format('ddd')}</div>
                    </div>
                </section>

                <section className="attendance-status-container">
                    {statusIcons.map((item) => (
                        <div className="status">
                            <Icon
                                icon={Icons[item.icon]}
                                color={Colors.Gray80}
                                size={16}
                            />
                            <div className="count">{item.count}</div>
                        </div>
                    ))}
                </section>
            </section>

            {/* 출석부 명단 */}
            <section className="attendance-list">
                {Object.keys(attendeeList).map((time) => {
                    return (
                        <section className="attendance-list-by-time">
                            <div className="attendance-time">{`${time.slice(0, 2)}:${time.slice(2, 4)}`}</div>
                            <div className="attendee-list">
                                {attendeeList[time].map((item, index) => (
                                    <AttendanceItem
                                        item={item}
                                        time={time}
                                        index={index}
                                        handleListItem={handleListItem}
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
