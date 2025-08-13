import React from 'react' // Import React library
import Navigation from "../Components/Navigation";

// MUI Imports
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Importing CSS for styling
import './home.css';

// Assets
import lidarMain from '../components/Assets/lidar-main.webp'

// Define the Home component (Functional Component)
const Home = () => {
  return (
    
    // HERO: Move to own component if adding more content to homepage.
    <div style={{ 
      position: "relative",
      width: "100%",
    }}>
      <img src={lidarMain} 
           alt="LiDAR background"
          style={{ 
            height: "100vh",
            width: "100%",
            objectFit: "cover",
            minWidth: "100vw"
          }}
      />

        {/* Title and Buttons */}
        <Box sx= {{
          position: "absolute",
          top: "150px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: { xs: '3rem', md: '5rem' },
          maxWidth: "90%",
          left: "50%", // move to center horizontally
          transform: "translateX(-50%)",  // pull back half its width
        }}>
          {/* Group 1: Typography */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '1rem', md: '2rem' }  // Gap between the two Typography elements
          }}>
            <Typography variant='h1'
              sx={{ 
                color: 'white',
                fontWeight: 'bolder',  
                marginTop: '2rem',
                fontSize: { xs: '3rem', md: '4rem' }, // smaller on phones
              }}
              >Discover the past,<br />Shape the record
            </Typography>

            <Typography variant='h4'
              sx={{ 
                color: 'white', 
                fontSize: { xs: '1rem', md: '2rem' }, // smaller on phones 
              }}>
                Search, explore and contribute to the map of Wales’ archaeological heritage — powered by open LiDAR data.
              </Typography>
          </Box>
          

          {/* Group 2: Buttons */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "1rem", md: "3rem" },  // Gap between buttons
            textAlign: "center",
            justifyContent: "center",
          }}>
            <Button sx= {{
              color: "black",
              border: "none",
              fontSize: { xs: '0.8rem', md: '1rem' },
              borderRadius: "5px",
              backgroundColor: "#FFD034",
            }}>
              Start Exploring
            </Button>

            <Button sx= {{
              color: "#27FAE3",
              fontSize: { xs: '0.8rem', md: '1rem' },
              borderRadius: "5px",
              backgroundColor: "transparent",
              border: "#27FAE3 solid 2px",
            }}>
              How it Works
            </Button>
          </Box>
        </Box>
    </div>
  )
}
// Export the Home component so it can be used in other files
export default Home