import { useRef } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { FilterMode, Task } from "@/lib/gt/types";
import { daysLeft, dateUrgency, splitTags } from "@/lib/gt/utils";
import { TaskRow } from "./TaskRow";

interface Props {
  T: Dict;
  lang: "ca" | "es" | "en";
  tasks: Task[];
  filter: FilterMode;
  search: string;
  tagFilter: string | null;
  dayFilter: string | null;
  onEdit: (t: Task) => void;
  onToggleDone: (t: Task) => void;
  onDelete: (t: Task) => void;
  onReorder: (fromId: string, toId: string) => void;
  onFilterTag: (tag: string) => void;
}

export function TaskList(p: Props) {
  const dragId = useRef<string | null>(null);

  const filtered = p.tasks.filter((t) => {
    if (p.search) {
      const q = p.search.toLowerCase();
      const notesPlain = t.notes ? t.notes.replace(/<[^>]+>/g, " ").toLowerCase() : "";
      if (
        !t.name.toLowerCase().includes(q) &&
        !notesPlain.includes(q) &&
        !t.tag.toLowerCase().includes(q)
      ) return false;
    }
    if (p.tagFilter && !splitTags(t.tag).map((x) => x.toLowerCase()).includes(p.tagFilter.toLowerCase())) return false;
    if (p.dayFilter && t.date !== p.dayFilter) return false;
    if (p.filter === "pending" && t.status !== "pendent") return false;
    if (p.filter === "done" && t.status !== "feta") return false;
    if (p.filter === "today") {
      const dl = daysLeft(t.date);
      if (dl !== 0 || t.status === "feta") return false;
    }
    if (p.filter === "week") {
      const dl = daysLeft(t.date);
      if (dl === null || dl < 0 || dl > 7 || t.status === "feta") return false;
    }
    if (p.filter === "urgent") {
      const u = dateUrgency(t.date, t.status);
      if (u !== "urgent" && u !== "overdue") return false;
    }
    return true;
  });

  const sorted = filtered.slice().sort((a, b) => {
    if (a.status !== b.status) return a.status === "feta" ? 1 : -1;
    return (a.order ?? 0) - (b.order ?? 0);
  });

  if (sorted.length === 0) {
    const empty = p.tasks.length === 0;
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <div className="font-display text-5xl tracking-[6px]" style={{ color: "var(--text-faint)" }}>—</div>
        <p className="font-mono text-sm" style={{ color: "var(--muted-foreground)" }}>
          {empty ? p.T.emptyTitle : p.T.noMatches}
        </p>
        {empty ? (
          <p className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>{p.T.emptySub}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 p-3 sm:p-4">
      {sorted.map((t) => (
        <TaskRow
          key={t.id}
          T={p.T}
          lang={p.lang}
          task={t}
          onEdit={p.onEdit}
          onToggleDone={p.onToggleDone}
          onDelete={p.onDelete}
          onFilterTag={p.onFilterTag}
          onDragStartId={(id) => { dragId.current = id; }}
          onDropOnId={(id) => {
            const from = dragId.current;
            if (from && from !== id) p.onReorder(from, id);
            dragId.current = null;
          }}
        />
      ))}
    </div>
  );
}
