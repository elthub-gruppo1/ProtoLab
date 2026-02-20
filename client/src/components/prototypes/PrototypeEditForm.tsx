import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertPrototypeSchema, AREAS, type InsertPrototype, type Prototype } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { DateField } from "@/components/ui/date-field";
import { Loader2 } from "lucide-react";

const areaOptions = AREAS.map((a) => ({ value: a, label: a }));

interface PrototypeEditFormProps {
  prototype: Prototype;
  onSuccess: () => void;
}

export function PrototypeEditForm({ prototype, onSuccess }: PrototypeEditFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertPrototype>({
    resolver: zodResolver(insertPrototypeSchema),
    defaultValues: {
      name: prototype.name,
      area: prototype.area as InsertPrototype["area"],
      owner: prototype.owner,
      targetDate: prototype.targetDate,
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const areaValue = watch("area");

  const updateMutation = useMutation({
    mutationFn: async (data: InsertPrototype) => {
      const res = await apiRequest("PATCH", `/api/prototypes/${prototype.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Prototype updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating prototype",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
      className="space-y-4"
      data-testid="form-edit-prototype"
    >
      <InputField
        label="Name"
        error={errors.name?.message}
        data-testid="input-edit-name"
        {...register("name")}
      />

      <SelectField
        label="Area"
        value={areaValue}
        onValueChange={(v) => setValue("area", v as InsertPrototype["area"])}
        options={areaOptions}
        error={errors.area?.message}
        data-testid="select-edit-area"
      />

      <InputField
        label="Owner"
        error={errors.owner?.message}
        data-testid="input-edit-owner"
        {...register("owner")}
      />

      <DateField
        label="Target Date"
        error={errors.targetDate?.message}
        data-testid="input-edit-target-date"
        {...register("targetDate")}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          data-testid="button-submit-edit"
        >
          {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
