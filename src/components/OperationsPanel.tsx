import { Activity, Clock3, Database, RefreshCw, ServerCog, Zap } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { expireHolds, fetchOpsStatus, LIVE_REFETCH_MS, pushSupplierDelta, syncInventoryUpdate } from "@/lib/api";

type SupplierEvent = {
  supplier: string;
  event_type: string;
  status?: string;
  count: number;
  latest_event?: string;
};

const OperationsPanel = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["ops-status"],
    queryFn: fetchOpsStatus,
    refetchInterval: LIVE_REFETCH_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const supplierMutation = useMutation({
    mutationFn: pushSupplierDelta,
    onSuccess: () => {
      toast.success("Supplier delta indexed", {
        description: "Search cache was invalidated and inventory was updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["ops-status"] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => toast.error("Supplier event failed"),
  });

  const syncMutation = useMutation({
    mutationFn: syncInventoryUpdate,
    onSuccess: (data) => {
      toast.success("ARI sync indexed", {
        description: `${data.affectedDates} dates were overwritten from the channel-manager feed.`,
      });
      queryClient.invalidateQueries({ queryKey: ["ops-status"] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => toast.error("ARI sync failed"),
  });

  const expireMutation = useMutation({
    mutationFn: expireHolds,
    onSuccess: (data) => {
      toast.success("Hold worker ran", {
        description: `${data.expired} expired holds were released back to inventory.`,
      });
      queryClient.invalidateQueries({ queryKey: ["ops-status"] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => toast.error("Hold expiry failed"),
  });

  return (
    <section id="architecture" className="bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-accent">OTA architecture console</span>
            <h2 className="font-display text-4xl text-foreground md:text-5xl">Inventory, cache, and booking control plane</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-lg gradient-cta" disabled={supplierMutation.isPending} onClick={() => supplierMutation.mutate()}>
              <RefreshCw className="size-4" />
              Supplier delta
            </Button>
            <Button variant="outline" className="rounded-lg" disabled={syncMutation.isPending} onClick={() => syncMutation.mutate()}>
              <Database className="size-4" />
              ARI sync
            </Button>
            <Button variant="outline" className="rounded-lg" disabled={expireMutation.isPending} onClick={() => expireMutation.mutate()}>
              <Clock3 className="size-4" />
              Expire holds
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <Zap className="mb-4 size-5 text-accent" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Search cache</p>
            <p className="mt-2 text-3xl font-bold">{isLoading ? "-" : data?.cache?.entries ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">entries, {data?.cache?.ttlMs ?? 15000}ms TTL</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <Database className="mb-4 size-5 text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inventory index</p>
            <p className="mt-2 text-3xl font-bold">{data?.inventory?.indexed_days ?? "-"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{data?.inventory?.sellable_room_nights ?? "-"} sellable room nights</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <Activity className="mb-4 size-5 text-success" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reservations</p>
            <p className="mt-2 text-3xl font-bold">
              {data?.reservations?.reduce((sum: number, item: { count: number }) => sum + Number(item.count), 0) ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">holds and confirmed bookings</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <ServerCog className="mb-4 size-5 text-accent" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Supplier events</p>
            <p className="mt-2 text-3xl font-bold">
              {data?.supplierEvents?.reduce((sum: number, item: { count: number }) => sum + Number(item.count), 0) ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">normalized deltas</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 font-semibold">Service map</h3>
            <div className="space-y-3">
              {(data?.services || []).map((service: { name: string; status: string; backingStore?: string; consistency?: string; queue?: string }) => (
                <div key={service.name} className="flex items-start justify-between gap-4 rounded-md bg-muted/50 p-3">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.backingStore || service.consistency || service.queue}</p>
                  </div>
                  <span className="rounded bg-success px-2 py-1 text-[10px] font-bold uppercase text-success-foreground">{service.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 font-semibold">Recent supplier pipeline events</h3>
            <div className="space-y-3">
              {(data?.supplierEvents?.length ? data.supplierEvents : [{ supplier: "No events yet", event_type: "Run the simulator", count: 0 }]).map(
                (event: SupplierEvent) => (
                  <div key={`${event.supplier}-${event.event_type}`} className="rounded-md bg-muted/50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{event.supplier}</p>
                      <span className="text-xs font-semibold text-muted-foreground">{event.count}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{event.event_type}{event.status ? ` - ${event.status}` : ""}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OperationsPanel;
