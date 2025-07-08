import * as React from 'react';
import Box from '@mui/material/Box';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export default function MapToolbar({ handleStartPolygon, handleDeletePolygon }) {
  const [value, setValue] = React.useState(0);

  

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
                onClick={handleDeletePolygon}
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    </Box>
  );
}