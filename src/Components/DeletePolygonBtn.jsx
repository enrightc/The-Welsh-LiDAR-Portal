import React from 'react'

export default function DeleteBtnPolygon({ onClick }) {
  return (
    <button
      onClick={onClick}
      
      style={{
        position: 'absolute',
            top: 150,
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
      🗑️ Delete Polygon
    </button>
  );
}