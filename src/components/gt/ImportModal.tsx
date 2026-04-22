import { useState } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { Task } from "@/lib/gt/types";
import { Modal } from "./Modal";
import { PrimaryBtn, SecondaryBtn, inputStyle } from "./buttons";
import { parseTextLines, parseCSV, uid } from "@/lib/gt/utils";
import { showToast } from "./Toast";

interface Props {
  T: Dict;
  onClose: () => void;
  onImport: (tasks: Task[]) => void;
}

export function ImportModal({ T, onClose, onImport }: Props) {
  const [text, setText] = useState("");

  const parse = (): Task[] => {
    const txt = text.trim();
    if (!txt) return [];
    // Detect CSV by first row containing many separators
    const parsed = txt.includes(";") || /,.*,.*,/.test(txt.split("\n")[0])
      ? parseCSV(txt)
      : parseTextLines(txt);
    return parsed.map((p, i) => ({
      id: uid(),
      name: p.name,
      priority: p.priority,
      date: p.date,
      status: "pendent",
      tag: p.tag,
      notes: "",
      images: [],
      order: i,
    }));
  };

  const doImport = () => {
    const tasks = parse();
    if (!tasks.length) { showToast(T.noTasksFound, "error"); return; }
    onImport(tasks);
    showToast(T.importedFn(tasks.length), "success");
    onClose();
  };

  return (
    <Modal
      title={T.importTitle}
      width="700px"
      onClose={onClose}
      footer={
        <>
          <SecondaryBtn onClick={onClose}>{T.btnCancel}</SecondaryBtn>
          <PrimaryBtn onClick={doImport}>{T.qsCreate}</PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-3 px-5 py-4">
        <p className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{T.importHelp}</p>
        <pre
          className="scrollbar-thin overflow-auto rounded-sm border p-3 font-mono text-[11px]"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface-2)",
            color: "var(--text-faint)",
            whiteSpace: "pre-wrap",
            maxHeight: 200,
          }}
        >{T.impFormatBox}</pre>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={T.pastePH}
          style={{ ...inputStyle, minHeight: 200, resize: "vertical" }}
        />
      </div>
    </Modal>
  );
}
