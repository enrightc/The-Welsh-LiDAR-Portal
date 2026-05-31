import * as React from 'react';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import StraightenIcon from '@mui/icons-material/Straighten';
import LayersIcon from '@mui/icons-material/Layers';
import FilterListIcon from '@mui/icons-material/FilterList';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function MapToolbar({ handleStartPolygon, handleDeletePolygon, isLoggedIn, isMobileDevice, isDrawing, polygonDrawn, layersOpen, setLayersOpen, filterOpen, onFilterToggle, activeFilterCount, measuringMode, onMeasureToggle }) {

    const [openConfirm, setOpenConfirm] = React.useState(false);

    return (
        <Box sx={{
            width: { xs: 20, sm: 'auto' },
            flexDirection: { xs: 'column', sm: 'row' },
            position: 'absolute',
            zIndex: 1000,
            bottom: { xs: 'max(110px, calc(env(safe-area-inset-bottom) + 2svh))', sm: 30 },
            right: { xs: 23, sm: 'calc(50% - 174px)' },
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
            gap: { xs: 0.75, sm: 2 },
            px: 2.5,
            }}>

            {/* Layers control Mobile only */}
            <Tooltip title={layersOpen ? "Hide layers" : "Show layers"} arrow>
            <IconButton
                onClick={() => setLayersOpen(!layersOpen)}
                color={layersOpen ? "primary" : "default"}
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                aria-label={layersOpen ? "Hide layers" : "Show layers"}
            >
                <LayersIcon />
            </IconButton>
            </Tooltip>

            {/* Filter button */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title={filterOpen ? "Close filters" : "Filter records"} arrow>
                <IconButton
                    onClick={onFilterToggle}
                    color={filterOpen || activeFilterCount > 0 ? "primary" : "default"}
                    aria-label="Filter records"
                    aria-pressed={filterOpen}
                >
                    <Badge badgeContent={activeFilterCount || 0} color="primary" invisible={activeFilterCount === 0}>
                        <FilterListIcon sx={{ fontSize: { xs: '1.25rem', sm: '1rem', md: '1.5rem' } }} />
                    </Badge>
                </IconButton>
              </Tooltip>
              <span className="toolbar-label">Filter</span>
            </Box>

            {/* Draw button */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title={isDrawing ? "Drawing… (click Clear to cancel)" : "Draw Polygon"} arrow>
                <span>
                    <IconButton
                    aria-label={isDrawing ? 'Drawing in progress' : 'Draw polygon'}
                    color="black"
                    onClick={handleStartPolygon}
                    disabled={!isLoggedIn || (polygonDrawn && !isDrawing)}
                    aria-pressed={isDrawing}
                    >
                    <EditIcon sx={{
                        color: isDrawing ? 'info.main' : 'inherit',
                        fontSize: { xs: '1.25rem', sm: '1rem', md: '1.5rem' },
                    }} />
                    </IconButton>
                </span>
              </Tooltip>
              <span className="toolbar-label">Draw</span>
            </Box>

            {/* Clear/delete button */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title={isDrawing ? 'Clear current drawing / Delete polygon' : 'Delete Polygon'} arrow>
                <span>
                    <IconButton
                    aria-label="Delete polygon"
                    color="black"
                    onClick={() => setOpenConfirm(true)}
                    disabled={!isLoggedIn || (!isDrawing && !polygonDrawn)}
                    aria-pressed={isDrawing && polygonDrawn}
                >
                    <UndoIcon sx={{ color: isDrawing || polygonDrawn ? 'error.main' : 'inherit',
                    fontSize: { xs: '1', sm: '1rem', md: '1.5rem' },
                     }} />
                </IconButton>
                </span>
              </Tooltip>
              <span className="toolbar-label">Clear</span>
            </Box>

            {/* Measure button */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title={measuringMode ? 'Cancel measurement' : 'Measure distance'} arrow>
                <IconButton
                    aria-label={measuringMode ? 'Cancel measurement' : 'Measure distance'}
                    aria-pressed={measuringMode}
                    onClick={onMeasureToggle}
                    color={measuringMode ? 'error' : 'default'}
                >
                    <StraightenIcon sx={{
                        color: measuringMode ? 'error.main' : 'inherit',
                        fontSize: { xs: '1.25rem', sm: '1rem', md: '1.5rem' },
                    }} />
                </IconButton>
              </Tooltip>
              <span className="toolbar-label">Measure</span>
            </Box>


            {/* Delete Confirmation dialogue box */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                    <Typography>
                        Are you sure you want to clear the polygon you have just drawn? You will have to draw it again.
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