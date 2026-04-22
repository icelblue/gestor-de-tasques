import { useMemo, useState } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { Task } from "@/lib/gt/types";
import { Modal } from "./Modal";
import { GhostBtn, PrimaryBtn, SecondaryBtn } from "./buttons";
import { fmtDate, parseISO, splitTags, todayISO } from "@/lib/gt/utils";
import { showToast } from "./Toast";

interface Props {
  T: Dict;
  lang: "ca" | "es" | "en";
  tasks: Task[];
  onClose: () => void;
}

export function ReportModal({ T, lang, tasks, onClose }: Props) {
  const monthsAvailable = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) if (t.date) set.add(t.date.slice(0, 7));
    return Array.from(set).sort().reverse();
  }, [tasks]);

  const [selected, setSelected] = useState<string | null>(monthsAvailable[0] ?? null);

  const monthTasks = useMemo(() => {
    if (!selected) return [];
    return tasks.filter((t) => t.date?.startsWith(selected));
  }, [tasks, selected]);

  const stats = useMemo(() => {
    const total = monthTasks.length;
    const done = monthTasks.filter((t) => t.status === "feta").length;
    return { total, done, pending: total - done };
  }, [monthTasks]);

  const grouped = useMemo(() => {
    const byTag: Record<string, Task[]> = { __none__: [] };
    for (const t of monthTasks) {
      const tags = splitTags(t.tag);
      if (tags.length === 0) byTag.__none__.push(t);
      else for (const tg of tags) {
        (byTag[tg] = byTag[tg] || []).push(t);
      }
    }
    return byTag;
  }, [monthTasks]);

  const monthLabel = (yyyymm: string) => {
    const [y, m] = yyyymm.split("-").map(Number);
    return `${T.monthNames[m - 1]} ${y}`;
  };

  const friendly = () => {
    if (!selected) return "";
    const lines: string[] = [];
    lines.push(`📊 ${T.reportTitle} — ${monthLabel(selected)}`);
    lines.push("");
    lines.push(`${T.reportTotal}: ${stats.total}  ·  ${T.reportDone}: ${stats.done}  ·  ${T.reportPending}: ${stats.pending}`);
    lines.push("");
    for (const tag of Object.keys(grouped).sort()) {
      const items = grouped[tag];
      if (!items.length) continue;
      lines.push(T.reportSection(tag === "__none__" ? "—" : tag));
      for (const t of items) {
        const mark = t.status === "feta" ? "✓" : "○";
        const date = t.date ? ` · ${fmtDate(t.date, lang)}` : "";
        lines.push(`  ${mark} ${t.name}${date}`);
      }
      lines.push("");
    }
    return lines.join("\n").trim();
  };

  const copyFriendly = () => {
    navigator.clipboard?.writeText(friendly()).then(() => showToast(T.reportCopied, "success"));
  };

  const exportCSV = () => {
    if (!selected) return;
    const BOM = "\uFEFF";
    const header = ["Name", "Status", "Priority", "Date", "Tags", "Notes"].join(";");
    const rows = monthTasks.map((t) =>
      [t.name, t.status, t.priority, t.date ?? "", t.tag, (t.notes || "").replace(/\n/g, " ↵ ")]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")
    );
    const blob = new Blob([BOM + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `report-${selected}-${todayISO()}.csv`;
    a.click();
  };

  return (
    <Modal
      title={T.reportTitle}
      width="720px"
      onClose={onClose}
      footer={
        <>
          {selected ? (
            <>
              <GhostBtn onClick={copyFriendly}>{T.reportCopyFriendly}</GhostBtn>
              <GhostBtn onClick={exportCSV}>{T.reportExportCsv}</GhostBtn>
            </>
          ) : null}
          <SecondaryBtn onClick={onClose}>{T.btnCancel}</SecondaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-4 px-5 py-4">
        <p className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{T.reportSub}</p>

        {monthsAvailable.length === 0 ? (
          <div className="rounded-sm border p-4 text-center font-mono text-xs"
            style={{ borderColor: "var(--border)", background: "var(--surface-2)", color: "var(--text-faint)" }}>
            {T.reportNoMonths}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-1">
              {monthsAvailable.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelected(m)}
                  className="rounded-sm border px-3 py-1 font-mono text-xs uppercase"
                  style={{
                    background: selected === m ? "var(--primary)" : "transparent",
                    color: selected === m ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    borderColor: selected === m ? "var(--primary)" : "var(--border)",
                  }}
                >
                  {monthLabel(m)}
                </button>
              ))}
            </div>

            {selected ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <Stat label={T.reportTotal} value={stats.total} />
                  <Stat label={T.reportDone} value={stats.done} color="var(--done)" />
                  <Stat label={T.reportPending} value={stats.pending} color="var(--warning)" />
                </div>

                <div className="scrollbar-thin max-h-[40vh] overflow-auto rounded-sm border p-3 font-mono text-xs"
                  style={{ borderColor: "var(--border)", background: "var(--surface-2)", whiteSpace: "pre-wrap" }}>
                  {friendly()}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </Modal>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-sm border p-3 text-center"
      style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
      <div className="font-display text-2xl" style={{ color: color || "var(--primary)" }}>{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{label}</div>
    </div>
  );
}

void parseISO;
