import { type ReactNode, useEffect } from "react";

interface ModalProps {
  title: string;
  width?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ title, width = "640px", onClose, children, footer }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up flex max-h-[92vh] w-full flex-col overflow-hidden rounded-sm border shadow-2xl"
        style={{
          maxWidth: width,
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="flex items-center justify-between border-b px-5 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="font-display text-sm uppercase tracking-[3px]" style={{ color: "var(--primary)" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm border px-2 py-1 font-mono text-xs transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}
          >
            ✕
          </button>
        </header>
        <div className="scrollbar-thin flex-1 overflow-y-auto">{children}</div>
        {footer ? (
          <footer
            className="flex flex-wrap items-center justify-end gap-2 border-t px-5 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
