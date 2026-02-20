import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PrototypeWithTests } from "@shared/schema";
import { PrototypeList } from "@/components/prototypes/PrototypeList";
import { PrototypeDetailPanel } from "@/components/prototypes/PrototypeDetailPanel";
import { PrototypeForm } from "@/components/prototypes/PrototypeForm";
import { PrototypeHeader } from "@/components/prototypes/PrototypeHeader";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Beaker } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  const { data: prototypes = [], isLoading } = useQuery<PrototypeWithTests[]>({
    queryKey: ["/api/prototypes"],
  });

  const selectedPrototype = prototypes.find((p) => p.id === selectedId) || null;

  const advanceStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/prototypes/${id}/advance`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cannot advance status",
        description: error.message.replace(/^\d+:\s*/, ""),
        variant: "destructive",
      });
    },
  });

  const updateTestResultMutation = useMutation({
    mutationFn: async ({ testId, result }: { testId: string; result: string }) => {
      const res = await apiRequest("PATCH", `/api/test-cases/${testId}`, { result });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating test result",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePrototypeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/prototypes/${id}`);
    },
    onSuccess: () => {
      if (selectedId) setSelectedId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
      toast({ title: "Prototype deleted" });
    },
  });

  const deleteTestMutation = useMutation({
    mutationFn: async (testId: string) => {
      await apiRequest("DELETE", `/api/test-cases/${testId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
    },
  });

  return (
    <div className="flex flex-col h-full">
      <PrototypeHeader
        onCreateNew={() => setShowCreateModal(true)}
        count={prototypes.length}
      />

      <div className="flex flex-1 min-h-0">
        <div className={`${selectedPrototype ? "w-1/2 border-r" : "w-full"} flex flex-col min-h-0 transition-all duration-300`}>
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </div>
          ) : prototypes.length === 0 ? (
            <EmptyState
              icon={Beaker}
              title="No prototypes yet"
              description="Create your first prototype to start tracking your R&D progress."
              actionLabel="Create Prototype"
              onAction={() => setShowCreateModal(true)}
            />
          ) : (
            <PrototypeList
              prototypes={prototypes}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </div>

        {selectedPrototype && (
          <div className="w-1/2 flex flex-col min-h-0">
            <PrototypeDetailPanel
              prototype={selectedPrototype}
              onAdvanceStatus={() => advanceStatusMutation.mutate(selectedPrototype.id)}
              isAdvancing={advanceStatusMutation.isPending}
              onUpdateTestResult={(testId, result) =>
                updateTestResultMutation.mutate({ testId, result })
              }
              onDeletePrototype={() => deletePrototypeMutation.mutate(selectedPrototype.id)}
              onDeleteTest={(testId) => deleteTestMutation.mutate(testId)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>

      <Modal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        title="New Prototype"
        description="Create a new prototype to track its development progress."
      >
        <PrototypeForm
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
          }}
        />
      </Modal>
    </div>
  );
}
