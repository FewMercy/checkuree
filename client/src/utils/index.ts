import { format } from 'date-fns';

export const dateFormat = (
    date: Date,
    type: 'slash' | 'dash' | 'dot' | 'fullDash' | 'fullDot'
) => {
    switch (type) {
        case 'slash':
            return format(date, 'yyyy/MM/dd');
        case 'dash':
            return format(date, 'yyyy-MM-dd');
        case 'dot':
            return format(date, 'yyyy.MM.dd');
        case 'fullDash':
            return format(date, 'yyyy-MM-dd HH:mm');
        case 'fullDot':
            return format(date, 'yyyy.MM.dd HH:mm');
        default:
            return format(date, 'yyyy-MM-dd');
    }
};
