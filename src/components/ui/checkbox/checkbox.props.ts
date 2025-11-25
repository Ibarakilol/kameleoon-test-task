export interface CheckboxProps {
  className?: string;
  isChecked: boolean;
  isDisabled?: boolean;
  label?: string;
  onChange: (isChecked: boolean) => void;
}
