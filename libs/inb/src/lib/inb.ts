export type Unit = "B" | "KB" | "MB" | "GB" | "TB" | "PB";
export type StringValue = `${number}${Unit}` | `${number} ${Unit}`;

/**
 * Converts a string representation of a byte size to its equivalent value in bytes.
 *
 * @param {StringValue} value - The string representation of the byte size.
 * @return {number} The value of the byte size in bytes.
 * @throws {Error} If the unit is invalid.
 */
export function inB(value: StringValue): number {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

  let stringNumber = "";
  let unit = "" as Unit;

  value.split("").forEach(char => {
    const charIsNumber = !isNaN(parseInt(char, 10));

    if (charIsNumber || char === ".") {
      stringNumber += char;
      return;
    }
    if (char !== " ") {
      unit += char;
      return;
    }
  });

  if (!units.includes(unit)) {
    throw new Error(`Invalid unit: ${unit}`);
  }

  const number = parseInt(stringNumber, 10);
  const valueInBytes = number * 1000 ** units.indexOf(unit);

  return valueInBytes;
}
