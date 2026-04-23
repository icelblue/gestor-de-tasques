import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { Task } from "@/lib/gt/types";
import {
  PRIORITY_BG, PRIORITY_COLORS, daysLeft, dateUrgency, fmtDate, splitTags, tagColor,
} from "@/lib/gt/utils";

interface RowProps {
  T: Dict;
  lang: "ca" | "es" | "en";
  task: Task;
  onEdit: (t: Task) => void;
  onToggleDone: (t: Task) => void;
  onDelete: (t: Task) => void;
  onFilterTag: (tag: string) => void;
  // drag-reorder (desktop)
  onDragStartId: (id: string) => void;
  onDropOnId: (id: string) => void;
}

const SWIPE_THRESHOLD = 110;

export function TaskRow(p: RowProps) {
  const { task: t } = p;
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

  // Swipe state (touch only)
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const decided = useRef<"h" | "v" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "touch") return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    decided.current = null;
    setDragging(true);
  }
  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const ddx = e.clientX - startX.current;
    const ddy = e.clientY - startY.current;
    if (decided.current === null) {
      if (Math.abs(ddx) > 8 || Math.abs(ddy) > 8) {
        decided.current = Math.abs(ddx) > Math.abs(ddy) ? "h" : "v";
      }
    }
    if (decided.current === "h") {
      // only allow swipe-left
      const next = Math.min(0, ddx);
      setDx(next);
    }
  }
  function endSwipe() {
    if (!dragging) return;
    setDragging(false);
    if (decided.current === "h" && dx <= -SWIPE_THRESHOLD) {
      // animate out then delete
      setDx(-window.innerWidth);
      setTimeout(() => {
        if (confirm(p.T.confirmDelete)) {
          p.onDelete(t);
        } else {
          setDx(0);
        }
      }, 180);
    } else {
      setDx(0);
    }
  }

  return (
    <div
      className="gt-swipe-row rounded-sm border"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        opacity: isDone ? 0.55 : 1,
      }}
      draggable
      onDragStart={() => p.onDragStartId(t.id)}
      onDragOver={(e) => { e.preventDefault(); }}
      onDrop={(e) => { e.preventDefault(); p.onDropOnId(t.id); }}
    >
      {dx < 0 ? (
        <div className="gt-swipe-bg">
          <span>← {p.T.btnDelete}</span>
        </div>
      ) : null}

      <div
        ref={cardRef}
        className={`gt-swipe-card group flex items-stretch gap-0 ${dragging ? "dragging" : ""}`}
        style={{
          transform: `translateX(${dx}px)`,
          background: "var(--surface)",
          minHeight: 60,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endSwipe}
        onPointerCancel={endSwipe}
      >
        <div
          className="self-stretch w-1.5 shrink-0"
          style={{ background: PRIORITY_COLORS[t.priority] }}
          aria-hidden
        />
        <button
          onClick={() => p.onToggleDone(t)}
          aria-label="toggle"
          className="ml-2 my-auto grid h-7 w-7 place-items-center rounded-sm border text-xs"
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
          onClick={() => { if (Math.abs(dx) < 4) p.onEdit(t); }}
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
              style={{ background: PRIORITY_BG[t.priority], color: PRIORITY_COLORS[t.priority] }}
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

        <div className="gt-task-actions hidden items-center gap-1 px-2 group-hover:flex">
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
    </div>
  );
}

function countNoteImages(notes: string | undefined): number {
  if (!notes) return 0;
  return (notes.match(/<img\s/gi) || []).length;
}
