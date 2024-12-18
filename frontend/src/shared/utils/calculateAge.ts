/**
 * Calculates the age based on the provided date of birth.
 * @param dateOfBirth - The user's date of birth.
 * @returns The calculated age in years.
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();

  // If the current month is before the birth month, or it's the birth month
  // but the current day is before the birth day, subtract one year from age
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}
