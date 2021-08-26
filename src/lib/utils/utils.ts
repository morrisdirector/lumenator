export function strValToNumber(str: string): number | undefined {
  if (str === "0") {
    return 0;
  } else if (typeof str === "string") {
    return parseFloat(str);
  }
  return undefined;
}

export function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return (
    "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
  );
}

export function getUniqueId() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
}
