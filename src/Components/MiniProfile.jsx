import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';


// Components


import defaultProfilePicture from "../Components/Assets/defaultProfilePicture.webp";

// Icons 
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StarIcon from '@mui/icons-material/Star';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function MiniProfile({ open, onClose, user }) {
    if (!user) return null;
    
    const [openConfirm, setOpenConfirm] = React.useState(false);
    

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <ModalDialog layout="center" sx={{ width: "90%", maxWidth: 500, textAlign: "center" }}>
            
                    {/* Profile picture */}
                    <Box sx={{ 
                        display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
                        <img
                            src={user.profile_picture || defaultProfilePicture}
                            alt="Profile"
                            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                        />
                    </Box>

                    {/* Username */}
                    <Typography  
                        level="h4" sx={{ fontWeight: "bold", color: "green" }}>
                        @{user.user_username}
                    </Typography>

                    {/* Location, expertise and organisation */}
                    <Box sx={{ 
                        display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocationPinIcon fontSize="medium" />
                            <Typography
                                variant="body1"
                                sx={{ textTransform: "capitalize" }}
                            >
                                {user.location}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <StarIcon fontSize="medium" />
                            <Typography variant="body1">{user.expertise_level}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    <Box sx={{ 
                        mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenConfirm(true)}
                        >
                            View Full Profile
                        </Button>
                        <Button variant="soft" onClick={onClose}>
                            Close
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
            
            {/* Leave warning dialogue box */}
            <Modal open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <ModalDialog layout="center" sx={{ textAlign: "center" }}>
                    <Typography level="h4">Leave the LiDAR Portal?</Typography>
                    <Typography level="body2" sx={{ mt: 1 }}>
                    You are about to leave the LiDAR Portal map and may lose your current location. Do you wish to continue?
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
                    <Button variant="soft" onClick={() => setOpenConfirm(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        color="danger"
                        onClick={() => {
                        window.location.href = `/user/${user.id}`;
                        }}
                    >
                        Continue
                    </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </>   
    );
}
