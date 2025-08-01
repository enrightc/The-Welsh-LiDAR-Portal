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

export default function RecordDetail({ open, onClose, record }) {
  if (!record) return null;

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const getImageUrl = (url) =>
  url?.startsWith("http") ? url : `${backendURL}${url}`;

  console.log("Picture1:", record.picture1);
  return (
    
    <Modal open={open} onClose={onClose}>
      <ModalDialog layout="center" sx={{ width: "90%", maxWidth: 800, height: "90vh" }}>
        <ModalClose onClick={onClose} />
        
        <DialogTitle>{record.title}</DialogTitle>

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
              <strong>Description:</strong> {record.description}
            </Typography>
          </ListItem>
          {record.PRN && (
            <ListItem>
              <Typography><strong>PRN:</strong> {record.PRN}</Typography>
            </ListItem>
          )}
          <ListItem>
            <Typography><strong>Site Type:</strong> {record.site_type_display}</Typography>
          </ListItem>
          <ListItem>
            <Typography><strong>Monument Type:</strong> {record.monument_type_display}</Typography>
          </ListItem>
          <ListItem>
            <Typography><strong>Period:</strong> {record.period_display}</Typography>
          </ListItem>
          <ListItem>
            <Typography><strong>Recorded by:</strong> {record.recorded_by}</Typography>
          </ListItem>
          <ListItem>
            <Typography><strong>Date Recorded:</strong> {record.date_recorded}</Typography>
          </ListItem>


          {/* Pictures */}
          {(record.picture1 || record.picture2 || record.picture3 || record.picture4 || record.picture5) && (
            <ListItem>
              <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 2 }}>
                {record.picture1 && (
                  <a href={getImageUrl(record.picture1)} target="_blank" rel="noopener noreferrer">
                    <img src={getImageUrl(record.picture1)}
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
                {record.picture2 && (
                  <a href={getImageUrl(record.picture2)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getImageUrl(record.picture2)}
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
                {record.picture3 && (
                  <a href={getImageUrl(record.picture3)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getImageUrl(record.picture3)}
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
                {record.picture4 && (
                  <a href={getImageUrl(record.picture4)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getImageUrl(record.picture4)}
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
                {record.picture5 && (
                  <a href={getImageUrl(record.picture5)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getImageUrl(record.picture5)}
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
          <FeatureMap coordinates={record.polygonCoordinate} />
        </ListItem>
        
      </ModalDialog>
    </Modal>
  );
}