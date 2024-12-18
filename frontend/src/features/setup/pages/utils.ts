// src/pages/setup/utils.ts

/**
 * Validates if the given birthdate corresponds to an age between 13 and 100.
 */
export function isAtLeast13AtMost100(day: string, month: string, year: string): boolean {
    if (!day || !month || !year) return false;

    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();

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
