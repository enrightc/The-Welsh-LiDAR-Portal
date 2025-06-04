import React from "react";

import CreateRecord from '../Components/CreateRecord';

export default function Sidebar({ open, onClose }) {
  return (
    <div
      style={{
        width: open ? "45vw" : 0,
        maxWidth: 500,
        transition: "width 0.3s",
        overflow: "hidden",
        background: "white",
        color: "#fff",
        height: "100vh",
        paddingTop: 10,
        boxSizing: "border-box",
      }}
    >
      {/* Only show close button if open */}
      {open && (
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            left: 425,
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      )}

      {/* Sidebar content */}
      {open && (
        <div style={{ padding: -45 }}>
          <CreateRecord />
        </div>
      )}
    </div>
  );
}