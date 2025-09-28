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
import Divider from '@mui/material/Divider';


export default function MapToolbar({ handleStartPolygon, handleDeletePolygon, isLoggedIn, isMobileDevice}) {

    const [openConfirm, setOpenConfirm] = React.useState(false);

    return (
        <Box sx={{
            width: { xs: 2, sm: 'auto' },
            flexDirection: { xs: 'column', sm: 'row' },
            position: 'absolute',
            zIndex: 1000,
            bottom: { xs: 80, sm: 50 },
            left: { xs: 20, sm: '50%' },
            transform: { xs: 'none', sm: 'translateX(-50%)' },
            bgcolor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            gap: 2,
            px: 2,
            }}>
            <Tooltip title="Draw Polygon" arrow>
                <IconButton
                    aria-label="Draw polygon"
                    color="black"
                    onClick={handleStartPolygon}
                    disabled={!isLoggedIn}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Delete Polygon" arrow>
                <IconButton
                    aria-label="Delete polygon"
                    color="black"
                    onClick={() => setOpenConfirm(true)}
                    disabled={!isLoggedIn }
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem />

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