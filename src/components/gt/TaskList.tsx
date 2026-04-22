import { useRef } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { FilterMode, Task } from "@/lib/gt/types";
import {
  PRIORITY_BG, PRIORITY_COLORS, daysLeft, dateUrgency, fmtDate, splitTags, tagColor,
} from "@/lib/gt/utils";

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
    <div className="flex flex-col gap-1.5 p-4">
      {sorted.map((t) => {
        const isDone = t.status === "feta";
        const urg = dateUrgency(t.date, t.status);
        const dl = daysLeft(t.date);
        const urgText =
          isDone || dl === null
            ? ""
            : dl < 0
              ? " " + p.T.urgOverdueFn(Math.abs(dl))
              : dl === 0
                ? " " + p.T.urgToday
                : dl === 1
                  ? " " + p.T.urgTomorrow
                  : " " + p.T.urgLeftFn(dl);
        const urgColor =
          urg === "overdue" || urg === "urgent"
            ? "var(--urgent)"
            : urg === "warning"
              ? "var(--warning)"
              : "var(--muted-foreground)";

        return (
          <div
            key={t.id}
            draggable
            onDragStart={() => { dragId.current = t.id; }}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.background = "var(--surface-3)"; }}
            onDragLeave={(e) => { e.currentTarget.style.background = ""; }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.background = "";
              const from = dragId.current;
              if (from && from !== t.id) p.onReorder(from, t.id);
              dragId.current = null;
            }}
            className="group flex items-center gap-0 rounded-sm border transition-colors hover:border-[color:var(--primary)]"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              opacity: isDone ? 0.55 : 1,
              minHeight: 60,
            }}
          >
            <div
              className="self-stretch w-1.5 shrink-0"
              style={{ background: PRIORITY_COLORS[t.priority] }}
              aria-hidden
            />
            <button
              onClick={() => p.onToggleDone(t)}
              aria-label="toggle"
              className="ml-2 grid h-7 w-7 place-items-center rounded-sm border text-xs"
              style={{
                borderColor: isDone ? "var(--done)" : "var(--border)",
                color: isDone ? "var(--done)" : "var(--muted-foreground)",
                background: isDone ? "color-mix(in oklab, var(--done) 18%, transparent)" : "transparent",
              }}
            >
              {isDone ? "✓" : "○"}
            </button>

            <div
              className="min-w-0 flex-1 cursor-pointer px-3 py-2"
              onClick={() => p.onEdit(t)}
            >
              <div
                className="truncate font-medium"
                style={{
                  textDecoration: isDone ? "line-through" : "none",
                  color: isDone ? "var(--muted-foreground)" : "var(--foreground)",
                }}
              >
                {t.name}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-sm px-1.5 font-mono text-[9px] font-bold tracking-wider"
                  style={{
                    background: PRIORITY_BG[t.priority],
                    color: PRIORITY_COLORS[t.priority],
                  }}
                >
                  {p.T.priShort[t.priority]} {p.T.priName[t.priority]}
                </span>
                {t.date ? (
                  <span
                    className={`font-mono text-[10px] ${urg === "overdue" || urg === "urgent" ? "animate-pulse-urgent font-semibold" : ""}`}
                    style={{ color: urgColor }}
                  >
                    {urg === "overdue" ? "⚠" : urg === "urgent" ? "🔴" : "📅"} {fmtDate(t.date, p.lang)}{urgText}
                  </span>
                ) : null}
                {t.seriesId ? (
                  <span className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }} title="recurrent">↻</span>
                ) : null}
                {splitTags(t.tag).map((tg) => {
                  const c = tagColor(tg);
                  return (
                    <button
                      key={tg}
                      onClick={(e) => { e.stopPropagation(); p.onFilterTag(tg); }}
                      className="rounded-full border px-2 font-mono text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: c.bg, color: c.fg, borderColor: c.border }}
                    >
                      {tg}
                    </button>
                  );
                })}
                {t.notes ? <span className="text-xs" style={{ color: "var(--text-faint)" }}>✎</span> : null}
                {countNoteImages(t.notes) > 0 ? (
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>🖼 {countNoteImages(t.notes)}</span>
                ) : null}
              </div>
            </div>

            <div className="hidden items-center gap-1 px-2 group-hover:flex">
              <button
                onClick={() => p.onEdit(t)}
                className="grid h-7 w-7 place-items-center rounded-sm border text-xs"
                style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}
              >✎</button>
              <button
                onClick={() => { if (confirm(p.T.confirmDelete)) p.onDelete(t); }}
                className="grid h-7 w-7 place-items-center rounded-sm border text-xs"
                style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}
              >🗑</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function countNoteImages(notes: string | undefined): number {
  if (!notes) return 0;
  return (notes.match(/<img\s/gi) || []).length;
}
