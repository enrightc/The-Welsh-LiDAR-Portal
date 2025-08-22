import React from 'react' // Import React library
import Navigation from "../Components/Navigation";

// Importing CSS for styling
import './Home.css';

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__title">
            <h1>Discover the Past, Shape the Record</h1>
          </div>
          <div>
            <h2 className="hero__tagline">Search, explore and contribute to the map of Wales’ archaeological heritage — powered by open LiDAR data.</h2>
          </div>
          <div className="hero__btns">
            <button>Start Exploring</button>
            <button>How it Works</button>
          </div>
        </div>
      </section> 

      <main>
        <section className="about">
          <div className="container">
            <div className="about-text">
              <h3>About the Welsh LiDAR Portal</h3>
              <p>The Welsh LiDAR portal is a free, interactive map that lets you discover the hidden archaeology across Wales using high resolution LiDAR data.</p>
              <p>LiDAR (Light Detection and Ranging) can reveal features like ancient field systems, hillforts, and long-lost settlements - even in areas covered by trees or vegetation.</p>
              <p>This portal is designed for everyone: whether you're a local resident, a student, a heritage professional, or just curious about the past.</p>
              <p>You can explore the map, record new discoveries, and help improve our understanding of Wales' rich archaeological landscape.</p>
            </div>
            <div className="about-image">
              <img src="src/Components/Assets/MapScreenImage.webp" alt="Screenshot of main mapping screen polygon drawn and form open as example"></img>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2>How it works</h2>
            <div className="cards">
              <div className="card explore">
                <img src="src/Components/Assets/map_marker.svg"></img>
                <h3>Explore the map</h3>
                <p>View the LiDAR map of Wales and find hidden archaeological sites</p>
              </div>
              <div className="card add">
                <img src="src/Components/Assets/add.svg"></img>
                <h3>Add a discovery</h3>
                <p>Record your finds directly on the interactive map</p>
              </div>
              <div className="card community">
                <img src="src/Components/Assets/speech.svg"></img>
                <h3>Help the Community</h3>
                <p>Your finds help to build a better picture of Wales' past. Share what you see and contribute to our collective understanding.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="explore-heritage">
          <div className="container">
            <div className="explore-heritage__text">
              <h2>Explore Wales' heritage</h2>
              <p>Our interactive map allows you to explore archaeological features across Wales using LiDAR data, uncover ancient monuments, historic landscapes, and hidden traces of the past.</p>
            </div>
            <div className="explore-heritage__img">
              <img src="src/Components/Assets/RhydBrownCamp.webp" alt="LiDAR vuew of Rhyd Brown Camp Hillfort"></img>
            </div>
          </div>
        </section>

        <section className="what-is-lidar">
          <div className="container">
            <div className="what-is-lidar__text">
              <h2>What is LiDAR?</h2>
              <p>Light Detection and Ranging (LiDAR) is a remote sensing technique that uses laser pulses to create detailed 3D maps of the ground surface. It is a powerful tool useful for revealing archaeological sites and features. </p>
              <button>Read More</button>
            </div>
            <div className="what-is-lidar__img">
              <img src="src/Components/Assets/RudbaxtonRath.webp" alt="Lidar vuew of Rudbaxton Rath"></img>
            </div>
          </div>
        </section>

        <section className="contribute">
          <div className="container">
            <div className="contribute__text">
              <h2>Help improve the map</h2>
              <p>Sign up to contribute! You can help identify and classify archaeological sites, add information, and make Wales' heritage accessible to all.</p>
            </div>
            <div className="contribute__img">
              <img src="src/Components/Assets/walesHightlight.webp" alt="Wales map highlighted with discoveries"></img>
            </div>
          </div>
        </section>

      </main> 
      
    </>
  )
}
// Export the Home component so it can be used in other files
export default Home