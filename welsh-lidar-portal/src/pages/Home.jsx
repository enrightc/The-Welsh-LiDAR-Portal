import React from 'react' // Import React library
import Navigation from "../components/Navigation";


// Define the Home component (Functional Component)
const Home = () => {
  return (
    <div>
        <Navigation />
        <h1>The Welsh LiDAR Portal</h1>
    </div>
  )
}
// Export the Home component so it can be used in other files
export default Home