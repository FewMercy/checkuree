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
    lateTime?: string;
    etc?: string;
    absenceType?: string;
}

interface PropsType {
    index: number;
    time: string;
    item: ItemType;
    handleListItem: HandleListItemType;
}

const DetailInputBox = ({ item, time, index, handleListItem }: PropsType) => {
    const detailOptions = {
        Late: [
            { label: '5분', value: '5' },
            { label: '10분', value: '10' },
            { label: '15분', value: '15' },
            { label: '20분 이상', value: '20' },
        ],
        Absent: [
            { label: '공결', value: 'OFFICIAL' },
            { label: '병결', value: 'SICK' },
            { label: '무단', value: 'GENERAL' },
            { label: '기타', value: 'ETC' },
        ],
    };

    return (
        <div className="detail-box">
            {item.status === 'Late' ? (
                <div className="detail-buttons">
                    {detailOptions.Late.map((option) => (
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
            ) : item.status === 'Absent' ? (
                <div className="detail-buttons">
                    {detailOptions.Absent.map((option) => (
                        <DetailButton
                            isSelected={option.value === item.absenceType}
                            onClick={() =>
                                handleListItem(
                                    index,
                                    time,
                                    'absenceType',
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
                value={item.etc}
                rows={item.status === 'Present' ? 4 : 3}
                onChange={(e) =>
                    handleListItem(index, time, 'etc', e.target.value)
                }
                multiline
            />
        </div>
    );
};

export default DetailInputBox;
