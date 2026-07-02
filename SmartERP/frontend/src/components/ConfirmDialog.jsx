import React from "react";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 400,
          background: "#fff",
          padding: 25,
          borderRadius: 10,
        }}
      >
        <h2>{title}</h2>

        <p>{message}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button onClick={onCancel}>Cancel</button>

          <button
            onClick={onConfirm}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}