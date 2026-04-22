import { useEffect, useMemo, useRef, useState } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { Priority, Recurrence, Task, TaskStatus } from "@/lib/gt/types";
import { uid } from "@/lib/gt/utils";
import { generateRecurrenceDates } from "@/lib/gt/recurrence";
import { Modal } from "./Modal";
import { DangerBtn, PrimaryBtn, SecondaryBtn, inputStyle, labelStyle } from "./buttons";
import { RichNotes } from "./RichNotes";

interface Props {
  T: Dict;
  task: Task | null;
  /** All sibling tasks of this series (for "replace series" option). */
  siblings: Task[];
  onClose: () => void;
  onSave: (main: Task, extras: Task[]) => void;
  onDelete?: (id: string) => void;
  onDeleteSeries?: (seriesId: string) => void;
}

const DEFAULT_REC: Recurrence = {
  enabled: false,
  frequency: "weekly",
  days: [],
  endType: "count",
  count: 4,
  endDate: "",
};

/**
 * Tries to recover a previous recurrence config from sibling tasks of the same
 * series. Best-effort: we infer frequency from date deltas.
 */
function inferRecurrence(task: Task | null, siblings: Task[]): Recurrence {
  if (!task?.seriesId || siblings.length < 2) return DEFAULT_REC;
  const dated = siblings
    .filter((s) => s.date)
    .map((s) => s.date!)
    .sort();
  if (dated.length < 2) return DEFAULT_REC;
  // Compute delta in days between first two
  const a = new Date(dated[0] + "T00:00:00").getTime();
  const b = new Date(dated[1] + "T00:00:00").getTime();
  const days = Math.round((b - a) / 86400000);
  let frequency: Recurrence["frequency"] = "weekly";
  if (days <= 1) frequency = "daily";
  else if (days <= 7) frequency = "weekly";
  else if (days <= 14) frequency = "biweekly";
  else frequency = "monthly";
  return {
    enabled: false, // user must opt-in to extending the series
    frequency,
    days: [],
    endType: "count",
    count: Math.max(1, dated.length - 1),
    endDate: "",
  };
}

export function TaskModal({ T, task, siblings, onClose, onSave, onDelete, onDeleteSeries }: Props) {
  const [name, setName] = useState(task?.name ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 3);
  const [date, setDate] = useState(task?.date ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "pendent");
  const [tag, setTag] = useState(task?.tag ?? "");
  const [notes, setNotes] = useState(task?.notes ?? "");
  const [rec, setRec] = useState<Recurrence>(() => inferRecurrence(task, siblings));
  const [replaceSeries, setReplaceSeries] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => nameRef.current?.focus(), 60); }, []);

  const hasSeries = (task?.seriesId && siblings.length > 1) || false;

  const recPreview = useMemo(() => {
    if (!rec.enabled) return "";
    const sample = generateRecurrenceDates(date || new Date().toISOString().slice(0, 10), rec);
    return sample.length
      ? sample.slice(0, 4).join(", ") + (sample.length > 4 ? `, … (+${sample.length - 4})` : "")
      : "—";
  }, [rec, date]);

  function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      nameRef.current?.focus();
      return;
    }
    const data: Task = {
      id: task?.id ?? uid(),
      name: trimmed,
      priority,
      date: date || null,
      status,
      tag: tag.trim(),
      notes,
      images: [], // legacy field — images now live inside notes (HTML)
      order: task?.order ?? 0,
      seriesId: task?.seriesId,
    };

    let extras: Task[] = [];
    if (rec.enabled && date) {
      const dates = generateRecurrenceDates(date, rec);
      const seriesId = task?.seriesId ?? uid();
      data.seriesId = seriesId;
      extras = dates.map((d) => ({
        ...data,
        id: uid(),
        date: d,
        order: 0,
        status: "pendent" as TaskStatus,
      }));
    }

    if (replaceSeries && task?.seriesId && onDeleteSeries) {
      onDeleteSeries(task.seriesId);
    }
    onSave(data, extras);
    onClose();
  }

  return (
    <Modal
      title={task ? T.modalEdit : T.modalNew}
      width="720px"
      onClose={onClose}
      footer={
        <>
          {task && onDelete ? (
            <DangerBtn
              style={{ marginRight: "auto" }}
              onClick={() => {
                if (confirm(T.confirmDelete)) {
                  onDelete(task.id);
                  onClose();
                }
              }}
            >
              {T.btnDelete}
            </DangerBtn>
          ) : null}
          <SecondaryBtn onClick={onClose}>{T.btnCancel}</SecondaryBtn>
          <PrimaryBtn onClick={save}>{T.btnSave}</PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Name */}
        <Field label={T.lblName}>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={T.namePH}
            style={inputStyle}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) save();
            }}
          />
        </Field>

        {/* Priority / Date / Status */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Field label={T.lblPriority}>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value) as Priority)}
              style={inputStyle}
            >
              {[1, 2, 3, 4, 5].map((p) => (
                <option key={p} value={p}>{T.pri[p as Priority]}</option>
              ))}
            </select>
          </Field>
          <Field label={T.lblDate}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label={T.lblStatus}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              style={inputStyle}
            >
              <option value="pendent">{T.statusPendent}</option>
              <option value="feta">{T.statusFeta}</option>
            </select>
          </Field>
        </div>

        {/* Tag */}
        <Field label={T.lblTag}>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder={T.tagPH}
            style={inputStyle}
          />
        </Field>

        {/* Notes — rich editor with interleaved screenshots */}
        <Field label={T.lblNotes}>
          <RichNotes
            value={notes}
            onChange={setNotes}
            placeholder={T.notesPH}
            minHeight={140}
          />
          <p className="mt-1 font-mono text-[10px] tracking-wider" style={{ color: "var(--text-faint)" }}>
            {T.taskImgHint}
          </p>
        </Field>

        {/* Recurrence */}
        <RecurrenceEditor T={T} rec={rec} setRec={setRec} preview={recPreview} hasDate={!!date} />

        {hasSeries && rec.enabled ? (
          <label className="flex items-center gap-2 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
            <input
              type="checkbox"
              checked={replaceSeries}
              onChange={(e) => setReplaceSeries(e.target.checked)}
              style={{ accentColor: "var(--primary)" }}
            />
            {T.recReplaceSeries}
          </label>
        ) : null}
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

/* ── Recurrence editor ── */

function RecurrenceEditor({
  T, rec, setRec, preview, hasDate,
}: {
  T: Dict;
  rec: Recurrence;
  setRec: (r: Recurrence) => void;
  preview: string;
  hasDate: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-sm border p-3"
      style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
    >
      <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[2px]" style={{ color: "var(--muted-foreground)" }}>
        <input
          type="checkbox"
          checked={rec.enabled}
          onChange={(e) => setRec({ ...rec, enabled: e.target.checked })}
          style={{ accentColor: "var(--primary)", width: 16, height: 16 }}
        />
        {T.recLabel}
      </label>

      {rec.enabled ? (
        <>
          {!hasDate ? (
            <div
              className="rounded-sm border p-2 font-mono text-[11px]"
              style={{ borderColor: "var(--warning)", color: "var(--warning)" }}
            >
              {T.recValidationDate}
            </div>
          ) : null}

          {/* Frequency */}
          <div className="flex flex-wrap gap-1">
            {(["daily", "weekly", "biweekly", "monthly"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setRec({ ...rec, frequency: f })}
                className="rounded-sm border px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
                style={{
                  background: rec.frequency === f ? "var(--primary)" : "transparent",
                  color: rec.frequency === f ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  borderColor: rec.frequency === f ? "var(--primary)" : "var(--border)",
                }}
              >
                {f === "daily" ? T.recDaily : f === "weekly" ? T.recWeekly : f === "biweekly" ? T.recBiweekly : T.recMonthly}
              </button>
            ))}
          </div>

          {(rec.frequency === "weekly" || rec.frequency === "biweekly") ? (
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>
                {T.recSelectDays}
              </span>
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                  const active = rec.days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        setRec({
                          ...rec,
                          days: active ? rec.days.filter((x) => x !== d) : [...rec.days, d],
                        })
                      }
                      className="h-8 w-8 rounded-sm border font-mono text-[10px] font-semibold"
                      style={{
                        background: active ? "var(--primary)" : "transparent",
                        color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                        borderColor: active ? "var(--primary)" : "var(--border)",
                      }}
                    >
                      {T.dayNamesShort[d]}
                    </button>
                  );
                })}
              </div>
              {rec.days.length === 0 ? (
                <p className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>
                  → {T.recValidationDays}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* End */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>
              {T.recEndLabel}
            </span>
            <label className="flex items-center gap-2 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
              <input
                type="radio"
                name="rec-end"
                checked={rec.endType === "count"}
                onChange={() => setRec({ ...rec, endType: "count" })}
                style={{ accentColor: "var(--primary)" }}
              />
              {T.recAfter}
              <input
                type="number"
                min={1}
                max={366}
                value={rec.count}
                onChange={(e) => setRec({ ...rec, count: Math.max(1, Math.min(366, Number(e.target.value) || 1)) })}
                style={{ ...inputStyle, width: 70, textAlign: "center", padding: "4px 6px" }}
              />
              {T.recOccurrences}
            </label>
            <label className="flex items-center gap-2 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
              <input
                type="radio"
                name="rec-end"
                checked={rec.endType === "date"}
                onChange={() => setRec({ ...rec, endType: "date" })}
                style={{ accentColor: "var(--primary)" }}
              />
              {T.recUntil}
              <input
                type="date"
                value={rec.endDate}
                onChange={(e) => setRec({ ...rec, endType: "date", endDate: e.target.value })}
                style={{ ...inputStyle, padding: "4px 6px", width: 160 }}
              />
            </label>
          </div>

          <div
            className="rounded-sm border px-2 py-2 font-mono text-[10px]"
            style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-faint)" }}
          >
            {preview || "—"}
          </div>
        </>
      ) : null}
    </div>
  );
}
