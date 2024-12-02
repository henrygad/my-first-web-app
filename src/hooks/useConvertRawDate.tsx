
const useConvertRawDate = () => {
    //"2024-11-20T12:00:00.000Z"
    const handleReadableDate = (rawDate: Date | string, option?: {}) => {
        const readableDate = new Date(rawDate)
            .toLocaleString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                ...option,
                /* second: '2-digit', */
               /*  timeZoneName: 'short' */
            });

            if(rawDate.toString().trim()) return readableDate;
            else return ' ';
    };

    return handleReadableDate;
};

export default useConvertRawDate;
