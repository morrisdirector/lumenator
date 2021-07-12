export interface IDropdownMenuProps {
  type?: "number" | "string";
  value?: string | number;
  placeholder?: string;
  onSelect?: (value: string | number | undefined) => void;
}
