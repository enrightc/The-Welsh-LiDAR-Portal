import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import LidarFooter from '../Components/LidarFooter'

const LAST_UPDATED = '29 May 2026'

function Section({ title, children }) {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function P({ children, sx = {} }) {
  return (
    <Typography sx={{ mt: 2, lineHeight: 1.8, ...sx }}>
      {children}
    </Typography>
  )
}

export default function Privacy() {
  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero__text">
              <h1 className="hero__title">
                <span className="accent">Privacy </span>Policy
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Container maxWidth="md">
          <Box sx={{ py: 8 }}>

            <Typography variant="body2" color="text.secondary">
              Last updated: {LAST_UPDATED}
            </Typography>

            <P sx={{ mt: 3 }}>
              The Welsh LiDAR Portal ("we", "us", "our") is committed to protecting your personal
              information. This policy explains what data we collect, how we use it, and your rights
              in relation to it. Please read it alongside our site's{' '}
              <a href="/feedback" style={{ color: 'inherit' }}>feedback and contact form</a>.
            </P>

            <Divider sx={{ mt: 5 }} />

            <Section title="1. Who we are">
              <P>
                The Welsh LiDAR Portal is an independent, non-commercial project dedicated to making
                Wales' LiDAR data open for exploration and community archaeology. It is not operated
                by a commercial company or government body.
              </P>
              <P>
                If you have questions about this policy or how your data is handled, please use the{' '}
                <a href="/feedback" style={{ color: 'inherit' }}>contact form</a>.
              </P>
            </Section>

            <Section title="2. What data we collect">
              <P>We only collect data you actively provide to us:</P>

              <Typography component="ul" sx={{ mt: 2, pl: 3, lineHeight: 2 }}>
                <li>
                  <strong>Account registration</strong> — your username, email address, and a
                  securely hashed password. We never store your password in plain text.
                </li>
                <li>
                  <strong>Profile information</strong> — bio, location, expertise level,
                  organisation, website, and social media links. All of these are optional and
                  can be left blank.
                </li>
                <li>
                  <strong>Profile picture</strong> — an image you choose to upload.
                </li>
                <li>
                  <strong>Records</strong> — archaeological feature records you submit, including
                  title, description, site and monument type, period, polygon coordinates, date
                  recorded, and up to five photographs.
                </li>
                <li>
                  <strong>Feedback messages</strong> — any messages you submit through the
                  feedback form.
                </li>
              </Typography>

              <P>
                We do not collect payment information, location data from your device, or any data
                through third-party tracking tools.
              </P>
            </Section>

            <Section title="3. How we use your data">
              <P>Your data is used solely to operate the portal:</P>
              <Typography component="ul" sx={{ mt: 2, pl: 3, lineHeight: 2 }}>
                <li>To create and manage your account.</li>
                <li>To display your public profile and the records you submit.</li>
                <li>To let you log in securely using token-based authentication.</li>
                <li>To respond to feedback you send us.</li>
              </Typography>
              <P>
                We do not use your data for marketing, profiling, or any automated decision-making.
                We do not sell, rent, or share your personal data with third parties.
              </P>
            </Section>

            <Section title="4. What is publicly visible">
              <P>
                The following information is <strong>publicly visible</strong> to all visitors of
                the portal, whether logged in or not:
              </P>
              <Typography component="ul" sx={{ mt: 2, pl: 3, lineHeight: 2 }}>
                <li>Your username and public profile page (bio, location, expertise, organisation, social links, profile picture, and record count).</li>
                <li>All records you submit — including title, description, site type, monument type, period, polygon location, photographs, and the date recorded.</li>
              </Typography>
              <P>
                Please do not include sensitive personal information in record descriptions or
                profile fields that you would not want to be publicly visible.
              </P>
              <P>
                The following is <strong>private</strong> and never shown publicly:
              </P>
              <Typography component="ul" sx={{ mt: 2, pl: 3, lineHeight: 2 }}>
                <li>Your email address.</li>
                <li>Your password (stored as a one-way hash).</li>
              </Typography>
            </Section>

            <Section title="5. How long we keep your data">
              <P>
                We retain your account and associated records for as long as your account is active.
                If you delete your account (via Account Settings), your account and all records you
                have submitted will be permanently removed from our database. This cannot be undone.
              </P>
              <P>
                Feedback messages may be retained for a reasonable period to allow us to respond and
                improve the portal, after which they are deleted.
              </P>
            </Section>

            <Section title="6. Your rights">
              <P>You have the right to:</P>
              <Typography component="ul" sx={{ mt: 2, pl: 3, lineHeight: 2 }}>
                <li><strong>Access your data</strong> — you can view and edit your profile at any time from your Profile page.</li>
                <li><strong>Download your data</strong> — your submitted records can be exported as CSV or GeoJSON from your Account Settings.</li>
                <li><strong>Correct your data</strong> — update your email, password, and profile information at any time.</li>
                <li><strong>Delete your data</strong> — permanently delete your account and all associated data from Account Settings. This removes your account and all records you have submitted.</li>
              </Typography>
              <P>
                If you need help exercising any of these rights, please use the{' '}
                <a href="/feedback" style={{ color: 'inherit' }}>contact form</a>.
              </P>
            </Section>

            <Section title="7. Security">
              <P>
                Passwords are stored using strong one-way hashing and are never readable by us.
                Authentication uses short-lived tokens rather than long-lived sessions. We take
                reasonable technical steps to protect your data, but no internet service can
                guarantee absolute security.
              </P>
            </Section>

            <Section title="8. Cookies and local storage">
              <P>
                We do not use tracking cookies or analytics cookies. When you log in, your
                authentication token and username are stored in your browser's local storage so
                that you remain logged in between visits. This data stays on your device and is
                cleared when you log out.
              </P>
            </Section>

            <Section title="9. Third parties">
              <P>
                The portal is hosted on third-party infrastructure. Our hosting providers may
                process server logs (IP addresses, request timestamps) as part of normal service
                operation. We do not share your personal data with any other third parties.
              </P>
              <P>
                The map tiles displayed in the portal are served by third-party tile providers
                (such as OpenStreetMap contributors and the Natural Resources Wales LiDAR service).
                Visiting the map may result in your IP address being seen by those providers in
                the same way as any other web request.
              </P>
            </Section>

            <Section title="10. Changes to this policy">
              <P>
                We may update this policy from time to time. The "last updated" date at the top
                of this page will always reflect the most recent version. Significant changes will
                be noted in the News section of the portal.
              </P>
            </Section>

            <Section title="11. Contact">
              <P>
                If you have any questions or concerns about this privacy policy or how your data
                is handled, please get in touch using the{' '}
                <a href="/feedback" style={{ color: 'inherit' }}>contact / feedback form</a>.
              </P>
            </Section>

            <Divider sx={{ mt: 6 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 6 }}>
              © {new Date().getFullYear()} The Welsh LiDAR Portal
            </Typography>

          </Box>
        </Container>
      </main>

      <LidarFooter />
    </>
  )
}
