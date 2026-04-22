import { useCallback, useEffect, useState } from "react";
import type { LinkItem, Lang, NoteImage, Task } from "./types";

const STORE_KEY = "gt_tasks_v3";
const NOTES_KEY = "gt_notes_v1";
const NOTES_IMG_KEY = "gt_notes_imgs_v1";
const LINKS_KEY = "gt_links_v1";
const LANG_KEY = "gt_lang_v1";

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or serialization error — silent
  }
}

export function useTasksStore() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = safeRead<Task[]>(STORE_KEY, []);
    // Defensive normalization in case of older payloads.
    const normalized = initial.map((t, i) => ({
      ...t,
      images: Array.isArray(t.images) ? t.images : [],
      tag: typeof t.tag === "string" ? t.tag : "",
      notes: typeof t.notes === "string" ? t.notes : "",
      order: typeof t.order === "number" ? t.order : i,
    }));
    setTasks(normalized);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    safeWrite(STORE_KEY, tasks);
  }, [tasks, hydrated]);

  const replaceAll = useCallback((next: Task[]) => setTasks(next), []);
  const upsert = useCallback((task: Task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === task.id);
      if (idx < 0) return [...prev, task];
      const copy = prev.slice();
      copy[idx] = task;
      return copy;
    });
  }, []);
  const remove = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const removeMany = useCallback((ids: string[]) => {
    const set = new Set(ids);
    setTasks((prev) => prev.filter((t) => !set.has(t.id)));
  }, []);
  const append = useCallback((extras: Task[]) => {
    setTasks((prev) => {
      const start = prev.length;
      return [...prev, ...extras.map((t, i) => ({ ...t, order: start + i }))];
    });
  }, []);
  const reorder = useCallback((fromId: string, toId: string) => {
    setTasks((prev) => {
      const fi = prev.findIndex((t) => t.id === fromId);
      const ti = prev.findIndex((t) => t.id === toId);
      if (fi < 0 || ti < 0 || fi === ti) return prev;
      const copy = prev.slice();
      const [moved] = copy.splice(fi, 1);
      copy.splice(ti, 0, moved);
      return copy.map((t, i) => ({ ...t, order: i }));
    });
  }, []);

  return { tasks, hydrated, replaceAll, upsert, remove, removeMany, append, reorder };
}

export function useNotesStore() {
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Migrate legacy plain text + image gallery into the rich HTML format.
    const stored = localStorage.getItem(NOTES_KEY) || "";
    let value = stored;
    if (stored && !/<(img|div|br|p)\b/i.test(stored)) {
      // Plain text → wrap in <div> per line for the contentEditable
      value = stored
        .split(/\n/)
        .map((l) => `<div>${escapeHtml(l) || "<br>"}</div>`)
        .join("");
    }
    // Append legacy gallery images (if any) at the end
    try {
      const legacyImgs = safeRead<NoteImage[]>(NOTES_IMG_KEY, []);
      if (legacyImgs.length) {
        value += legacyImgs
          .map((i) => `<div><img src="${i.data}" alt=""></div>`)
          .join("");
        localStorage.removeItem(NOTES_IMG_KEY);
      }
    } catch { /* ignore */ }
    setText(value);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem(NOTES_KEY, text);
  }, [text, hydrated]);

  return { text, setText, hydrated };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function useLinksStore() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setLinks(safeRead<LinkItem[]>(LINKS_KEY, []));
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    safeWrite(LINKS_KEY, links);
  }, [links, hydrated]);
  return { links, setLinks };
}

export function useLangStore() {
  const [lang, setLang] = useState<Lang>("ca");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "ca" || stored === "es" || stored === "en") setLang(stored);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);
  return { lang, setLang };
}

export const STORAGE_KEYS = { STORE_KEY, NOTES_KEY, NOTES_IMG_KEY, LINKS_KEY, LANG_KEY };
