import * as React from 'react';
import Box from '@mui/material/Box';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StraightenIcon from '@mui/icons-material/Straighten';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function MapToolbar({ handleStartPolygon, handleDeletePolygon }) {
  const [openConfirm, setOpenConfirm] = React.useState(false);

return (
    <Box sx={{ 
        width: 400,
        position: 'absolute',
        zIndex: 1000,
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItens: 'center',
        border: '1px solid #ccc',
        gap: 2,
        px: 2,
        }}>
        <Tooltip title="Draw Polygon" arrow>
            <IconButton
                aria-label="Draw polygon"
                color="black"
                onClick={handleStartPolygon}
            >
                <EditIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Delete Polygon" arrow>
            <IconButton
                aria-label="Delete polygon"
                color="black"
                onClick={() => setOpenConfirm(true)}
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Measure Distance (coming Soon)" arrow>
            <IconButton
                aria-label="Measure distance"
                color="black"

            >
                <StraightenIcon />
            </IconButton>
        </Tooltip>


        {/* Delete Confirmation dialogue box */}
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                <Typography>
                    Are you sure you want to delete the selected polygon? You will have to draw it again.
                </Typography>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenConfirm(false)} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                    handleDeletePolygon();
                    setOpenConfirm(false);
                    }}
                    color="error"
                    variant="contained"
                >
                    Delete
                </Button>
                </DialogActions>
            </Dialog>

    </Box>
  );
}