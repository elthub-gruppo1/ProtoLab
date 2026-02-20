import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertPrototypeSchema, AREAS, type InsertPrototype } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
        className="space-y-4"
        data-testid="form-create-prototype"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Thermal Shield v2"
                  {...field}
                  data-testid="input-prototype-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-prototype-area">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AREAS.map((area) => (
                    <SelectItem key={area} value={area} data-testid={`option-area-${area}`}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Marco Rossi"
                  {...field}
                  data-testid="input-prototype-owner"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  data-testid="input-prototype-target-date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
    </Form>
  );
}
