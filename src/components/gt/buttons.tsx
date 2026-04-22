import { type CSSProperties } from "react";

const base: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
  letterSpacing: "0.5px",
  padding: "8px 16px",
  borderRadius: "2px",
  border: "1px solid",
  cursor: "pointer",
  transition: "all .15s",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
};

export function PrimaryBtn(p: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      style={{
        ...base,
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        borderColor: "var(--primary)",
        fontWeight: 600,
        ...p.style,
      }}
    />
  );
}

export function SecondaryBtn(p: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      style={{
        ...base,
        background: "transparent",
        color: "var(--foreground)",
        borderColor: "var(--border)",
        ...p.style,
      }}
    />
  );
}

export function GhostBtn(p: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      style={{
        ...base,
        padding: "4px 10px",
        fontSize: "10px",
        background: "transparent",
        color: "var(--text-faint)",
        borderColor: "var(--border)",
        ...p.style,
      }}
    />
  );
}

export function DangerBtn(p: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      style={{
        ...base,
        background: "transparent",
        color: "var(--destructive)",
        borderColor: "var(--destructive)",
        ...p.style,
      }}
    />
  );
}

export const inputStyle: CSSProperties = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--foreground)",
  fontFamily: "var(--font-mono)",
  fontSize: "13px",
  padding: "8px 10px",
  borderRadius: "2px",
  outline: "none",
};

export const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "var(--text-faint)",
};
