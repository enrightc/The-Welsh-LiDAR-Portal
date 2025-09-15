import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Components
import FeatureMap from '../Components/FeatureMap'; 

export default function RecordDetail({ open, onClose, record }) {
  if (!record) return null;

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${BASE_URL}${url}`;

   const hasPhotos = Boolean(
        record.picture1 || record.picture2 || record.picture3 || record.picture4 || record.picture5
    );

  return (
    
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ pr: 6 }}>
        {record.title}
          <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '80vh' }}>

        <List
          sx={{
            maxHeight: '50vh',
            overflowY: 'auto',
            mx: 0,
            px: 0,
          }}
        >
          <ListItem>
            <Typography level="body1">
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
              <Box 
                sx={{ 
                  display: "flex", 
                  flexWrap: 'nowrap', 
                  gap: 2 
                }}>
                {record.picture1 && (
                  <a href={getImageUrl(record.picture1)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getImageUrl(record.picture1)}
                      alt="Feature"
                      style={{ 
                        width: '120px', 
                        height: '90px', borderRadius: 8, 
                        cursor: 'pointer', objectFit: 'cover', display: 'block' }}
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

        
        <Box sx={{ mt: 2 }}>
          <FeatureMap coordinates={record.polygonCoordinate} />
        </Box>
      </DialogContent>
    </Dialog>
        
  );
}