import styled from '@emotion/styled';
import { Colors } from '@/styles/globalStyles';

export const ListManagementContainer = styled.section`
    min-width: 393px;
    width: 100%;
    padding: 0 27px;
    position: relative;

    & > .attendance-header {
        width: 100%;
        position: fixed;
        top: 0;
        padding: 42px 0 12px;
        box-sizing: border-box;
        background: ${Colors.White};

        & > .attendance-img {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background-color: ${Colors.Gray40};
            margin-bottom: 12px;
        }

        & > .attendance-info {
            & > .name {
                font-size: 20px;
                font-weight: 600;
                color: ${Colors.Black01};
            }
        }
    }

    & > .attendance-list {
        display: flex;
        gap: 12px;
        flex-direction: column;
        padding: 12px 0 120px;
        margin-top: 125px;
    }

    & > .MuiFab-root {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 29px;
        bottom: 84px;
        border-radius: 24px;
        box-sizing: border-box;
        background-color: ${Colors.CheckureeGreen};
        box-shadow: none;
        cursor: pointer;

        &:hover {
            background-color: ${Colors.CheckureeGreen};
        }
    }
`;

export const AttendanceItemContainer = styled.div<{
    status: string;
    isDetailOpen: boolean;
}>`
    & > .attendance-item__container {
        width: 100%;
        height: 58px;
        padding: 9px 18px 10px;
        border: 1px solid ${Colors.CheckureeGreen};
        border-radius: 8px;
        box-sizing: border-box;
        background-color: ${Colors.White};

        & > .name {
            display: flex;
            gap: 4px;
            align-items: center;
            font-weight: 500;
        }

        & > .bottom-container {
            display: flex;
            align-items: center;
            justify-content: space-between;

            & > div {
                font-size: 12px;
                font-weight: 500;
                color: ${Colors.Gray80};
            }

            & > .status-container {
                display: flex;
                gap: 4px;

                & > .status {
                    display: flex;
                    gap: 2px;
                    align-items: center;

                    & > .count {
                        line-height: 14.34px;
                    }
                }
            }
        }
    }
`;

export const FormContentsContainer = styled.section<{ gender: string }>`
    & > form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 32px 27px 36px;

        & > .form-row {
            & > .label {
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 8px;
            }

            & > .value {
                z-index: 1;

                & > .calendar-input {
                    width: 100%;
                    height: 40px;
                    padding: 8px 13px;
                    border: 1px solid ${Colors.Gray50};
                    border-radius: 8px;
                    box-sizing: border-box;

                    & > span {
                        color: ${Colors.Gray60};
                    }
                }

                & > .MuiFormControl-root > .MuiFormGroup-root {
                    display: flex;
                    flex-direction: row;

                    & .MuiFormControlLabel-root {
                        height: 22px;
                        gap: 8px;
                        margin-left: 0;

                        &:first-of-type {
                            margin-right: 66px;
                        }

                        & .MuiRadio-root {
                            width: 18px;
                            height: 18px;
                            padding: 0;
                        }
                    }
                }
            }
        }
    }

    & > .button-container {
        width: 100%;
        height: 60px;
        display: flex;

        & > .button {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: ${Colors.White};
        }

        & > .cancel {
            flex: 1;
            background-color: ${Colors.Gray60};
        }

        & > .confirm {
            flex: 2.5;
            background-color: ${Colors.CheckureeGreen};
        }
    }
`;

export const CalendarContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & .react-calendar {
        border-radius: 8px;

        & .react-calendar__month-view__days__day--weekend {
            color: ${Colors.WarningRed};
        }

        & .react-calendar__tile--now {
            background: none;
        }

        & .react-calendar__tile--active,
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
            font-weight: 600;
            background: ${Colors.CheckureeGreen};
        }
    }
`;
