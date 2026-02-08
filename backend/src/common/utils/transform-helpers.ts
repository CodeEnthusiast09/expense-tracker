import { TransformFnParams } from 'class-transformer';

/**
 * Transform a decimal/numeric database value to a JavaScript number
 * Handles both string (from PostgreSQL DECIMAL) and number inputs
 */
export function transformToNumber({ value }: TransformFnParams): number {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return 0;
  }

  // If already a number, return as-is
  if (typeof value === 'number') {
    return value;
  }

  // If string, parse to float
  if (typeof value === 'string') {
    const parsed = parseFloat(value);

    // Check if parsing was successful
    if (isNaN(parsed)) {
      console.warn(`Failed to parse value to number: "${value}"`);
      return 0;
    }

    return parsed;
  }

  // Unexpected type - log warning and return 0
  console.warn(
    `Unexpected value type for number transformation:`,
    typeof value,
  );
  return 0;
}
