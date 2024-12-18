// src/pages/setup/utils.ts

/**
 * Validates if the given birthdate corresponds to an age between 13 and 100.
 */
export function isAtLeast13AtMost100(birthdate: string): boolean {
    if (!birthdate) return false;
    const parts = birthdate.split("-");
    if (parts.length !== 3) return false;

    const [yearStr, monthStr, dayStr] = parts;
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    // Validate parsed values
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    // Calculate the date 13 years ago and 100 years ago
    const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

    return birthDate <= thirteenYearsAgo && birthDate >= hundredYearsAgo;
}
/**
 * Converts kg to lbs.
 */
export function kgToLbs(kg: number): number {
    return Math.round(kg * 2.20462);
}

/**
 * Converts lbs to kg.
 */
export function lbsToKg(lbs: number): number {
    return Math.round(lbs / 2.20462);
}

/**
 * Converts cm to inches.
 */
export function cmToInches(cm: number): number {
    return Math.round(cm / 2.54);
}

/**
 * Converts inches to cm.
 */
export function inchesToCm(inches: number): number {
    return Math.round(inches * 2.54);
}
