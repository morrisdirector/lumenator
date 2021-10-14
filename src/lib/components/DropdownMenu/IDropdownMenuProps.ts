export interface IDropdownMenuProps {
  type?: "number" | "string";
  value?: string | number;
  disabled?: boolean;
  placeholder?: string;
  onSelect?: (value: string | number | undefined) => void;
}
