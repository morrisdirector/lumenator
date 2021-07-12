export interface IInputProps {
  value?: string;
  /**
   * Tab ID that is active on load
   */
  activeId?: number;
  onChange?: (value: string) => void;
}
