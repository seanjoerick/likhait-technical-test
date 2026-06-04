import React from "react";

interface AlertProps {
  children: React.ReactNode;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

const ALERT_COLORS = {
  success: { bg: "#d4edda", color: "#155724", border: "#c3e6cb" },
  error: { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" },
  info: { bg: "#d1ecf1", color: "#0c5460", border: "#bee5eb" },
};

const alertStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "4px",
  marginTop: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export function Alert({ children, type = "success", onClose }: AlertProps) {
  const styles = ALERT_COLORS[type];

  return (
    <div
      role="alert"
      style={{
        ...alertStyle,
        backgroundColor: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
      }}
    >
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: styles.color,
            fontSize: "16px",
            padding: "0 4px",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
