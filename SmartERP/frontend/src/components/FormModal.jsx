import React from "react";

export default function FormModal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "600px",
          background: "#fff",
          borderRadius: 10,
          padding: 25,
          boxShadow: "0 5px 20px rgba(0,0,0,.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>{title}</h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "red",
              color: "white",
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}