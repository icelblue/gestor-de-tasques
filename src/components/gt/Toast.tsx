import { useEffect, useState } from "react";

interface ToastMessage {
  id: number;
  msg: string;
  type: "success" | "error" | "info";
}

let pushFn: ((m: Omit<ToastMessage, "id">) => void) | null = null;

export function showToast(msg: string, type: ToastMessage["type"] = "info") {
  pushFn?.({ msg, type });
}

export function ToastHost() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    pushFn = (m) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { ...m, id }]);
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 3200);
    };
    return () => { pushFn = null; };
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 flex-col gap-2">
      {items.map((it) => (
        <div
          key={it.id}
          className="animate-slide-up rounded-sm border px-4 py-2 font-mono text-xs shadow-lg backdrop-blur-sm"
          style={{
            background: it.type === "error"
              ? "color-mix(in oklab, var(--destructive) 25%, var(--surface))"
              : it.type === "success"
              ? "color-mix(in oklab, var(--done) 25%, var(--surface))"
              : "var(--surface-2)",
            borderColor: it.type === "error" ? "var(--destructive)"
              : it.type === "success" ? "var(--done)" : "var(--border)",
            color: "var(--foreground)",
          }}
        >
          {it.msg}
        </div>
      ))}
    </div>
  );
}
