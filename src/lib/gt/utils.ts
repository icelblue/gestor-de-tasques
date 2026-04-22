import type { Lang, Priority, Task } from "./types";

export const PRIORITY_COLORS: Record<Priority, string> = {
  1: "oklch(0.65 0.24 25)",   // red
  2: "oklch(0.78 0.18 50)",   // orange
  3: "oklch(0.78 0.17 75)",   // amber
  4: "oklch(0.72 0.14 240)",  // blue
  5: "oklch(0.65 0.02 250)",  // gray
};

export const PRIORITY_BG: Record<Priority, string> = {
  1: "color-mix(in oklab, oklch(0.65 0.24 25) 18%, transparent)",
  2: "color-mix(in oklab, oklch(0.78 0.18 50) 18%, transparent)",
  3: "color-mix(in oklab, oklch(0.78 0.17 75) 18%, transparent)",
  4: "color-mix(in oklab, oklch(0.72 0.14 240) 18%, transparent)",
  5: "color-mix(in oklab, oklch(0.65 0.02 250) 18%, transparent)",
};

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function todayISO(): string {
  const d = new Date();
  return ymd(d);
}

export function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Parses ISO yyyy-mm-dd as a LOCAL date (no UTC offset issues). */
export function parseISO(s: string): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!m) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function fmtDate(s: string | null, lang: Lang): string {
  if (!s) return "";
  const d = parseISO(s);
  if (!d) return s;
  if (lang === "en") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function daysLeft(s: string | null): number | null {
  if (!s) return null;
  const d = parseISO(s);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export type Urgency = "overdue" | "urgent" | "warning" | "normal" | "none";
export function dateUrgency(s: string | null, status: string): Urgency {
  if (!s || status === "feta") return "none";
  const d = daysLeft(s);
  if (d === null) return "none";
  if (d < 0) return "overdue";
  if (d <= 1) return "urgent";
  if (d <= 5) return "warning";
  return "normal";
}

/** Color for a tag, deterministic from the string (HSL → oklch). */
export function tagColor(tag: string): { bg: string; fg: string; border: string } {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash << 5) - hash + tag.charCodeAt(i);
  const hue = Math.abs(hash) % 360;
  return {
    bg: `oklch(0.32 0.07 ${hue})`,
    fg: `oklch(0.92 0.06 ${hue})`,
    border: `oklch(0.5 0.13 ${hue} / 0.5)`,
  };
}

/** Splits "feina; client" into ["feina","client"]. */
export function splitTags(t: string): string[] {
  return (t || "").split(";").map((x) => x.trim()).filter(Boolean);
}

export function allTagsCount(tasks: Task[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const tk of tasks) {
    for (const tg of splitTags(tk.tag)) {
      out[tg] = (out[tg] || 0) + 1;
    }
  }
  return out;
}

/* ──────────────── Text parsing for import / notes ──────────────── */

const PRIORITY_WORDS: Record<string, Priority> = {
  urgent: 1, urgente: 1, "1": 1,
  alta: 2, high: 2, "2": 2,
  mitjana: 3, media: 3, medium: 3, "3": 3,
  normal: 4, "4": 4,
  baixa: 5, baja: 5, low: 5, "5": 5,
};

function parsePriority(s: string): Priority {
  const k = s.trim().toLowerCase();
  return PRIORITY_WORDS[k] ?? 3;
}

/** Accepts dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd, mm/dd/yyyy (when day>12 ambiguity, EU first). */
function parseAnyDate(s: string): string | null {
  const t = s.trim();
  if (!t) return null;
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  const eu = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/.exec(t);
  if (eu) {
    let [, dd, mm, yy] = eu;
    if (yy.length === 2) yy = (Number(yy) > 50 ? "19" : "20") + yy;
    return `${yy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return null;
}

export interface ParsedRow {
  name: string;
  priority: Priority;
  date: string | null;
  tag: string;
}

export function parseTextLines(text: string): ParsedRow[] {
  const out: ParsedRow[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split("|").map((p) => p.trim());
    const [name, priStr, dateStr, tagStr] = parts;
    if (!name) continue;
    out.push({
      name,
      priority: priStr ? parsePriority(priStr) : 3,
      date: dateStr ? parseAnyDate(dateStr) : null,
      tag: tagStr || "",
    });
  }
  return out;
}

/** Parse CSV with ; or , separator, header optional. */
export function parseCSV(text: string): ParsedRow[] {
  const rows = text.split(/\r?\n/).filter((r) => r.trim());
  if (rows.length === 0) return [];
  const sep = rows[0].includes(";") ? ";" : ",";
  const out: ParsedRow[] = [];
  let start = 0;
  // Skip header if first row contains "name" / "nom" / "nombre"
  const first = rows[0].toLowerCase();
  if (/(name|nom|nombre)/.test(first)) start = 1;
  for (let i = start; i < rows.length; i++) {
    const cols = parseCsvRow(rows[i], sep);
    const [name, priStr, dateStr, tagStr] = cols;
    if (!name?.trim()) continue;
    out.push({
      name: name.trim(),
      priority: priStr ? parsePriority(priStr) : 3,
      date: dateStr ? parseAnyDate(dateStr) : null,
      tag: tagStr || "",
    });
  }
  return out;
}

function parseCsvRow(row: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (inQ) {
      if (c === '"' && row[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === sep) { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

/**
 * Strips HTML (used by notes/tasks descriptions that may contain inline images)
 * and returns plain text suitable for parsing, search and CSV export.
 */
export function htmlToPlain(html: string): string {
  if (!html) return "";
  if (typeof document === "undefined") {
    // SSR-safe fallback: regex-strip
    return html
      .replace(/<br\s*\/?>(?!\n)/gi, "\n")
      .replace(/<\/(div|p)>/gi, "\n")
      .replace(/<img[^>]*>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  tmp.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  tmp.querySelectorAll("div, p").forEach((b) => b.appendChild(document.createTextNode("\n")));
  tmp.querySelectorAll("img").forEach((i) => i.remove());
  return (tmp.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
}
