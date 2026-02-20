import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertPrototypeSchema, AREAS, type InsertPrototype, type Prototype } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))}
        className="space-y-4"
        data-testid="form-edit-prototype"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-edit-name" />
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
                  <SelectTrigger data-testid="select-edit-area">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AREAS.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
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
                <Input {...field} data-testid="input-edit-owner" />
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
                <Input type="date" {...field} data-testid="input-edit-target-date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
    </Form>
  );
}
