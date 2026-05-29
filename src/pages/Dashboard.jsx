import React, { useEffect, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { MapContainer, Polygon, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import StateContext from '../Contexts/StateContext'
import LidarFooter from '../Components/LidarFooter'
import RecordDetail from '../Components/RecordDetail'
import EditRecordModal from '../Components/EditRecordModal'
import CustomLayerControl from '../Components/CustomLayerControl'
import defaultProfilePicture from '../Components/Assets/defaultProfilePicture.webp'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

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

function FitAllPolygons({ allCoords }) {
  const map = useMap()
  useEffect(() => {
    const flat = allCoords.flat()
    if (flat.length) map.fitBounds(flat)
  }, [allCoords, map])
  return allCoords.map((coords, i) => <Polygon key={i} positions={coords} />)
}

function Dashboard() {
  const navigate = useNavigate()
  const GlobalState = useContext(StateContext)

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  // View record modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Edit record modal
  const [editOpen, setEditOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)

  // Delete confirmation
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteRecord, setDeleteRecord] = useState(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  useEffect(() => {
    if (!GlobalState.userId) navigate('/login')
  }, [GlobalState.userId])

  const fetchProfile = useCallback(async () => {
    if (!GlobalState.userId) return
    try {
      const res = await Axios.get(`${BASE_URL}/api/profiles/${GlobalState.userId}/`)
      setProfile(res.data)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }, [GlobalState.userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  async function handleDeleteConfirm() {
    setDeleteSubmitting(true)
    try {
      await Axios.delete(`${BASE_URL}/api/records/${deleteRecord.id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('theUserToken')}` },
      })
      setDeleteOpen(false)
      setDeleteRecord(null)
      fetchProfile()
    } catch (e) {
      console.log(e)
    } finally {
      setDeleteSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '60vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  const records = profile?.user_records || []

  const periodCounts = records.reduce((acc, r) => {
    const label = r.period_display || 'Unknown'
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})

  const siteCounts = records.reduce((acc, r) => {
    const label = r.site_type_display || 'Unknown'
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})

  const allCoords = records
    .filter(r => Array.isArray(r.polygonCoordinate) && r.polygonCoordinate.length >= 3)
    .map(r => r.polygonCoordinate)

  return (
    <>
      <Grid container direction="column" sx={{ p: '4rem', backgroundColor: '#EEF3F4' }}>

        {/* Header */}
        <Card>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <img
              src={profile?.profile_picture || defaultProfilePicture}
              alt="Profile"
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
            />
            <Box>
              <Typography variant="h4">
                Welcome back,{' '}
                <span style={{ color: 'green', fontWeight: 'bold' }}>
                  {GlobalState.userUsername}
                </span>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                Your activity dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              sx={{ color: 'black', borderColor: 'black', textTransform: 'none', borderRadius: 2 }}
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              sx={{ color: 'black', borderColor: 'black', textTransform: 'none', borderRadius: 2 }}
              onClick={() => navigate('/LidarPortal')}
            >
              ← Back to Map
            </Button>
          </Box>
        </Card>

        {/* Quick Stats */}
        <Card>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quick Stats
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              alignItems: { sm: 'flex-start' },
            }}
          >
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography variant="h3" sx={{ color: 'green', fontWeight: 'bold', lineHeight: 1 }}>
                {records.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Total Records
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                By Period
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(periodCounts).length > 0 ? (
                  Object.entries(periodCounts).map(([period, count]) => (
                    <Chip key={period} label={`${period}: ${count}`} size="small" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No records yet</Typography>
                )}
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                By Site Type
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(siteCounts).length > 0 ? (
                  Object.entries(siteCounts).map(([type, count]) => (
                    <Chip key={type} label={`${type}: ${count}`} size="small" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No records yet</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Contributions Map */}
        {allCoords.length > 0 && (
          <Card>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your Contributions Map
            </Typography>
            <MapContainer
              bounds={allCoords.flat()}
              scrollWheelZoom
              style={{ height: 350, width: '100%', borderRadius: 8 }}
            >
              <CustomLayerControl />
              <FitAllPolygons allCoords={allCoords} />
            </MapContainer>
          </Card>
        )}

        {/* Contributions List */}
        <Card>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            My Contributions ({records.length})
          </Typography>

          {records.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                You haven't recorded any features yet.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, textTransform: 'none' }}
                onClick={() => navigate('/LidarPortal')}
              >
                Start Recording
              </Button>
            </Box>
          ) : (
            records.map(record => (
              <Box
                key={record.id}
                sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {record.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {record.monument_type_display} · {record.period_display}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recorded: {record.date_recorded}
                </Typography>
                {record.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {record.description.length > 120
                      ? `${record.description.slice(0, 120)}…`
                      : record.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                    onClick={() => { setSelectedRecord(record); setModalOpen(true) }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                    onClick={() => { setEditRecord(record); setEditOpen(true) }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ textTransform: 'none' }}
                    onClick={() => { setDeleteRecord(record); setDeleteOpen(true) }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Card>

      </Grid>

      <RecordDetail
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        record={selectedRecord}
      />

      <EditRecordModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        record={editRecord}
        onSuccess={fetchProfile}
      />

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this record?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{deleteRecord?.title}</strong> will be permanently removed. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteSubmitting}
            onClick={handleDeleteConfirm}
            sx={{ textTransform: 'none' }}
          >
            {deleteSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <LidarFooter />
    </>
  )
}

export default Dashboard
