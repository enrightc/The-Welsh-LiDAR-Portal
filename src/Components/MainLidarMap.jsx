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
import { useMediaQuery } from '@mui/material';

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
        Array.isArray(record.polygonCoordinate) &&
        record.polygonCoordinate.length > 0 && (
          <Polygon
            key={record.id}
            positions={record.polygonCoordinate}
            pathOptions={{ color: '#3388ff', weight: 2, fillOpacity: 0.2 }}
          >
            <Popup>
              <div className="custom-popup record-popup">
                <span className="popup-type-badge">LiDAR Feature</span>
                <div className="popup-title">{record.title}</div>

                {record.picture1 && (
                  <img src={record.picture1} alt={record.title} />
                )}

                {record.prn && (
                  <div className="popup-row">
                    <span className="popup-label">PRN</span>
                    <span className="popup-value">{record.prn}</span>
                  </div>
                )}

                <div className="popup-row">
                  <span className="popup-label">Site type</span>
                  <span className="popup-value">{record.site_type_display}</span>
                </div>

                <div className="popup-row">
                  <span className="popup-label">Monument</span>
                  <span className="popup-value">{record.monument_type_display}</span>
                </div>

                <div className="popup-row">
                  <span className="popup-label">Recorded by</span>
                  <span
                    className="popup-value recorded-by-link"
                    onClick={() => onOpenMini(record.recorded_by_user_id)}
                  >
                    {record.recorded_by}
                  </span>
                </div>

                <div className="popup-row">
                  <span className="popup-label">Date</span>
                  <span className="popup-value">{record.date_recorded}</span>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onOpenDetail(record);
                  }}
                  sx={{ mt: 1.5, textTransform: 'none' }}
                >
                  View Full Record
                </Button>
              </div>
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
  
  const isMobile = useMediaQuery('(max-width:1090px)');

  const savedMapView = React.useMemo(() => {
      try { return JSON.parse(window.sessionStorage.getItem('mapView') || 'null'); }
      catch (_) { return null; }
    }, []);

  const initialCenter = React.useMemo(() => savedMapView?.center ?? [52.1307, -3.7837], []);
  const initialZoom = React.useMemo(() => savedMapView?.zoom ?? 8.5, []);
  const mapRef = React.useRef(null);

  React.useEffect(() => {
      if (!mapRef.current) return;
      const sv = savedMapView;
      if (sv?.center && typeof sv.zoom === 'number') {
        try { mapRef.current.setView(sv.center, sv.zoom, { animate: false }); } catch (_) {}
      }
    }, [records.length]);

  return (

    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      scrollWheelZoom={true}
      loadingControl={true} // shows the little spinner control
      tap={false}
      attributionControl={false}
      doubleClickZoom={true}
      zoomControl={!isMobile}
      whenCreated={(map) => {
        mapRef.current = map;
        try { map.getContainer().setAttribute('tabindex', '-1'); } catch (_) {}
        map.on('moveend', () => {
          const c = map.getCenter();
          const z = map.getZoom();
          try {
            window.sessionStorage.setItem('mapView', JSON.stringify({ center: [c.lat, c.lng], zoom: z }));
          } catch (_) {}
        });
      }}
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