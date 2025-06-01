
import React from 'react'
import { useRef, useMemo } from 'react';
import { Marker } from 'react-leaflet';




function DraggableMarker({ position, onDragEnd }) {

    // source: https://react-leaflet.js.org/docs/example-draggable-marker
    const markerRef = useRef(null)
    const eventHandlers = useMemo(() => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null && onDragEnd) {
            const newPos = marker.getLatLng();
            onDragEnd([newPos.lat, newPos.lng]);
          }
        },
      }), [onDragEnd]);

  return (
        <Marker
                draggable
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}>
              </Marker>
  )
}

export default DraggableMarker