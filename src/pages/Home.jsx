import React from 'react' // Import React library


// Importing CSS for styling
import './Home.css';

// Image Imports
import lidarMain1 from '../Components/Assets/lidarMain1.webp';
import mapScreenImage from '../Components/Assets/MapScreenImage.webp';
import rhydBrownCamp from '../Components/Assets/RhydBrownCamp.webp';
import rudbaxtonRath from '../Components/Assets/RudbaxtonRath.webp';
import walesHighlight from '../Components/Assets/walesHightlight.webp';
import mapMarkerIcon from '../Components/Assets/map_marker.svg';
import addIcon from '../Components/Assets/add.svg';
import speechIcon from '../Components/Assets/speech.svg';

const Home = () => {
  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero__text">
              <h1 className="hero__title">Discover the Past, <span className="accent">Shape the Record</span></h1>
              <p className="hero__tagline">Search, explore and contribute to the map of Wales’ archaeological heritage — powered by open LiDAR data.</p>
              <div className="hero__btns">
                <a href="#" className="btn btn--primary">Start Exploring</a>
              </div> 
          </div>
          <div className="hero__image">
            <img src={lidarMain1} alt="LiDAR landscape showing terrain"/>
          </div>
        </div>
      </header> 

      <main>
        <section className="about" aria-labelledby="about-title">
          <div className="container">
            <div className="about-text">
              <h2 id="about-title" className="about-text__title">About the Welsh LiDAR Portal</h2>
              <p>The Welsh LiDAR portal is a free, interactive map that lets you discover the hidden archaeology across Wales using high resolution LiDAR data.</p>
              <p>This portal is designed for everyone: whether you're a local resident, a student, a heritage professional, or just curious about the past.</p>
              <p>You can explore the map, record new discoveries, and help improve our understanding of Wales' rich archaeological landscape.</p>
            </div>
            <div className="about-image">
              <img src={mapScreenImage} alt="Screenshot of main mapping screen polygon drawn and form open as example"></img>
            </div>
          </div>
        </section>

        <section className="how-it-works" aria-labelledby="how-it-works-title">
          <div className="container">
            <h2 id="how-it-works-title" className="how-it-works__title">How it works</h2>
            <ul className="cards">
              <li>
                <article className="card explore">
                  <img className="card-icon" src={mapMarkerIcon} alt="" aria-hidden="true"/>
                  <h3>Explore the map</h3>
                  <p>View the LiDAR map of Wales and find hidden archaeological sites</p>
                </article>
              </li>
              <li>
                <article className="card add">
                  <img className="card-icon" src={addIcon} alt="" aria-hidden="true"/>
                  <h3>Add a discovery</h3>
                  <p>Record your finds directly on the interactive map</p>
                </article>
              </li>
              <li>
                <article className="card community">
                  <img className="card-icon" src={speechIcon} alt="" aria-hidden="true"/>
                  <h3>Help the Community</h3>
                  <p>Your finds help to build a better picture of Wales' past. Share what you see and contribute to our collective understanding.</p>
                </article>
              </li> 
            </ul>
          </div>
        </section>

        <section className="explore-heritage" aria-labelledby="explore-heritage-title">
          <div className="container">
            <div className="explore-heritage__text">
              <h2 id="explore-heritage-title" className="explore-heritage__title">Explore Wales' heritage</h2>
              <p>Our interactive map allows you to explore archaeological features across Wales using LiDAR data, uncover ancient monuments, historic landscapes, and hidden traces of the past.</p>
            </div>
            <div className="explore-heritage__img">
              <img src={rhydBrownCamp} alt="LiDAR view of Rhyd Brown Camp Hillfort" loading="lazy"/>
            </div>
          </div> 
        </section>

        <section className="what-is-lidar" aria-labelledby="what-is-lidar-title">
          <div className="container">
            <div className="what-is-lidar__text">
              <h2 id="what-is-lidar-title" className="what-is-lidar__text__title">What is LiDAR?</h2>
              <p>Light Detection and Ranging (LiDAR) is a remote sensing technique that uses laser pulses to create detailed 3D maps of the ground surface. It is a powerful tool useful for revealing archaeological sites and features. </p>
              <a href="#" className="btn btn--secondary">Read More</a>
            </div>
            <div className="what-is-lidar__img">
              <img src={rudbaxtonRath} alt="Lidar view of Rudbaxton Rath" loading="lazy"/>
            </div>
          </div>
        </section>

        <section className="contribute" aria-labelledby="contribute-title">
          <div className="container">
            <div className="contribute__text">
              <h2 id="contribute-title">Help improve the map</h2>
              <p>Sign up to contribute! You can help identify and classify archaeological sites, add information, and make Wales' heritage accessible to all.</p>
            </div>
            <div className="contribute__img">
              <img src={walesHighlight} alt="Wales map highlighted with discoveries" loading="lazy"/>
            </div>
          </div>
        </section>

      </main> 
      
    </>
  )
}
// Export the Home component so it can be used in other files
export default Home