'use client';

import React, { useEffect, useState } from 'react';

// Libraries
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Components
import {
    FormControl,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Modal,
} from '@mui/material';

// Utils
import { dateFormat } from '@/utils';

// Styles
import { Colors } from '@/styles/globalStyles';
import {
    CalendarContainer,
    FormContentsContainer,
} from '@/styles/app/listManagement.styles';

// Types
interface Inputs {
    name: string;
    gender: string;
    birth: string | Date;
    birthYear: string;
    birthday: string;
    mobileNumber: string;
}

const FormContents = () => {
    const [showCalendar, setShowCalendar] = useState(false);

    const {
        watch,
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: { gender: 'male' },
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });
    const onSubmit = handleSubmit((data) => {
        console.log('???data', data);
    });

    useEffect(() => {
        // 입력받은 생년월일 값은 년도, 날짜를 분리해서 DB에 저장해야 함.
        if (watch('birth')) {
            const birth = format(watch('birth'), 'yyyyMMdd');

            setValue('birthYear', birth.slice(0, 4));
            setValue('birthday', birth.slice(4, 8));
        }
    }, [watch('birth')]);

    return (
        <FormContentsContainer gender={watch('gender')}>
            <form id="create-attendees" onSubmit={onSubmit}>
                <div className="form-row">
                    <div className="label">이름</div>
                    <div className="value">
                        <TextField {...register('name')} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="label">성별</div>
                    <div className="value">
                        <FormControl>
                            <RadioGroup
                                defaultValue="male"
                                aria-labelledby="gender-radio-buttons-group-label"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel
                                    value="male"
                                    control={
                                        <Radio
                                            {...register('gender')}
                                            sx={{
                                                color:
                                                    watch('gender') === 'male'
                                                        ? Colors.CheckureeGreen
                                                        : Colors.Gray60,
                                                '&.Mui-checked': {
                                                    color:
                                                        watch('gender') ===
                                                        'male'
                                                            ? Colors.CheckureeGreen
                                                            : Colors.Gray60,
                                                },
                                                '&.MuiFormControlLabel-label': {
                                                    color: Colors.Gray60,
                                                },
                                            }}
                                        />
                                    }
                                    label="남"
                                />
                                <FormControlLabel
                                    value="female"
                                    control={
                                        <Radio
                                            {...register('gender')}
                                            sx={{
                                                color:
                                                    watch('gender') === 'female'
                                                        ? Colors.CheckureeGreen
                                                        : Colors.Gray60,
                                                '&.Mui-checked': {
                                                    color:
                                                        watch('gender') ===
                                                        'female'
                                                            ? Colors.CheckureeGreen
                                                            : Colors.Gray60,
                                                },
                                                '&.MuiFormControlLabel-label': {
                                                    color: Colors.Gray60,
                                                },
                                            }}
                                        />
                                    }
                                    label="녀"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>

                <div className="form-row">
                    <div className="label">생년월일</div>
                    <div className="value">
                        <div
                            className="calendar-input"
                            onClick={() => setShowCalendar(true)}
                        >
                            {watch('birth') ? (
                                dateFormat(watch('birth'), 'slash')
                            ) : (
                                <span>YYYY/MM/DD</span>
                            )}
                        </div>
                        <Modal
                            open={showCalendar}
                            onClose={() => setShowCalendar(false)}
                        >
                            <CalendarContainer>
                                <Calendar
                                    value={watch('birth')}
                                    onChange={(date) => {
                                        if (date && date instanceof Date) {
                                            setValue('birth', date);
                                        }
                                        setShowCalendar(false);
                                    }}
                                />
                            </CalendarContainer>
                        </Modal>
                    </div>
                </div>

                <div className="form-row">
                    <div className="label">핸드폰 번호</div>
                    <div className="value">
                        <TextField {...register('mobileNumber')} />
                    </div>
                </div>
            </form>

            <section className="button-container">
                <div className="button cancel">취소</div>
                <button
                    type="submit"
                    className="button confirm"
                    form="create-attendees"
                >
                    저장
                </button>
            </section>
        </FormContentsContainer>
    );
};

export default FormContents;
