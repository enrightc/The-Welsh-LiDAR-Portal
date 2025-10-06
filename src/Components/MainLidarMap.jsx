import * as React from 'react';
import * as L from 'leaflet';

// --- Leaflet draw touch fix --------------------------------------------------
// Workaround for Leaflet.draw touch adding vertices on drag (GH #935)
// https://github.com/Leaflet/Leaflet.draw/issues/935
if (L?.Draw?.Polyline) {
  L.Draw.Polyline.prototype._onTouch = L.Util.falseFn;
}

// --- MUI ---------------------------------------------------------------------
import Button from '@mui/material/Button';

// --- React Leaflet -----------------------------------------------------------
import {
  MapContainer,
  useMap,
  Popup,
  FeatureGroup,
  LayerGroup,
  Polygon,
} from 'react-leaflet';

// --- Plugins / styles --------------------------------------------------------
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-loading'; // plugin: shows a small spinner (top-left) when the map is "loading"

// --- React Leaflet Draw ------------------------------------------------------
import { EditControl } from 'react-leaflet-draw';

// --- Local components & styles ----------------------------------------------
import CustomLayerControl from './CustomLayerControl';
import '../assets/styles/map.css';
import AttributesControl from './AttributesControl';

// --- Local helper components (used only within this file) -----------------------------------------------

// This small helper component runs once when the map loads.
// It grabs the Leaflet map instance and disables the "tap" feature,
// which can cause unwanted touches or double-taps on mobile devices.
function MapActionsRegistrar() {
  const map = useMap();

  React.useEffect(() => {
    if (map && map.tap && map.tap.disable) {
      try { map.tap.disable(); } catch (_) {}
    }
  }, [map]);

  return null;
}

// This component defines what appears inside each map popup.
// It displays the details of a single record (title, image, site info, etc.)
// and includes a "View Full Record" button plus a clickable author name
// that opens the user's mini profile when clicked.
function RecordPopup({ record, onOpenMini, onOpenDetail }) {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: 1.4,
        maxWidth: 300,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 6,
      }}
    >
      <strong style={{ color: 'blue', fontSize: 15, display: 'block', marginBottom: 12 }}>
        LiDAR Feature
      </strong>

      <h3 style={{ margin: '0 0 6px 0', fontSize: 16, color: 'blue' }}>{record.title}</h3>

      {record.picture1 && (
        <img
          src={record.picture1}
          alt={record.title}
          style={{ height: '10rem', width: '100%', objectFit: 'cover', marginBottom: 8, borderRadius: 4 }}
        />
      )}

      {record.prn && (
        <p style={{ margin: 0 }}>
          <strong>PRN:</strong> {record.prn}
        </p>
      )}

      <p style={{ margin: 0 }}>
        <strong>Site Type: </strong>
        {record.site_type_display}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Monument Type: </strong>
        {record.monument_type_display}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Recorded By: </strong>
        <span
          onClick={() => onOpenMini(record.recorded_by_user_id)}
          style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {record.recorded_by}
        </span>
      </p>
      <p style={{ margin: 0 }}>
        <strong>Date Recorded: </strong>
        {record.date_recorded}
      </p>

      <Button
        variant="outlined"
        size="small"
        onClick={() => onOpenDetail(record)}
        sx={{ mt: 1 }}
      >
        View Full Record
      </Button>
    </div>
  );
}

// This component creates a map layer that displays all community-submitted records.
// It loops through each record, checks if it has polygon coordinates,
// and draws those polygons on the map.
// Each polygon includes a popup (using the RecordPopup component)
// that shows details about the record and lets users open the full record
// or the recorder’s mini profile.
function CommunityLayer({ records, onOpenMini, onOpenDetail }) {
  if (!records?.length) return null;
  return (
    <LayerGroup>
      {records.map((record) => (
        Array.isArray(record.polygonCoordinate) && record.polygonCoordinate.length > 0 && (
          <Polygon
            key={record.id}
            positions={record.polygonCoordinate}
            pathOptions={{ color: '#3388ff', weight: 2, fillOpacity: 0.2 }}
          >
            <Popup>
              <RecordPopup
                record={record}
                onOpenMini={onOpenMini}
                onOpenDetail={onOpenDetail}
              />
            </Popup>
          </Polygon>
        )
      ))}
    </LayerGroup>
  );
}

// =============================================================================
// MainLidarMap
// =============================================================================
export default function MainLidarMap({
  handleDrawCreate,
  featureGroupRef,
  dispatch,
  setPolygonDrawn,
  allRecords,
  handleOpenMiniProfile,
  setSelectedFeature,
  setModalOpen,
  layersOpen,
}) {
  // --- Guarded data ----------------------------------------------
    //checks whether the allRecords prop being received is actually an array (of polygon coordinates).
    // If it is, it uses it.
    // If not (maybe it’s undefined, null, or something unexpected), it uses an empty array instead.
  const records = Array.isArray(allRecords) ? allRecords : [];

  // --- Local UI toggles ------------------------------------------------------
  const [showCommunity, setShowCommunity] = React.useState(true);

  return (

    <MapContainer
      center={[
        52.1307,
        -3.7837,
      ]}
      zoom={8.5}
      scrollWheelZoom={true}
      loadingControl={true} // shows the little spinner control
      tap={false}
      attributionControl={false}
      doubleClickZoom={true}
    >

      <MapActionsRegistrar />

      <CustomLayerControl
        showCommunity={showCommunity}
        setShowCommunity={setShowCommunity}
        layersOpen={layersOpen}
      />

      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          draw={{
            polygon: false,  // Set to false to trigger manually with custom button.
            polyline: false,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
          edit={{
            edit: false,
            remove: false, // Hides the delete tool
          }}
          onCreated={handleDrawCreate}
          onDeleted={(e) => {
            setPolygonDrawn(false);
            dispatch({ type: 'catchPolygonCoordinateChange', polygonChosen: [] });
          }}
        />
      </FeatureGroup>

      {showCommunity && (
        <CommunityLayer
          records={records}
          onOpenMini={handleOpenMiniProfile}
          onOpenDetail={(record) => {
            setSelectedFeature(record);
            setModalOpen(true);
          }}
        />
      )}

      <AttributesControl />

    </MapContainer>
  );
}