export const isSameWeek = (date1: Date, date2: Date): boolean => {
    const startOfWeek = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - d.getDay());
        return d.getTime();
    };
    return startOfWeek(date1) === startOfWeek(date2);
};
