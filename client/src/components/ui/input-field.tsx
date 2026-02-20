import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  "data-testid"?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    return (
      <div className={cn("space-y-1.5", className)}>
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          className={cn(error && "border-destructive focus-visible:ring-destructive")}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive" data-testid={`error-${inputId}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
