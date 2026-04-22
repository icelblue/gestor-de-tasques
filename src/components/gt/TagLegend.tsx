import type { Dict } from "@/lib/gt/i18n";
import type { Task } from "@/lib/gt/types";
import { allTagsCount, splitTags, tagColor } from "@/lib/gt/utils";

interface Props {
  T: Dict;
  tasks: Task[];
  active: string | null;
  onToggle: (tag: string) => void;
  managing: boolean;
  setManaging: (b: boolean) => void;
  onDeleteTag: (tag: string) => void;
}

export function TagLegend({ T, tasks, active, onToggle, managing, setManaging, onDeleteTag }: Props) {
  const counts = allTagsCount(tasks);
  const names = Object.keys(counts).sort();
  if (names.length === 0) return null;

  return (
    <section className="border-t px-4 py-3" style={{ borderColor: "var(--border)" }}>
      <header className="mb-2 flex items-center justify-between">
        <h4 className="font-mono text-[9px] uppercase tracking-[2px]" style={{ color: "var(--text-faint)" }}>
          {T.tagsLegendTitle}
        </h4>
        <button
          onClick={() => setManaging(!managing)}
          className="rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
          style={{
            borderColor: managing ? "var(--destructive)" : "var(--border)",
            color: managing ? "var(--destructive)" : "var(--text-faint)",
          }}
        >
          {managing ? T.tagsManageDone : T.tagsManage}
        </button>
      </header>
      <div className="flex flex-wrap gap-1.5">
        {names.map((name) => {
          const c = tagColor(name);
          const isActive = active?.toLowerCase() === name.toLowerCase();
          return (
            <div key={name} className="relative">
              <button
                onClick={() => onToggle(name)}
                className="rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: c.bg,
                  color: c.fg,
                  borderColor: c.border,
                  outline: isActive ? "2px solid var(--primary)" : "none",
                  outlineOffset: 1,
                }}
              >
                {name} <span className="opacity-70">{counts[name]}</span>
              </button>
              {managing ? (
                <button
                  onClick={(e) => { e.stopPropagation(); if (confirm(T.tagsConfirmDelete(name, counts[name]))) onDeleteTag(name); }}
                  className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full text-[8px]"
                  style={{ background: "var(--destructive)", color: "#fff" }}
                >✕</button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// avoid lint warning
void splitTags;
