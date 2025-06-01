import React from 'react'
import CreateRecord from '../Components/CreateRecord'; // adjust the path if needed
const About = () => {
  return (
    <div>

      {/* CreateRecord button & drawer */}
            <CreateRecord />
        <h1>About</h1>
        <p>This portal allows users to explore and record finds on LiDAR data.</p>
    </div>
  )
}

export default About