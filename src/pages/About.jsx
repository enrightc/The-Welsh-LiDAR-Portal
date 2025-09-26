import React from 'react'

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import LidarFooter from "../Components/LidarFooter";
import SignUpCTA from "../Components/SignUpCTA";


const About = () => {
  return (
    <>

      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero__text">
              <h1 className="hero__title">About the <span className="accent"> Welsh LiDAR Portal</span></h1>
            </div>         
          </div>
        </div>
      </header>

      <main>
        <Container 
          maxWidth="md">
          <Box>
            <Typography
            sx={{
                mt: 8,
            }}><strong>The Welsh LiDAR Portal</strong> is an independent project built to make Wales’ incredible LiDAR data open for exploration and discovery.</Typography>

            <Typography
              sx={{
                mt: 4,
              }}>Wales has nationwide 1m LiDAR coverage — some of the best in the UK — but until now there hasn’t been a dedicated platform for recording archaeology on it. This project was created to change that.</Typography>

              <Typography
              sx={{
                mt: 4,
              }}>The portal is a <strong>community science platform</strong> where anyone can:</Typography>
              <List
              sx={{
                mt: 2,
              }}>
                <ListItem>
                  <ListItemText
                  primary="Explore LiDAR maps of Wales"
                  />
                </ListItem>
                <ListItem>
                <ListItemText
                  primary="Discover archaeological features like barrows, enclosures, or field systems"
                />
                </ListItem>
                <ListItem>
                <ListItemText
                  primary="Record finds by drawing them directly on the map"
                  />
                </ListItem>
                <ListItem>
                <ListItemText
                  primary="Save and manage discoveries in a personal profile"
                  />
                </ListItem>
                <ListItem>
                <ListItemText
                  primary="Contribute to a growing, shared record of Wales’ past"
                  />
                </ListItem>
            </List>

            <Typography
              sx={{
                mt: 4,
              }}>Our aim is to turn passive map viewers into active contributors, giving both beginners and experienced researchers the tools to explore, learn, and collaborate.</Typography>
          </Box>

          <Box sx={{
            mt: 8,
            backgroundColor: "#F6F2E8",
            padding: 4,
            borderRadius: 8,
          }}>
            <Typography variant="h6" color="text.primary"
            sx={{
            }}>Beta Release</Typography>

            <Typography
              sx={{
                mt: 4,
              }}>This is an early version of the Welsh LiDAR Portal. Features are still being developed, 
              and you may encounter changes or small issues as we continue to improve. 
              Your feedback will help shape the final platform.</Typography>
          </Box>

          <Box
          sx={{display: 'flex',
            flexDirection: {xs: 'column', md:'row',
            gap: 10
            }
          }}>
            <Box sx={{
            mt: 8,
            }}>
              <Typography variant="h1" component="h2" color="text.primary"
              sx={{
              }}>What You Can Do</Typography>

              <List
                sx={{
                  mt: 2,
                }}>
                  <ListItem>
                    <ListItemText
                    primary="Explore and Discover"
                    secondary="Use the map to find hidden archaeological features in LiDAR"/>
                  </ListItem>
                  <ListItem>
                  <ListItemText
                    primary="Record and describe"
                    secondary="Draw polygons to mark discoveries. Add notes, photos or ideas"/>
                  </ListItem>
                  <ListItem>
                  <ListItemText
                    primary="Learn and Share"
                    secondary="Grow your archaeological knowledge and share what you find with others."/>
                  </ListItem>
                  <ListItem>
                  <ListItemText
                    primary="Support Research"
                    secondary="Add to a growing, open dataset that supports research and heritage protection."/>
                  </ListItem>
                  <ListItem>
                  <ListItemText
                    primary="Track Your Journey"
                    secondary="Keep a personal record of everything you’ve found — and return to it anytime."/>
                  </ListItem>
              </List>
            </Box>

            <Box sx={{
              mt: 8,
              backgroundColor: '#EEF3F4',
              alignSelf: 'flex-start',
              padding: 2,
              borderRadius: 8
            }}>
              <Typography variant="h1" component="h2" color="text.primary"
              sx={{
              }}>Coming Soon</Typography>
              <List
                sx={{
                  mt: 2,
                }}>
                  <ListItem>
                    <ListItemText
                    primary="Advanced filters"
                    secondary="search and display recorded LiDAR features."
                    />
                  </ListItem>
                  <ListItem>
                  <ListItemText
                    primary="Additional mapping layers"
                    secondary="(LiDAR DTM, OS maps, Historic maps)."/>
                  </ListItem>
              </List>
            </Box>
          </Box>

          <Box className="">
            <Typography variant="h1" component="h2" color="text.primary"
            sx={{
              mt: 8,
            }}>Data & Licensing</Typography>
            <Typography
            sx={{
                mt: 4,
            }}>I do not own any of the data displayed on this site.</Typography>

            <List
              sx={{
                mt: 4,
                mb: 4,
              }}>
                <ListItem>
                  <ListItemText
                      primary={
                      <span>
                        LiDAR data is provided by{" "}
                        <a href="https://datamap.gov.wales/" target="_blank" rel="noopener noreferrer">
                          DataMapWales
                        </a>{" "}
                        and licensed under the{" "}
                        <a
                          href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Government Licence v3.0
                        </a>.
                      </span>
                    }
                />
              </ListItem>
              <ListItem>
                  <ListItemText
                      primary={
                      <span>
                        Scheduled Monument data is owned by{" "}
                        <a href="https://cadw.gov.wales/" target="_blank" rel="noopener noreferrer">
                          Cadw
                        </a>{" "}
                        and also licensed under the{" "}
                        <a
                          href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Government Licence v3.0
                        </a>.
                      </span>
                    }
                />
              </ListItem>
            </List> 
          </Box> 
        </Container>
      </main>

      <SignUpCTA />
      <LidarFooter />
      
    </>
        
  )
}

export default About