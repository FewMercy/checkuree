'use client';

// Styles
import { Colors, Icons } from '@/styles/globalStyles';
// Api
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import AttendanceApiClient from '@/api/attendances/AttendanceApiClient';
import { AttendanceIdContainer } from '@/styles/app/attendancesId.styles';
import AttendanceItem from '@/app/attendances/_components/AttendanceItem';
// Components
import Icon from '@/components/Icon';
import Navigation from '@/app/attendances/_components/Navigation';
// Next
import { usePathname } from 'next/navigation';

// Types
export interface AttendanceItemType {
    id: number;
    name: string;
    status: string;
    isDetailOpen: boolean;
    lateTime?: string;
    absentType?: string;
    lateReason?: string;
}

const Index = () => {
    const attendanceId = usePathname().split('/')[2];

    const statusIcons: { icon: string; count: number }[] = [
        { icon: 'groups', count: 12 },
        { icon: 'sentiment_satisfied_alt', count: 10 },
        { icon: 'watch_later', count: 1 },
        { icon: 'highlight_off', count: 1 },
    ];

    // TODO: api 데이터 제대로 내려오면 하단의 attendance로 대체될 예정.
    const [dummyList, setDummyList] = useState<AttendanceItemType[]>([
        { id: 1, name: '김차력', status: '', isDetailOpen: false },
        { id: 2, name: '김차린', status: '', isDetailOpen: false },
        { id: 3, name: '김하력', status: '', isDetailOpen: false },
        { id: 4, name: '계창선', status: '', isDetailOpen: false },
        { id: 5, name: '계창선', status: '', isDetailOpen: false },
        { id: 6, name: '계창선', status: '', isDetailOpen: false },
        { id: 7, name: '계창선', status: '', isDetailOpen: false },
        { id: 8, name: '계창선', status: '', isDetailOpen: false },
    ]);

    const shouldShowNavigation = dummyList.some((item) => item.status !== '');
    // // fetching API
    // const { data: attendance, isLoading } = useQuery({
    //     queryKey: ['attendance'],
    //     queryFn: async () => {
    //         const response =
    //             await AttendanceApiClient.getInstance().getAttendanceById(
    //                 attendanceId
    //             );
    //         return response.data;
    //     },
    // });

    /**
     * @description 출석/지각/결석 선택 및 상세사유 입력 등 출석대상 목록의 값을 변경하는 함수
     */
    const handleListItem = (
        index: number,
        field: string,
        value: string | boolean
    ) => {
        setDummyList((prevState) => {
            return prevState.map((item, idx) => {
                if (idx === index)
                    return Object.assign(item, { [field]: value });
                else return item;
            });
        });
    };

    // if (isLoading) return <div>loading..</div>; // TODO: 스피너 이미지 생기면 교체하기

    return (
        <AttendanceIdContainer>
            <section className="attendance-header">
                <div className="attendance-img"></div>

                <section className="attendance-info">
                    {/* // TODO: 추후 데이터 제대로 내려오면 api 값으로 변경 필요 */}
                    <div className="name">출석부 이름</div>
                    <div className="date-container">
                        <div className="date">03</div>
                        <div className="date">20</div>
                        <div className="date">수</div>
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
                {dummyList.map((item, index) => (
                    <AttendanceItem
                        item={item}
                        index={index}
                        handleListItem={handleListItem}
                    />
                ))}
            </section>
            <Navigation
                status={shouldShowNavigation}
                setDummyList={setDummyList}
            />
        </AttendanceIdContainer>
    );
};

export default Index;

// TODO: 좀 더 작업 해야 함

Index.GetServerSideProps = async (context: any) => {
    const queryClient = new QueryClient();
    const id = context.params!.id as string;
    await queryClient.prefetchQuery({
        queryKey: ['attendance', id],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceById(id);
            return response.data;
        },
    });
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};
