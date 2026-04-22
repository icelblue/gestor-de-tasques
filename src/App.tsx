import { useMemo, useState } from "react";
import { DICTS, LANGS } from "@/lib/gt/i18n";
import type { FilterMode, Lang, Task } from "@/lib/gt/types";
import { useLangStore, useLinksStore, useNotesStore, useTasksStore } from "@/lib/gt/store";
import { htmlToPlain, parseTextLines, splitTags, uid } from "@/lib/gt/utils";
import { TaskList } from "@/components/gt/TaskList";
import { TaskModal } from "@/components/gt/TaskModal";
import { NotesPanel } from "@/components/gt/NotesPanel";
import { LinksPanel } from "@/components/gt/LinksPanel";
import { CalendarPanel } from "@/components/gt/CalendarPanel";
import { TagLegend } from "@/components/gt/TagLegend";
import { ReportModal } from "@/components/gt/ReportModal";
import { ImportModal } from "@/components/gt/ImportModal";
import { HelpModal } from "@/components/gt/HelpModal";
import { BackupModal } from "@/components/gt/BackupModal";
import { ToastHost, showToast } from "@/components/gt/Toast";

type ModalKind = null | "task" | "report" | "import" | "help" | "backup";

export default function App() {
  const { lang, setLang } = useLangStore();
  const T = DICTS[lang];

  const tasksStore = useTasksStore();
  const notesStore = useNotesStore();
  const linksStore = useLinksStore();

  const [filter, setFilter] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [dayFilter, setDayFilter] = useState<string | null>(null);
  const [managingTags, setManagingTags] = useState(false);

  const [modal, setModal] = useState<ModalKind>(null);
  const [editing, setEditing] = useState<Task | null>(null);

  const stats = useMemo(() => {
    const t = tasksStore.tasks;
    const total = t.length;
    const done = t.filter((x) => x.status === "feta").length;
    const today = t.filter((x) => {
      if (!x.date || x.status === "feta") return false;
      const d = new Date(x.date + "T00:00:00");
      const now = new Date(); now.setHours(0, 0, 0, 0);
      return d.getTime() === now.getTime();
    }).length;
    const urgent = t.filter((x) => {
      if (!x.date || x.status === "feta") return false;
      const d = new Date(x.date + "T00:00:00");
      const now = new Date(); now.setHours(0, 0, 0, 0);
      const diff = (d.getTime() - now.getTime()) / 86400000;
      return diff <= 1;
    }).length;
    return { total, done, pending: total - done, today, urgent };
  }, [tasksStore.tasks]);

  const siblings = useMemo(() => {
    if (!editing?.seriesId) return [];
    return tasksStore.tasks.filter((t) => t.seriesId === editing.seriesId);
  }, [editing, tasksStore.tasks]);

  const openNew = () => { setEditing(null); setModal("task"); };
  const openEdit = (t: Task) => { setEditing(t); setModal("task"); };

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <ToastHost />

      <div
        className="flex flex-wrap items-center gap-3 border-b px-6 py-2 font-mono text-[11px]"
        style={{
          borderColor: "color-mix(in oklab, var(--info) 30%, var(--border))",
          background: "color-mix(in oklab, var(--info) 12%, var(--surface))",
          color: "var(--info)",
        }}
      >
        <span>💾</span>
        <span dangerouslySetInnerHTML={{ __html: T.bannerText }} />
        <button
          onClick={() => setModal("backup")}
          className="rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
          style={{ borderColor: "var(--info)", color: "var(--info)", background: "transparent" }}
        >
          ↗ {T.backupBtn}
        </button>
        <div className="ml-auto flex items-center gap-2">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as Lang)}
              className="rounded-sm border px-2 py-0.5 text-[10px] uppercase"
              style={{
                borderColor: lang === l ? "var(--primary)" : "var(--border)",
                background: lang === l ? "var(--primary)" : "transparent",
                color: lang === l ? "var(--primary-foreground)" : "var(--text-faint)",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <header
        className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="min-w-0">
          <h1
            className="font-display flex flex-wrap items-baseline gap-x-3 leading-none"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "0.04em" }}
          >
            <span style={{ color: "var(--foreground)" }}>GT</span>
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px var(--muted-foreground)" }}>
              {T.headerOutline}
            </span>
            <span style={{ color: "var(--primary)" }}>{T.headerAccent}</span>
          </h1>
          <p className="mt-2 font-mono text-[10px] tracking-[2px]" style={{ color: "var(--text-faint)" }}>
            {T.appSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
          <StatChip label={T.total} value={stats.total} active={filter === "all"} onClick={() => { setFilter("all"); setDayFilter(null); }} />
          <StatChip label={T.pending} value={stats.pending} active={filter === "pending"} onClick={() => setFilter(filter === "pending" ? "all" : "pending")} />
          <StatChip label={T.done} value={stats.done} active={filter === "done"} onClick={() => setFilter(filter === "done" ? "all" : "done")} />
          <StatChip label={T.today} value={stats.today} active={filter === "today"} onClick={() => setFilter(filter === "today" ? "all" : "today")} />
          <StatChip label={T.urgent} value={stats.urgent} active={filter === "urgent"} color="var(--urgent)" onClick={() => setFilter(filter === "urgent" ? "all" : "urgent")} />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={openNew} className="rounded-sm px-3 py-2 font-mono text-xs font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>{T.newTask}</button>
          <button onClick={() => setModal("import")} className="rounded-sm border px-3 py-2 font-mono text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>{T.importBtn}</button>
          <button onClick={() => setModal("report")} className="rounded-sm border px-3 py-2 font-mono text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>{T.reportBtn}</button>
          <button onClick={() => setModal("backup")} className="rounded-sm border px-3 py-2 font-mono text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>{T.backupBtn}</button>
          <button onClick={() => setModal("help")} className="rounded-sm border px-3 py-2 font-mono text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>{T.helpBtn}</button>
        </div>
      </header>

      <div className="grid gap-px" style={{ gridTemplateColumns: "minmax(0, 1fr) 360px", background: "var(--border)" }}>
        <main style={{ background: "var(--background)" }}>
          <div className="border-b p-4" style={{ borderColor: "var(--border)" }}>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={T.searchPH}
              className="w-full rounded-sm border bg-transparent px-3 py-2 font-mono text-sm outline-none"
              style={{ borderColor: "var(--border)" }} />
            {(tagFilter || dayFilter || filter !== "all") ? (
              <button onClick={() => { setTagFilter(null); setDayFilter(null); setFilter("all"); }}
                className="mt-2 font-mono text-[10px] underline" style={{ color: "var(--text-faint)" }}>
                ✕ {T.showAll}
              </button>
            ) : null}
          </div>
          <TaskList T={T} lang={lang} tasks={tasksStore.tasks} filter={filter} search={search}
            tagFilter={tagFilter} dayFilter={dayFilter} onEdit={openEdit}
            onToggleDone={(t) => tasksStore.upsert({ ...t, status: t.status === "feta" ? "pendent" : "feta" })}
            onDelete={(t) => tasksStore.remove(t.id)} onReorder={tasksStore.reorder}
            onFilterTag={(tg) => setTagFilter(tagFilter === tg ? null : tg)} />
        </main>

        <aside className="flex flex-col" style={{ background: "var(--background)" }}>
          <NotesPanel T={T} text={notesStore.text} setText={notesStore.setText}
            onCreateTasks={() => {
              const parsed = parseTextLines(htmlToPlain(notesStore.text));
              if (!parsed.length) { showToast(T.notesNoTasks, "error"); return; }
              tasksStore.append(parsed.map((p) => ({
                id: uid(), name: p.name, priority: p.priority, date: p.date,
                status: "pendent", tag: p.tag, notes: "", images: [], order: 0,
              })));
              showToast(T.notesCreated(parsed.length), "success");
            }} />
          <CalendarPanel T={T} tasks={tasksStore.tasks} selected={dayFilter} onSelect={setDayFilter} />
          <TagLegend T={T} tasks={tasksStore.tasks} active={tagFilter}
            onToggle={(tg) => setTagFilter(tagFilter === tg ? null : tg)}
            managing={managingTags} setManaging={setManagingTags}
            onDeleteTag={(tg) => {
              tasksStore.replaceAll(tasksStore.tasks.map((t) => ({
                ...t, tag: splitTags(t.tag).filter((x) => x.toLowerCase() !== tg.toLowerCase()).join("; "),
              })));
              if (tagFilter === tg) setTagFilter(null);
            }} />
          <LinksPanel T={T} links={linksStore.links} setLinks={linksStore.setLinks} />
        </aside>
      </div>

      {modal === "task" ? (
        <TaskModal T={T} task={editing} siblings={siblings}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={(main, extras) => {
            if (editing) tasksStore.upsert(main);
            else tasksStore.append([main]);
            if (extras.length) tasksStore.append(extras);
          }}
          onDelete={(id) => tasksStore.remove(id)}
          onDeleteSeries={(seriesId) => {
            const ids = tasksStore.tasks.filter((t) => t.seriesId === seriesId && t.id !== editing?.id).map((t) => t.id);
            tasksStore.removeMany(ids);
          }} />
      ) : null}
      {modal === "import" ? <ImportModal T={T} onClose={() => setModal(null)} onImport={(ts) => tasksStore.append(ts)} /> : null}
      {modal === "report" ? <ReportModal T={T} lang={lang} tasks={tasksStore.tasks} onClose={() => setModal(null)} /> : null}
      {modal === "help" ? <HelpModal T={T} onClose={() => setModal(null)} /> : null}
      {modal === "backup" ? (
        <BackupModal T={T} tasks={tasksStore.tasks} onClose={() => setModal(null)}
          onReplace={(ts) => tasksStore.replaceAll(ts)} onClear={() => tasksStore.replaceAll([])} />
      ) : null}
    </div>
  );
}

function StatChip({ label, value, active, color, onClick }: { label: string; value: number; active?: boolean; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-sm border px-2 py-1 transition-colors"
      style={{
        borderColor: active ? "var(--primary)" : "var(--border)",
        background: active ? "color-mix(in oklab, var(--primary) 20%, transparent)" : "transparent",
        color: color || (active ? "var(--primary)" : "var(--muted-foreground)"),
      }}>
      <span className="font-display text-base">{value}</span>{" "}
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </button>
  );
}
