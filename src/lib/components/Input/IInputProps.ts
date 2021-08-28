export interface IInputProps {
  id?: string;
  value?: string | number | undefined;
  type?: "number" | "string" | "password";
  /**
   * Tab ID that is active on load
   */
  activeId?: number;
  disabled?: boolean;
  onChange?: (value: string | number | undefined) => void;
  onBlur?: (value: string | number | undefined) => void;
  onEnter?: (value: string | number | undefined) => void;
}
