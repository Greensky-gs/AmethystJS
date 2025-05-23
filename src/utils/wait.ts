type unit = 'ms' | 's' | 'm';
const calculateTime = (t: number, unit: unit) => {
    const ratio: Record<unit, number> = {
        ms: 1,
        s: 1000,
        m: 60000
    };
    return t * ratio[unit];
};
export const wait = (time: number, unit?: unit): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(
            () => {
                resolve();
            },
            Math.abs(calculateTime(time, unit ?? 'ms'))
        );
    });
};
