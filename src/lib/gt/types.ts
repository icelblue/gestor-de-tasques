// Domain types

export type Priority = 1 | 2 | 3 | 4 | 5;
export type TaskStatus = "pendent" | "feta";
export type Lang = "ca" | "es" | "en";

export type Frequency = "daily" | "weekly" | "biweekly" | "monthly";
export type EndType = "count" | "date" | "never";

export interface Recurrence {
  enabled: boolean;
  frequency: Frequency;
  /** 0=Sunday … 6=Saturday — used by weekly/biweekly */
  days: number[];
  endType: EndType;
  /** number of EXTRA occurrences (not counting the initial date) */
  count: number;
  /** ISO yyyy-mm-dd inclusive end date */
  endDate: string;
}

export interface NoteImage {
  id: string;
  data: string; // base64 dataURL
  addedAt: string;
}

export interface Task {
  id: string;
  name: string;
  priority: Priority;
  /** ISO yyyy-mm-dd or null */
  date: string | null;
  status: TaskStatus;
  /** "; "-separated tags */
  tag: string;
  notes: string;
  images: NoteImage[];
  order: number;
  /** id linking sibling instances of a recurring series */
  seriesId?: string;
}

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  addedAt: string;
}

export type FilterMode = "all" | "today" | "week" | "pending" | "done" | "urgent";
