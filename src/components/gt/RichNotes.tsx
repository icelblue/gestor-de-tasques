import { useEffect, useRef, type CSSProperties } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  style?: CSSProperties;
  onPasteText?: () => void;
}

/**
 * Rich notes editor — contentEditable that allows interleaving
 * plain text and pasted screenshots as inline <img> elements.
 *
 * The serialized value is sanitized HTML containing only:
 *   - text nodes
 *   - <br>
 *   - <div> wrappers (line breaks)
 *   - <img src="data:..."> for inline screenshots
 *
 * Anything else (scripts, styles, attributes) is stripped on input.
 */
export function RichNotes({
  value,
  onChange,
  placeholder,
  minHeight = 100,
  style,
  onPasteText,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lastValue = useRef<string>("");

  // Sync external value -> DOM (only when external change differs from what
  // we last emitted, to avoid clobbering caret while typing).
  useEffect(() => {
    if (!ref.current) return;
    if (value !== lastValue.current) {
      ref.current.innerHTML = value || "";
      lastValue.current = value || "";
    }
  }, [value]);

  const emit = () => {
    if (!ref.current) return;
    const sanitized = sanitize(ref.current);
    lastValue.current = sanitized;
    onChange(sanitized);
  };

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    const cd = e.clipboardData;
    if (!cd) return;

    // 1) Look for image files first
    const imageFiles: File[] = [];
    if (cd.items?.length) {
      for (const it of Array.from(cd.items)) {
        if (it.type?.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) imageFiles.push(f);
        }
      }
    }
    if (!imageFiles.length && cd.files?.length) {
      for (const f of Array.from(cd.files)) {
        if (f.type?.startsWith("image/")) imageFiles.push(f);
      }
    }

    if (imageFiles.length) {
      e.preventDefault();
      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const data = String(ev.target?.result || "");
          if (!data) return;
          insertImageAtCaret(data);
          emit();
        };
        reader.readAsDataURL(file);
      });
      return;
    }

    // 2) Plain text paste — strip rich formatting
    const text = cd.getData("text/plain");
    if (text) {
      e.preventDefault();
      document.execCommand("insertText", false, text);
      onPasteText?.();
      emit();
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={emit}
      onBlur={emit}
      onPaste={handlePaste}
      data-placeholder={placeholder}
      className="rich-notes scrollbar-thin"
      style={{
        minHeight,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        lineHeight: 1.55,
        padding: 10,
        borderRadius: 2,
        outline: "none",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowY: "auto",
        ...style,
      }}
    />
  );
}

/** Insert an <img> at the current caret position inside the editor. */
function insertImageAtCaret(dataUrl: string) {
  const img = document.createElement("img");
  img.src = dataUrl;
  img.alt = "screenshot";
  img.style.cssText =
    "max-width:100%;height:auto;display:block;margin:6px 0;border:1px solid var(--border);border-radius:2px;cursor:zoom-in";
  img.addEventListener("click", () => openPreview(dataUrl));

  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);
    // Move caret after the image and add a line break for typing afterwards
    const br = document.createElement("br");
    img.after(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function openPreview(src: string) {
  const ov = document.createElement("div");
  ov.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;z-index:10000;padding:24px;cursor:zoom-out";
  ov.onclick = () => ov.remove();
  const im = document.createElement("img");
  im.src = src;
  im.style.cssText = "max-width:95%;max-height:95%;object-fit:contain";
  ov.appendChild(im);
  document.body.appendChild(ov);
}

/**
 * Allow only safe nodes: text, <br>, <div>, <img src="data:..." or http(s)>.
 * Strips attributes other than src/alt on <img>, and removes everything else.
 */
function sanitize(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement;
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);
  const toRemove: Element[] = [];
  let el = walker.nextNode() as Element | null;
  while (el) {
    const tag = el.tagName.toLowerCase();
    if (tag === "img") {
      const src = (el as HTMLImageElement).getAttribute("src") || "";
      const safeSrc = /^(data:image\/|https?:\/\/)/.test(src) ? src : "";
      // wipe all attributes
      for (const attr of Array.from(el.attributes)) el.removeAttribute(attr.name);
      if (!safeSrc) {
        toRemove.push(el);
      } else {
        el.setAttribute("src", safeSrc);
        el.setAttribute(
          "style",
          "max-width:100%;height:auto;display:block;margin:6px 0;border:1px solid var(--border);border-radius:2px;cursor:zoom-in",
        );
      }
    } else if (tag === "br" || tag === "div" || tag === "p") {
      // Keep structural tags but wipe attrs
      for (const attr of Array.from(el.attributes)) el.removeAttribute(attr.name);
      if (tag === "p") {
        // convert <p> to <div>
        const div = document.createElement("div");
        while (el.firstChild) div.appendChild(el.firstChild);
        el.replaceWith(div);
      }
    } else if (tag === "span" || tag === "font" || tag === "b" || tag === "i" || tag === "u" || tag === "strong" || tag === "em") {
      // unwrap inline formatting
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        toRemove.push(el);
      }
    } else {
      toRemove.push(el);
    }
    el = walker.nextNode() as Element | null;
  }
  toRemove.forEach((n) => n.remove());
  return clone.innerHTML;
}

/**
 * Read-only renderer that displays a rich notes value (text + inline images),
 * with images opening on click.
 */
export function RichNotesView({ html, style }: { html: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = html || "";
    ref.current.querySelectorAll("img").forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openPreview((img as HTMLImageElement).src));
    });
  }, [html]);
  return (
    <div
      ref={ref}
      className="scrollbar-thin"
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        lineHeight: 1.55,
        color: "var(--foreground)",
        ...style,
      }}
    />
  );
}
