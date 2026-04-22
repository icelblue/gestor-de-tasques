import type { Dict } from "@/lib/gt/i18n";
import { todayISO, parseTextLines } from "@/lib/gt/utils";
import { GhostBtn } from "./buttons";
import { showToast } from "./Toast";
import { RichNotes } from "./RichNotes";

interface Props {
  T: Dict;
  text: string;
  setText: (t: string) => void;
  onCreateTasks: () => void;
}

/**
 * Meeting notes panel. The editor is a rich contentEditable that accepts
 * pasted screenshots interleaved with text. The serialized value (HTML)
 * is stored as `text`. For task parsing we strip HTML tags first.
 */
export function NotesPanel({ T, text, setText, onCreateTasks }: Props) {
  // For symbol insertion + parsing we need the plain-text version.
  const plain = htmlToPlain(text);

  const insertChar = (c: string) => {
    // Append character to the end (caret-aware insert via execCommand).
    const sel = window.getSelection();
    const editor = document.querySelector<HTMLDivElement>(".rich-notes");
    if (editor && sel && sel.anchorNode && editor.contains(sel.anchorNode)) {
      document.execCommand("insertText", false, c);
      // emit happens onInput
    } else {
      // Fallback: append to end
      setText((text || "") + c);
    }
  };

  const copyFriendly = () => {
    const out = plain.split("\n").map((l) => {
      const tr = l.trim();
      if (!tr || tr.startsWith("#")) return tr;
      if (tr.includes("|")) {
        const p = tr.split("|").map((s) => s.trim());
        let r = "• " + p[0];
        if (p[1]) r += `  [${p[1]}]`;
        if (p[2]) r += `  📅 ${p[2]}`;
        if (p[3]) r += `  #${p[3]}`;
        return r;
      }
      return "• " + tr;
    }).join("\n");
    navigator.clipboard?.writeText(out).then(() => showToast(T.notesCopyFriendly + " ✓", "success"));
  };

  const downloadCSV = () => {
    const parsed = parseTextLines(plain);
    if (!parsed.length) { showToast(T.notesNoTasks, "error"); return; }
    const BOM = "\uFEFF";
    const header = ["Name", "Priority", "Date", "Tag"].join(";");
    const rows = parsed.map((p) =>
      [p.name, p.priority, p.date ?? "", p.tag].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")
    );
    const blob = new Blob([BOM + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `notes-${todayISO()}.csv`;
    a.click();
  };

  const imgCount = (text.match(/<img\s/gi) || []).length;

  return (
    <section className="flex h-full flex-col gap-2 p-3">
      <header className="flex items-center justify-between gap-2">
        <h3 className="font-display text-xs uppercase tracking-[2px]" style={{ color: "var(--primary)" }}>
          {T.notesTitle}
        </h3>
        <div className="flex flex-wrap gap-1">
          <GhostBtn onClick={copyFriendly}>{T.notesCopyFriendly}</GhostBtn>
          <GhostBtn onClick={downloadCSV}>{T.notesDownload}</GhostBtn>
          <GhostBtn
            onClick={onCreateTasks}
            style={{ color: "var(--primary)", borderColor: "var(--primary)", fontWeight: 600 }}
          >
            {T.notesCreateTasks}
          </GhostBtn>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-1">
        <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{T.notesInsert}</span>
        {["|", "#", "·", "→", "✓", "✗"].map((c) => (
          <button
            key={c}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertChar(c); }}
            className="grid h-6 w-6 place-items-center rounded-sm border font-mono text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            {c}
          </button>
        ))}
      </div>

      <RichNotes
        value={text}
        onChange={setText}
        placeholder={T.notesPlaceholder}
        minHeight={200}
        style={{ flex: 1 }}
      />

      <p className="font-mono text-[9px] tracking-wider" style={{ color: "var(--text-faint)" }}>
        {plain.length} chars · {imgCount} img · {T.notesPasteHint}
      </p>
    </section>
  );
}

/** Strip HTML for plain-text operations (parsing, CSV, friendly copy). */
function htmlToPlain(html: string): string {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  // Replace <br> and block boundaries with newlines
  tmp.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  tmp.querySelectorAll("div, p").forEach((b) => {
    b.appendChild(document.createTextNode("\n"));
  });
  // Drop inline images for text purposes
  tmp.querySelectorAll("img").forEach((i) => i.remove());
  return (tmp.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
}
