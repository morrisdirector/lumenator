export interface IInputProps {
  id?: string;
  value?: string | number | undefined;
  type?: "number" | "string" | "password";
  /**
   * Tab ID that is active on load
   */
  activeId?: number;
  onChange?: (value: string | number | undefined) => void;
}
