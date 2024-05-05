const useFormContents = () => {
    // 30분 간격으로 시간을 생성하는 함수
    function generateTimeOptions() {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeLabel = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const timeValue = (hour * 100 + minute)
                    .toString()
                    .padStart(4, '0');
                options.push({ label: timeLabel, value: timeValue });
            }
        }
        return options;
    }

    return { generateTimeOptions };
};

export default useFormContents;
