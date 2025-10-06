import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Components
import defaultProfilePicture from "../Components/Assets/defaultProfilePicture.webp";

// Icons 
import LocationPinIcon from '@mui/icons-material/LocationPin';
import StarIcon from '@mui/icons-material/Star';
import HomeWorkIcon from '@mui/icons-material/HomeWork';


export default function MiniProfile({ open, onClose, user }) {
    if (!user) return null;

    const [openConfirm, setOpenConfirm] = React.useState(false);

    // Reusable modal body styles for Material UI
    const modalStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: 500,
      textAlign: 'center',
      bgcolor: 'background.paper',
      boxShadow: 24,
      borderRadius: 2,
      p: 3,
    };

    return (
        <>
            {/* Profile modal */}
            <Modal open={open} onClose={onClose}>
              <Box sx={modalStyle}>
                {/* Profile picture */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
                  <img
                    src={user.profile_picture || defaultProfilePicture}
                    alt="Profile picture"
                    style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                  />
                </Box>

                {/* Username */}
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'green', mt: 1 }}>
                  @{user.user_username}
                </Typography>

                {/* Location, expertise and organisation */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationPinIcon fontSize="medium" />
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {user.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon fontSize="medium" />
                    <Typography variant="body1">{user.expertise_level}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeWorkIcon fontSize="medium" />
                    <Typography variant="body1">{user.organisation}</Typography>
                  </Box>
                </Box>

                {/* Bio */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {user.bio?.slice(0, 150)}{user.bio?.length > 150 && '...'}
                  </Typography>
                </Box>

                {/* Last Active */}
                <Typography sx={{ mt: 2 }} variant="body2">
                  Last active: {user.last_active}
                </Typography>

                {/* Buttons */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="outlined" onClick={() => setOpenConfirm(true)}>
                    View Full Profile
                  </Button>
                  <Button variant="text" onClick={onClose}>
                    Close
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* Leave warning dialog */}
            <Modal open={openConfirm} onClose={() => setOpenConfirm(false)}>
              <Box sx={modalStyle}>
                <Typography variant="h4">Leave the LiDAR Portal?</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  You are about to leave the LiDAR Portal map and may lose your current location. Do you wish to continue?
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                  <Button variant="text" onClick={() => setOpenConfirm(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      window.location.href = `/user/${user.user_username}`;
                    }}
                  >
                    Continue
                  </Button>
                </Box>
              </Box>
            </Modal>
        </>
    );
}
