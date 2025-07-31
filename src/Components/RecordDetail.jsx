import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

// Components
import FeatureMap from '../Components/FeatureMap'; 


export default function RecordDetail({ open, onClose, feature }) {
  if (!feature) return null;

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog layout="center" sx={{ width: "90%", maxWidth: 800, height: "90vh" }}>
        <ModalClose onClick={onClose} />
        
        <DialogTitle>{feature.title}</DialogTitle>

        <List
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            mx: 'calc(-1 * var(--ModalDialog-padding))',
            px: 'var(--ModalDialog-padding)',
          }}
        >
          <ListItem>
            <Typography level="body-md">
              <strong>Description:</strong> {feature.description}
            </Typography>
          </ListItem>
          {feature.PRN && (
            <ListItem>
              <Typography><strong>PRN:</strong> {feature.PRN}</Typography>
            </ListItem>
          )}
          <ListItem>
            <Typography><strong>Site Type:</strong> {feature.site_type_display}</Typography>
          </ListItem>
          <ListItem>
            <Typography><strong>Monument Type:</strong> {feature.monument_type_display}</Typography>
          </ListItem>
          <ListItem>
            <Typography><strong>Period:</strong> {feature.period_display}</Typography>
          </ListItem>
          <ListItem>
            <Typography><strong>Recorded by:</strong> {feature.recorded_by}</Typography>
          </ListItem>
          <ListItem>
            <Typography><strong>Date Recorded:</strong> {feature.date_recorded}</Typography>
          </ListItem>


          {/* Pictures */}
          {(feature.picture1 || feature.picture2 || feature.picture3 || feature.picture4 || feature.picture5) && (
            <ListItem>
              <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 2 }}>
                {feature.picture1 && (
                  <a href={`${backendURL}${feature.picture1}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${backendURL}${feature.picture1}`}
                      alt="Feature"
                      style={{
                        width: "120px",
                        height: "90px",
                        borderRadius: 8,
                        cursor: "pointer",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </a>
                )}
                {feature.picture2 && (
                  <a href={`${backendURL}${feature.picture2}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${backendURL}${feature.picture2}`}
                      alt="Feature"
                      style={{
                        width: "120px",
                        height: "90px",
                        borderRadius: 8,
                        cursor: "pointer",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </a>
                )}
                {feature.picture3 && (
                  <a href={`${backendURL}${feature.picture3}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${backendURL}${feature.picture3}`}
                      alt="Feature"
                      style={{
                        width: "120px",
                        height: "90px",
                        borderRadius: 8,
                        cursor: "pointer",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </a>
                )}
                {feature.picture4 && (
                  <a href={`${backendURL}${feature.picture4}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${backendURL}${feature.picture4}`}
                      alt="Feature"
                      style={{
                        width: "120px",
                        height: "90px",
                        borderRadius: 8,
                        cursor: "pointer",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </a>
                )}
                {feature.picture5 && (
                  <a href={`${backendURL}${feature.picture5}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${backendURL}${feature.picture5}`}
                      alt="Feature"
                      style={{
                        width: "120px",
                        height: "90px",
                        borderRadius: 8,
                        cursor: "pointer",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </a>
                )}
              </Box>
            </ListItem>
          )}
        </List>

        <ListItem>
          <FeatureMap coordinates={feature.polygonCoordinate} />
        </ListItem>
        
      </ModalDialog>
    </Modal>
  );
}