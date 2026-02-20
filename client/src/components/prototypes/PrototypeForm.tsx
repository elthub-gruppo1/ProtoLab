import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertPrototypeSchema, AREAS, type InsertPrototype } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { DateField } from "@/components/ui/date-field";
import { Loader2 } from "lucide-react";

const areaOptions = AREAS.map((a) => ({ value: a, label: a }));

interface PrototypeFormProps {
  onSuccess: () => void;
}

export function PrototypeForm({ onSuccess }: PrototypeFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertPrototype>({
    resolver: zodResolver(insertPrototypeSchema),
    defaultValues: {
      name: "",
      area: "Other",
      owner: "",
      targetDate: new Date().toISOString().split("T")[0],
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const areaValue = watch("area");

  const createMutation = useMutation({
    mutationFn: async (data: InsertPrototype) => {
      const res = await apiRequest("POST", "/api/prototypes", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Prototype created successfully" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating prototype",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => createMutation.mutate(data))}
      className="space-y-4"
      data-testid="form-create-prototype"
    >
      <InputField
        label="Name"
        placeholder="e.g. Thermal Shield v2"
        error={errors.name?.message}
        data-testid="input-prototype-name"
        {...register("name")}
      />

      <SelectField
        label="Area"
        value={areaValue}
        onValueChange={(v) => setValue("area", v as InsertPrototype["area"])}
        options={areaOptions}
        placeholder="Select area"
        error={errors.area?.message}
        data-testid="select-prototype-area"
      />

      <InputField
        label="Owner"
        placeholder="e.g. Marco Rossi"
        error={errors.owner?.message}
        data-testid="input-prototype-owner"
        {...register("owner")}
      />

      <DateField
        label="Target Date"
        error={errors.targetDate?.message}
        data-testid="input-prototype-target-date"
        {...register("targetDate")}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          data-testid="button-submit-prototype"
        >
          {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Create Prototype
        </Button>
      </div>
    </form>
  );
}
