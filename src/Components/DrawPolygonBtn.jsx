// Components/DrawPolygonButton.jsx
import React from "react";

export default function DrawPolygonBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      
      style={{
        position: 'absolute',
            top: 100,
            right: 20,
            zIndex: 1000,
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
      }}
    >
      ✏️ Draw Polygon
    </button>
  );
}