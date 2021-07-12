export interface IInputProps {
  value?: string | number;
  type?: "number" | "string";
  /**
   * Tab ID that is active on load
   */
  activeId?: number;
  onChange?: (value: string | number | undefined) => void;
}
