'use client';

import 'dayjs/locale/ko'; // 한국어 locale 설정

import { Box, Container, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // import 이동

import AttendanceApiClient from '@/api/attendances/AttendanceApiClient';
import AttendanceCreateForm from '@/app/attendances/_components/AttendanceCreate';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

dayjs.locale('ko');

interface Attendance {
    attendeeCount: number;
    createId: string;
    createdAt: string;
    deletedAt: string | null;
    description: string;
    id: string;
    title: string;
    type: string;
    imageUrl: string;
    updateId: string | null;
    updatedAt: string;
}

interface AttendanceId {
    attendance: Attendance;
    attendanceId: string;
    createId: string;
    createdAt: string;
    deletedAt: string | null;
    role: string;
    updateId: string | null;
    updatedAt: string;
    userAttendanceId: number;
    userId: string;
}

const Page: React.FC = () => {
    const router = useRouter();
    const today = dayjs(); // 오늘 날짜
    const todayFormat = today.format('YYYY년 MM월 DD일 dddd');

    // State
    const [isCreate, setIsCreate] = useState<boolean>(false);

    const { data: attendancyList, refetch: attendancesRefetch } = useQuery({
        queryKey: ['attendancy-list'],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceList();
            return response.data;
        },
    });

    return (
        <ContainerST>
            {isCreate ? (
                <AttendanceCreateForm
                    setIsCreate={setIsCreate}
                    attendancesRefetch={attendancesRefetch}
                />
            ) : (
                <>
                    {attendancyList ? (
                        <BoxSTAttendanceWrapper>
                            <Box>
                                <Typography
                                    fontSize={14}
                                    lineHeight={'19.07px'}
                                    color={'#797979'}
                                >
                                    {todayFormat}
                                </Typography>
                                <Typography
                                    fontSize={20}
                                    lineHeight={'27.24px'}
                                    fontWeight={600}
                                >
                                    김범수님, 안녕하세요.
                                </Typography>
                            </Box>
                            <GridST>
                                {attendancyList?.items.map(
                                    (item: AttendanceId) => {
                                        return (
                                            <BoxSTAttendance
                                                onClick={() =>
                                                    router.push(
                                                        `/attendances/${item.attendanceId}`
                                                    )
                                                }
                                            >
                                                <Image
                                                    src={
                                                        item.attendance
                                                            .imageUrl ||
                                                        'images/sckeleton-image.svg'
                                                    }
                                                    width={142}
                                                    height={102}
                                                    alt="스켈레톤 이미지"
                                                    style={{
                                                        objectFit: 'cover',
                                                        // objectPosition:
                                                        //     '0px -10px',
                                                    }}
                                                />
                                                <BoxSTAttendanceFooter>
                                                    <Box>
                                                        <TypoSTTitle>
                                                            {
                                                                item.attendance
                                                                    .title
                                                            }
                                                        </TypoSTTitle>
                                                        <TypoSTDescription>
                                                            {item.attendance
                                                                .description ||
                                                                '출석부 설명입니다.'}
                                                        </TypoSTDescription>
                                                    </Box>
                                                    <Box
                                                        display={'flex'}
                                                        alignItems={'center'}
                                                        justifyContent={
                                                            'space-between'
                                                        }
                                                    >
                                                        <TypoSTDay>
                                                            월,화,목,금,일
                                                        </TypoSTDay>
                                                        <TypoSTAttendeCount>
                                                            {
                                                                item.attendance
                                                                    .attendeeCount
                                                            }
                                                        </TypoSTAttendeCount>
                                                    </Box>
                                                </BoxSTAttendanceFooter>
                                            </BoxSTAttendance>
                                        );
                                    }
                                )}
                            </GridST>
                            <Image
                                src={'/images/icons/add-icon.svg'}
                                alt=""
                                width={48}
                                height={48}
                                onClick={() => setIsCreate(true)}
                            />
                        </BoxSTAttendanceWrapper>
                    ) : (
                        <>...Loading</>
                    )}
                </>
            )}
        </ContainerST>
    );
};

export default Page;

const ContainerST = styled(Box)(() => {
    return {
        display: 'flex',
        justifyContent: 'center',
    };
});

const GridST = styled(Box)(() => {
    return {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap: '20px',
        padding: '0px 9px',
    };
});

const BoxSTAttendanceWrapper = styled(Box)(() => {
    return {
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
        flexWrap: 'wrap',
        paddingTop: '64px',
    };
});

const BoxSTAttendance = styled(Box)(() => {
    return {
        width: '150px',
        height: '185px',
        border: '1px solid green',
        borderRadius: '4px',
        display: 'flex',
        gap: '12px',
        cursor: 'pointer',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4px',
    };
});

const BoxSTAttendanceFooter = styled(Box)(() => {
    return {
        width: '100%',
        padding: '0px 7px',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
    };
});

const TypoSTAttendeCount = styled(Typography)(() => {
    return {
        fontSize: '12px',
        fontWeight: 500,
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #F0FFF4',
        lineHeight: '16.34px',
    };
});

const TypoSTTitle = styled(Typography)(() => {
    return {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '21.79px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    };
});

const TypoSTDescription = styled(Typography)(() => {
    return {
        fontSize: '14px',
        fontWeight: 500,
        color: '#797979',
        lineHeight: '19.07px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    };
});

const TypoSTDay = styled(Typography)(() => {
    return {
        fontSize: '12px',
        fontWeight: 500,
        color: '#797979',
        lineHeight: '16.34px',
    };
});
