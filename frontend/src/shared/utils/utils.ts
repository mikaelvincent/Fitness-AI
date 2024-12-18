export const capitalizeFirstLetter = (data: Record<string, any>) => {
    return Object.entries(data).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value),
    }));
};