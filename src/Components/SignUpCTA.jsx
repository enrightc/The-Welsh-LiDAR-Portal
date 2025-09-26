import React from 'react'

function SignUpCTA() {
  return (
    <div>
        <section className="contribute" aria-labelledby="contribute-title">
            <div className="contribute__text">
              <h2 className="contribute_title" id="contribute-title">Help improve the map</h2>
              <p>Sign up to contribute! You can help identify and classify archaeological sites, add information, and make Wales' heritage accessible to all.</p>
              <a href="/Register" className="btn btn--primary">Sign Up</a>
            </div>
        </section>
    </div>
  )
}

export default SignUpCTA