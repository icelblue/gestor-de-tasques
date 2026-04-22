import { useMemo, useState } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { Task } from "@/lib/gt/types";
import { dateUrgency, parseISO, ymd } from "@/lib/gt/utils";

interface Props {
  T: Dict;
  tasks: Task[];
  selected: string | null;
  onSelect: (day: string | null) => void;
}

export function CalendarPanel({ T, tasks, selected, onSelect }: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const startDow = (first.getDay() + 6) % 7; // Monday-first
    const cells: Array<{ date: Date | null; iso: string | null }> = [];
    for (let i = 0; i < startDow; i++) cells.push({ date: null, iso: null });
    for (let d = 1; d <= last.getDate(); d++) {
      const dt = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      cells.push({ date: dt, iso: ymd(dt) });
    }
    while (cells.length % 7) cells.push({ date: null, iso: null });
    return cells;
  }, [cursor]);

  const tasksByDay = useMemo(() => {
    const m = new Map<string, Task[]>();
    for (const t of tasks) {
      if (!t.date) continue;
      const list = m.get(t.date) ?? [];
      list.push(t);
      m.set(t.date, list);
    }
    return m;
  }, [tasks]);

  const today = ymd(new Date());

  return (
    <section className="border-t p-3" style={{ borderColor: "var(--border)" }}>
      <header className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-[2px]" style={{ color: "var(--primary)" }}>
          {T.calTitle}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-sm border px-2 py-0.5 text-xs"
            style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}
          >‹</button>
          <span className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
            {T.monthNames[cursor.getMonth()]} {cursor.getFullYear()}
          </span>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rounded-sm border px-2 py-0.5 text-xs"
            style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}
          >›</button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-px font-mono text-[9px]" style={{ color: "var(--text-faint)" }}>
        {[1, 2, 3, 4, 5, 6, 0].map((d) => (
          <div key={d} className="px-1 py-1 text-center uppercase">{T.dayNamesShort[d]}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {grid.map((c, i) => {
          if (!c.date) return <div key={i} />;
          const dayTasks = tasksByDay.get(c.iso!) ?? [];
          const hasUrgent = dayTasks.some((t) => {
            const u = dateUrgency(t.date, t.status);
            return u === "overdue" || u === "urgent";
          });
          const allDone = dayTasks.length > 0 && dayTasks.every((t) => t.status === "feta");
          const isToday = c.iso === today;
          const isSelected = selected === c.iso;
          return (
            <button
              key={i}
              onClick={() => onSelect(isSelected ? null : c.iso!)}
              className="aspect-square rounded-sm border text-left"
              style={{
                background: isSelected ? "var(--primary)" : "var(--surface-2)",
                color: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
                borderColor: isToday ? "var(--primary)" : "var(--border)",
                padding: 4,
              }}
            >
              <div className="flex items-start justify-between font-mono text-[10px]">
                <span style={{ fontWeight: isToday ? 700 : 400 }}>{c.date.getDate()}</span>
                {dayTasks.length ? (
                  <span
                    className="rounded-full px-1 text-[8px]"
                    style={{
                      background: hasUrgent ? "var(--urgent)" : allDone ? "var(--done)" : "var(--info)",
                      color: "#fff",
                    }}
                  >
                    {dayTasks.length}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between font-mono text-[9px]" style={{ color: "var(--text-faint)" }}>
        <span>{T.calLegend}</span>
        {selected ? (
          <button onClick={() => onSelect(null)} className="underline">{T.calClearDay}</button>
        ) : null}
      </div>
    </section>
  );
}

void parseISO;
