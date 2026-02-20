import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTestCaseSchema, TEST_TYPES, type InsertTestCase } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { Loader2 } from "lucide-react";

const typeOptions = TEST_TYPES.map((t) => ({
  value: t,
  label: t.charAt(0) + t.slice(1).toLowerCase(),
}));

interface TestCaseFormProps {
  prototypeId: string;
  onSuccess: () => void;
}

export function TestCaseForm({ prototypeId, onSuccess }: TestCaseFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertTestCase>({
    resolver: zodResolver(insertTestCaseSchema),
    defaultValues: {
      title: "",
      type: "FUNCTIONAL",
      prototypeId,
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const typeValue = watch("type");

  const createMutation = useMutation({
    mutationFn: async (data: InsertTestCase) => {
      const res = await apiRequest("POST", "/api/test-cases", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Test case added" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding test case",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => createMutation.mutate(data))}
      className="space-y-4"
      data-testid="form-create-test"
    >
      <InputField
        label="Title"
        placeholder="e.g. Thermal resistance at 200C"
        error={errors.title?.message}
        data-testid="input-test-title"
        {...register("title")}
      />

      <SelectField
        label="Type"
        value={typeValue}
        onValueChange={(v) => setValue("type", v as InsertTestCase["type"])}
        options={typeOptions}
        placeholder="Select type"
        error={errors.type?.message}
        data-testid="select-test-type"
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          data-testid="button-submit-test"
        >
          {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Add Test Case
        </Button>
      </div>
    </form>
  );
}
