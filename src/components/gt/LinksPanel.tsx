import { useState } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { LinkItem } from "@/lib/gt/types";
import { todayISO, uid } from "@/lib/gt/utils";
import { GhostBtn } from "./buttons";
import { showToast } from "./Toast";

interface Props {
  T: Dict;
  links: LinkItem[];
  setLinks: (l: LinkItem[]) => void;
}

export function LinksPanel({ T, links, setLinks }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const add = () => {
    const u = url.trim();
    if (!u) return;
    const full = u.startsWith("http") ? u : "https://" + u;
    setLinks([...links, { id: uid(), url: full, title: title.trim() || full, addedAt: todayISO() }]);
    setUrl(""); setTitle("");
  };

  return (
    <section className="border-t p-3" style={{ borderColor: "var(--border)" }}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-[2px]" style={{ color: "var(--primary)" }}>
          {T.linksTitle} {links.length ? <span className="ml-2 font-mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>{links.length}</span> : null}
        </h3>
        <span style={{ color: "var(--text-faint)" }}>{open ? "▴" : "▾"}</span>
      </button>

      {open ? (
        <div className="mt-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder={T.linksUrlPH}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-sm border bg-transparent px-2 py-1 font-mono text-xs"
            style={{ borderColor: "var(--border)" }}
          />
          <div className="flex gap-1">
            <input
              type="text"
              placeholder={T.linksTitlePH}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-sm border bg-transparent px-2 py-1 font-mono text-xs"
              style={{ borderColor: "var(--border)" }}
            />
            <button
              onClick={add}
              className="rounded-sm px-3 font-mono text-xs"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >+</button>
          </div>

          {links.length > 0 ? (
            <div className="scrollbar-thin flex max-h-48 flex-col gap-1 overflow-auto">
              {links.map((l) => (
                <div key={l.id}
                  className="flex items-center gap-1 rounded-sm border p-1.5"
                  style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
                >
                  <a href={l.url} target="_blank" rel="noopener" className="min-w-0 flex-1">
                    <div className="truncate font-mono text-[10px]" style={{ color: "var(--primary)" }}>{l.title}</div>
                    <div className="truncate font-mono text-[8px]" style={{ color: "var(--text-faint)" }}>{l.url}</div>
                  </a>
                  <button onClick={() => setLinks(links.filter((x) => x.id !== l.id))}
                    className="text-xs" style={{ color: "var(--text-faint)" }}>✕</button>
                </div>
              ))}
              <GhostBtn
                onClick={() => {
                  const text = links.map((l) => `🔗 ${l.title}\n   ${l.url}`).join("\n\n");
                  navigator.clipboard?.writeText(text).then(() => showToast("📋 ✓", "success"));
                }}
              >📋 {T.linksCopy}</GhostBtn>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
