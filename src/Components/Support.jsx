import React from 'react';

function Support() {
  return (
    <section className="support" aria-labelledby="support-title">
      <div className="container">
        <h2 id="support-title" className="support__title">Support the Portal</h2>
        <p className="support__body">
          The Welsh LiDAR Portal is built independently — no funding, no institution, just a passion for
          making Wales' hidden archaeology accessible to everyone.
        </p>
        <p className="support__body">
          It's free to use, but hosting, data access, and ongoing development all have real costs.
          If you've found the site useful, your support helps keep it running and improving for everyone.
        </p>
        <a
          className="btn btn--support"
          href="https://lnkd.in/esC9Heuy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Support the project
        </a>
      </div>
    </section>
  );
}

export default Support;
