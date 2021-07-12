export function strValToNumber(str: string): number | undefined {
  if (str === "0") {
    return 0;
  } else if (typeof str === "string") {
    return parseFloat(str);
  }
  return undefined;
}
