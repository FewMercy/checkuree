'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Next
import { usePathname, useRouter } from 'next/navigation';

// Utils
import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { dateFormat } from '@/utils';

// Calendar
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

// Styles
import { Colors, Icons } from '@/styles/globalStyles';
import { AttendanceIdContainer } from '@/styles/app/attendancesId.styles';

// Api
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import AttendanceApiClient from '@/api/attendances/AttendanceApiClient';

// Components
import Icon from '@/components/Icon';
import Navigation from '@/app/attendances/_components/Navigation';
import AttendanceItem from '@/app/attendances/_components/AttendanceItem';
import InfiniteCheckComp from '@/components/InfiniteCheckComp';

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
    const router = useRouter();
    const attendanceId = usePathname().split('/')[2];

    const today = dateFormat(new Date(), 'dash');

    const [totalCount, setTotalCount] = useState(0);
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [attendeeList, setAttendeeList] = useState<ParsedAttendeeListType>(
        {}
    );

    const handlePrevDay = () => {
        setSelectedDate(() =>
            dateFormat(
                new Date(
                    new Date(selectedDate).setDate(
                        new Date(selectedDate).getDate() - 1
                    )
                ),
                'dash'
            )
        );
    };
    const handleNextDay = () => {
        setSelectedDate(() =>
            dateFormat(
                new Date(
                    new Date(selectedDate).setDate(
                        new Date(selectedDate).getDate() + 1
                    )
                ),
                'dash'
            )
        );
    };

    const queryClient = useQueryClient();

    // 출석대상 명단 조회
    const {
        data: attendance,
        isLoading,
        isSuccess,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['attendanceToday', attendanceId, selectedDate],
        queryFn: async ({
            pageParam,
        }): Promise<AttendanceSchedulesByDateItemObj> => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceSchedulesByDate(
                    {
                        attendanceId,
                        date: selectedDate,
                        pageNo: pageParam.pageNo,
                    }
                );

            if (
                response.status === 200 &&
                _.has(response, 'data') &&
                _.has(response.data, 'items')
            ) {
                const result: AttendanceSchedulesByDateItemObj =
                    response.data.items[0];

                setTotalCount(response.data.count);

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
        initialPageParam: { pageNo: 1 },
        getNextPageParam: (attendeeList, allPages, lastPageParam) => {
            if (!attendeeList || _.isEmpty(attendeeList)) {
                return undefined;
            }

            return { pageNo: lastPageParam.pageNo + 1 };
        },
    });

    // 출석, 지각, 결석 수 조회
    const { data: summaryData } = useQuery({
        queryKey: ['attendanceSummary', attendanceId, selectedDate],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceSummaryByDate(
                    attendanceId,
                    selectedDate
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
    const { mutate: createRecords } = useMutation({
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
        return attendeeList[key].some((item) => item.newStatus !== '');
    });

    const statusIcons: { icon: string; count: number }[] = [
        {
            icon: 'groups',
            count: totalCount,
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
        const day = dayjs(selectedDate)
            .locale('en')
            .format('dddd')
            .toUpperCase();

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
                        date: selectedDate,
                        time: item.time,
                        day: day.toUpperCase(),
                        etc: item.etc || '',
                    });
                }
                if (item.newStatus === 'Late') {
                    parameters.singleRecords.push({
                        status: item.newStatus,
                        attendeeId: item.attendeeId,
                        date: selectedDate,
                        time: item.time,
                        day: day.toUpperCase(),
                        etc: item.etc || '',
                    });

                    if (item.lateTime) {
                        const index = parameters.singleRecords.findIndex(
                            (el) => el.attendeeId === item.attendeeId
                        );

                        Object.assign(parameters.singleRecords[index], {
                            lateTime: item.lateTime,
                        });
                    }
                }
                if (item.newStatus === 'Absent') {
                    parameters.singleRecords.push({
                        status: item.newStatus,
                        attendeeId: item.attendeeId,
                        date: selectedDate,
                        time: item.time,
                        day: day.toUpperCase(),
                        etc: item.etc || '',
                    });

                    if (item.absenceType) {
                        const index = parameters.singleRecords.findIndex(
                            (el) => el.attendeeId === item.attendeeId
                        );

                        Object.assign(parameters.singleRecords[index], {
                            absenceType: item.absenceType,
                        });
                    }
                }
            })
        );

        createRecords(parameters);
    };

    useEffect(() => {
        if (isSuccess && attendance && attendance.pages) {
            const attendeeLists = attendance.pages.reduce((acc, obj) => {
                return { ...acc, ...obj };
            }, {});

            setAttendeeList(attendeeLists);
        }
    }, [attendance]);

    return (
        <AttendanceIdContainer>
            <section className="attendance-header">
                <div className="attendance-header-wrapper">
                    <div className="attendance-img">
                        {detailData?.imageUrl && (
                            <Image
                                src={detailData.imageUrl}
                                alt="attendance-img"
                                width={32}
                                height={32}
                                style={{
                                    cursor: 'pointer',
                                }}
                                onClick={() => router.push('/attendances')}
                            />
                        )}
                        <div className="name">
                            {/* @ts-ignore */}
                            {detailData?.title || '출석부 이름'}
                        </div>
                    </div>

                    <section className="attendance-info">
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
                                    <div className="count">
                                        {item.count || 0}
                                    </div>
                                </div>
                            ))}
                        </section>
                        <div className="date-box">
                            <Image
                                src={'/images/icons/arrow-left-icon.svg'}
                                alt=""
                                width={24}
                                height={24}
                                style={{
                                    cursor: 'pointer',
                                }}
                                onClick={() => handlePrevDay()}
                            />
                            <DatePicker
                                locale={ko}
                                selected={new Date(selectedDate)}
                                onChange={(date) => {
                                    if (date) {
                                        const formattedDate = dateFormat(
                                            date,
                                            'dash'
                                        );
                                        setSelectedDate(formattedDate);
                                        window.scrollTo(0, 0);
                                    }
                                }}
                                customInput={
                                    <div className="date-container">
                                        <div className="date">
                                            {selectedDate.split('-')[1]}
                                        </div>
                                        <div className="date">
                                            {selectedDate.split('-')[2]}
                                        </div>
                                        <div className="date">
                                            {dayjs(selectedDate)
                                                .locale('ko')
                                                .format('ddd')}
                                        </div>
                                    </div>
                                }
                            />
                            <Image
                                src={'/images/icons/arrow-right-icon.svg'}
                                alt=""
                                width={24}
                                height={24}
                                style={{
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleNextDay()}
                            />
                        </div>
                    </section>
                </div>
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

                <InfiniteCheckComp
                    initialDataLoading={!isLoading && !_.isEmpty(attendeeList)}
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage}
                    callNextPage={async () => {
                        if (isFetchingNextPage) {
                            return;
                        }
                        await fetchNextPage();
                    }}
                />
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
