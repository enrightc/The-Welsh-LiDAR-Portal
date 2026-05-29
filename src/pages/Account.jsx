import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'

import StateContext from '../Contexts/StateContext'
import DispatchContext from '../Contexts/DispatchContext'
import LidarFooter from '../Components/LidarFooter'
import MySnackbar from '../Components/MySnackbar'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import DownloadIcon from '@mui/icons-material/Download'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

function Card({ children, sx = {} }) {
  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: '800px',
        mx: 'auto',
        my: 3,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: 'white',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

function Account() {
  const navigate = useNavigate()
  const GlobalState = useContext(StateContext)
  const GlobalDispatch = useContext(DispatchContext)

  const [joinedDate, setJoinedDate] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)

  // Email form
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Delete account
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Snackbar
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')

  useEffect(() => {
    if (!GlobalState.userId) navigate('/login')
  }, [GlobalState.userId])

  useEffect(() => {
    if (!GlobalState.userId) return
    async function fetchProfile() {
      try {
        const res = await Axios.get(`${BASE_URL}/api/profiles/${GlobalState.userId}/`)
        setJoinedDate(res.data.joined_date || '')
      } catch (e) {
        console.log(e)
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [GlobalState.userId])

  function authHeader() {
    return { Authorization: `Token ${localStorage.getItem('theUserToken')}` }
  }

  function showSnack(msg) {
    setSnackMessage(msg)
    setSnackOpen(true)
  }

  // --- Download handlers ---
  async function handleDownload(url, filename) {
    try {
      const res = await Axios.get(`${BASE_URL}${url}`, {
        headers: authHeader(),
        responseType: 'blob',
      })
      const href = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = href
      a.download = filename
      a.click()
      URL.revokeObjectURL(href)
    } catch (e) {
      showSnack('Download failed. Please try again.')
    }
  }

  // --- Email update ---
  async function handleEmailSubmit(e) {
    e.preventDefault()
    setEmailError('')
    setEmailSubmitting(true)
    try {
      await Axios.post(
        `${BASE_URL}/api/users/set_email/`,
        { email: newEmail, current_password: emailPassword },
        { headers: authHeader() }
      )
      showSnack('Email updated successfully.')
      setNewEmail('')
      setEmailPassword('')
    } catch (err) {
      const data = err.response?.data
      if (data?.email) setEmailError(data.email[0])
      else if (data?.current_password) setEmailError(data.current_password[0])
      else setEmailError('Update failed. Please check your details and try again.')
    } finally {
      setEmailSubmitting(false)
    }
  }

  // --- Password change ---
  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordError('')
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    setPasswordSubmitting(true)
    try {
      await Axios.post(
        `${BASE_URL}/api-auth-djoser/users/set_password/`,
        { current_password: currentPassword, new_password: newPassword },
        { headers: authHeader() }
      )
      showSnack('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      const data = err.response?.data
      if (data?.current_password) setPasswordError(data.current_password[0])
      else if (data?.new_password) setPasswordError(data.new_password[0])
      else setPasswordError('Password change failed. Please check your details.')
    } finally {
      setPasswordSubmitting(false)
    }
  }

  // --- Delete account ---
  async function handleDeleteConfirm() {
    setDeleteError('')
    setDeleteSubmitting(true)
    try {
      await Axios.delete(`${BASE_URL}/api-auth-djoser/users/me/`, {
        headers: authHeader(),
        data: { current_password: deletePassword },
      })
      GlobalDispatch({ type: 'Logout' })
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      if (data?.current_password) setDeleteError(data.current_password[0])
      else setDeleteError('Deletion failed. Please check your password and try again.')
      setDeleteSubmitting(false)
    }
  }

  if (profileLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '60vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <>
      <Grid container direction="column" sx={{ p: '4rem', backgroundColor: '#EEF3F4' }}>

        {/* Account Info */}
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Account Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your login credentials and data.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              sx={{ color: 'black', borderColor: 'black', textTransform: 'none', borderRadius: 2, alignSelf: 'flex-start' }}
              onClick={() => navigate('/dashboard')}
            >
              ← Back to Dashboard
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Username</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {GlobalState.userUsername}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{GlobalState.userEmail}</Typography>
            </Box>
            {joinedDate && (
              <Box>
                <Typography variant="body2" color="text.secondary">Member since</Typography>
                <Typography variant="body1">{joinedDate}</Typography>
              </Box>
            )}
          </Box>
        </Card>

        {/* Download Your Data */}
        <Card>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Download Your Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Export all records you have submitted to the portal.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ textTransform: 'none', color: 'black', borderColor: 'black' }}
              onClick={() => handleDownload('/api/records/export/csv/', 'my-records.csv')}
            >
              Download CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ textTransform: 'none', color: 'black', borderColor: 'black' }}
              onClick={() => handleDownload('/api/records/export/geojson/', 'my-records.geojson')}
            >
              Download GeoJSON
            </Button>
          </Box>
        </Card>

        {/* Update Email */}
        <Card>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Update Email Address
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your current email is <strong>{GlobalState.userEmail}</strong>. Enter your password to confirm the change.
          </Typography>
          <form onSubmit={handleEmailSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}>
              <TextField
                label="New email address"
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Current password"
                type="password"
                value={emailPassword}
                onChange={e => setEmailPassword(e.target.value)}
                required
                fullWidth
              />
              {emailError && (
                <Typography variant="body2" color="error">{emailError}</Typography>
              )}
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={emailSubmitting}
                  sx={{ textTransform: 'none' }}
                >
                  {emailSubmitting ? <CircularProgress size={20} /> : 'Update Email'}
                </Button>
              </Box>
            </Box>
          </form>
        </Card>

        {/* Change Password */}
        <Card>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose a strong password you don't use anywhere else.
          </Typography>
          <form onSubmit={handlePasswordSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}>
              <TextField
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="New password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />
              {passwordError && (
                <Typography variant="body2" color="error">{passwordError}</Typography>
              )}
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={passwordSubmitting}
                  sx={{ textTransform: 'none' }}
                >
                  {passwordSubmitting ? <CircularProgress size={20} /> : 'Change Password'}
                </Button>
              </Box>
            </Box>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ border: '1px solid #d32f2f' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 0.5 }}>
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Permanently delete your account and all associated data. This cannot be undone.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            sx={{ textTransform: 'none' }}
            onClick={() => { setDeleteError(''); setDeletePassword(''); setDeleteOpen(true) }}
          >
            Delete My Account
          </Button>
        </Card>

      </Grid>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete your account?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This will permanently delete your account and all the records you have submitted.
            This action cannot be undone. Enter your password to confirm.
          </DialogContentText>
          <TextField
            label="Current password"
            type="password"
            value={deletePassword}
            onChange={e => setDeletePassword(e.target.value)}
            fullWidth
            autoFocus
          />
          {deleteError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteSubmitting || !deletePassword}
            onClick={handleDeleteConfirm}
            sx={{ textTransform: 'none' }}
          >
            {deleteSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      <MySnackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <LidarFooter />
    </>
  )
}

export default Account
