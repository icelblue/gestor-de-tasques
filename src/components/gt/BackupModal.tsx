import { useRef } from "react";
import type { Dict } from "@/lib/gt/i18n";
import type { Task } from "@/lib/gt/types";
import { Modal } from "./Modal";
import { DangerBtn, PrimaryBtn, SecondaryBtn } from "./buttons";
import { showToast } from "./Toast";
import { todayISO } from "@/lib/gt/utils";

interface Props {
  T: Dict;
  tasks: Task[];
  onClose: () => void;
  onReplace: (tasks: Task[]) => void;
  onClear: () => void;
}

export function BackupModal({ T, tasks, onClose, onReplace, onClear }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gt-backup-${todayISO()}.json`;
    a.click();
    showToast(T.backupExported, "success");
  };

  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result || ""));
        if (!Array.isArray(parsed)) throw new Error("not array");
        if (confirm(T.backupRestoreConfirm(parsed.length))) {
          onReplace(parsed);
          showToast(T.backupRestored(parsed.length), "success");
          onClose();
        }
      } catch {
        showToast(T.backupInvalid, "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      title={T.backupTitle}
      width="500px"
      onClose={onClose}
      footer={<SecondaryBtn onClick={onClose}>{T.btnCancel}</SecondaryBtn>}
    >
      <div className="flex flex-col gap-3 px-5 py-4">
        <p className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{T.backupSub}</p>
        <PrimaryBtn onClick={exportJSON} style={{ justifyContent: "center" }}>{T.backupExport}</PrimaryBtn>
        <SecondaryBtn onClick={() => fileRef.current?.click()} style={{ justifyContent: "center" }}>
          {T.backupImport}
        </SecondaryBtn>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importJSON(f);
            if (fileRef.current) fileRef.current.value = "";
          }}
        />
        <DangerBtn
          onClick={() => {
            if (confirm(T.backupClearConfirm)) {
              onClear();
              showToast(T.backupCleared, "error");
              onClose();
            }
          }}
          style={{ justifyContent: "center" }}
        >
          {T.backupClear}
        </DangerBtn>
      </div>
    </Modal>
  );
}
