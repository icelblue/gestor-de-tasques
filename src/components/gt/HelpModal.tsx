import type { Dict } from "@/lib/gt/i18n";
import { Modal } from "./Modal";
import { PrimaryBtn } from "./buttons";

interface Props { T: Dict; onClose: () => void; }

export function HelpModal({ T, onClose }: Props) {
  return (
    <Modal
      title={T.helpTitle}
      width="700px"
      onClose={onClose}
      footer={<PrimaryBtn onClick={onClose}>{T.helpOk}</PrimaryBtn>}
    >
      <div
        className="help-body flex flex-col gap-4 px-6 py-5"
        style={{ color: "var(--foreground)" }}
        dangerouslySetInnerHTML={{ __html: helpStyles + T.helpBody }}
      />
    </Modal>
  );
}

const helpStyles = `
<style>
.help-body .help-section {
  border-left: 2px solid var(--primary);
  padding: 4px 0 4px 14px;
}
.help-body h3 {
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--primary);
  margin: 0 0 6px 0;
}
.help-body p {
  font-size: 13px;
  line-height: 1.55;
  color: var(--muted-foreground);
  margin: 0 0 6px 0;
}
.help-body code {
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 1px 6px;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--primary);
}
.help-body b { color: var(--foreground); }
</style>
`;
