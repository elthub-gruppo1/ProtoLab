import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTestCaseSchema, TEST_TYPES, type InsertTestCase } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const typeLabels: Record<string, string> = {
  FUNCTIONAL: "Functional",
  ENVIRONMENTAL: "Environmental",
  INTEGRATION: "Integration",
};

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
        className="space-y-4"
        data-testid="form-create-test"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Thermal resistance at 200C"
                  {...field}
                  data-testid="input-test-title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-test-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TEST_TYPES.map((type) => (
                    <SelectItem key={type} value={type} data-testid={`option-type-${type}`}>
                      {typeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
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
    </Form>
  );
}
