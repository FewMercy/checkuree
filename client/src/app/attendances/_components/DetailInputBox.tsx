'use client';

import React from 'react';

// Components
import { TextField } from '@mui/material';

// Styles
import { DetailButton } from '@/styles/app/attendancesId.styles';

// Types
import { AttendanceSchedulesByDateItem } from '@/api/attendances/schema';
import { HandleListItemType } from '@/app/attendances/[id]/page';

interface ItemType extends AttendanceSchedulesByDateItem {
    lateTime: string;
    lateReason: string;
    absentType: string;
}

interface PropsType {
    index: number;
    time: string;
    item: ItemType;
    handleListItem: HandleListItemType;
}

const DetailInputBox = ({ item, time, index, handleListItem }: PropsType) => {
    const detailOptions = {
        // TODO: api 연동 이후 영어로 변경 필요
        지각: [
            { label: '5분', value: '5' },
            { label: '10분', value: '10' },
            { label: '15분', value: '15' },
            { label: '20분 이상', value: '20' },
        ],
        결석: [
            { label: '공결', value: '공결' },
            { label: '병결', value: '병결' },
            { label: '무단', value: '무단' },
            { label: '기타', value: '기타' },
        ],
    };

    return (
        <div className="detail-box">
            {item.status === '지각' ? (
                <div className="detail-buttons">
                    {detailOptions.지각.map((option) => (
                        <DetailButton
                            isSelected={option.value === item.lateTime}
                            onClick={() =>
                                handleListItem(
                                    index,
                                    time,
                                    'lateTime',
                                    option.value
                                )
                            }
                        >
                            {option.label}
                        </DetailButton>
                    ))}
                </div>
            ) : item.status === '결석' ? (
                <div className="detail-buttons">
                    {detailOptions.결석.map((option) => (
                        <DetailButton
                            isSelected={option.value === item.absentType}
                            onClick={() =>
                                handleListItem(
                                    index,
                                    time,
                                    'absentType',
                                    option.value
                                )
                            }
                        >
                            {option.label}
                        </DetailButton>
                    ))}
                </div>
            ) : null}

            <TextField
                value={item.lateReason}
                rows={item.status === '출석' ? 4 : 3}
                onChange={(e) =>
                    handleListItem(index, time, 'lateReason', e.target.value)
                }
                multiline
            />
        </div>
    );
};

export default DetailInputBox;
