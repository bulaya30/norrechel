/**
 * Calculates the percentage change between two periods.
 *
 * A positive result represents growth.
 * A negative result represents a decline.
 *
 * When the previous period has no activity:
 * - returns 100 when the current period has activity
 * - returns 0 when both periods have no activity
 *
 * @param previousValue - Value from the previous period.
 * @param currentValue - Value from the current period.
 * @returns Percentage change rounded to the nearest whole number.
 */
export function calculatePercentageChange(
  previousValue: number,
  currentValue: number,
): number {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  return Math.round(
    ((currentValue - previousValue) / previousValue) * 100,
  );
}