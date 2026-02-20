import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectFieldOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  "data-testid"?: string;
}

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  error,
  className,
  "data-testid": testId,
}: SelectFieldProps) {
  const fieldId = `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={fieldId} data-testid={testId}>
          <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              data-testid={`option-${fieldId}-${option.value}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-destructive" data-testid={`error-${fieldId}`}>
          {error}
        </p>
      )}
    </div>
  );
}
