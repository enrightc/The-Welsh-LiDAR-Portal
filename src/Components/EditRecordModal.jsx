import React, { useState, useEffect } from 'react'
import Axios from 'axios'

import { siteOptions, monumentOptions, periodOptions } from '../Constants/Options'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export default function EditRecordModal({ open, onClose, record, onSuccess }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [prn, setPrn] = useState('')
  const [siteType, setSiteType] = useState('')
  const [monumentType, setMonumentType] = useState('')
  const [period, setPeriod] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Populate fields when the record changes
  useEffect(() => {
    if (record) {
      setTitle(record.title || '')
      setDescription(record.description || '')
      setPrn(record.PRN || '')
      setSiteType(record.site_type || '')
      setMonumentType(record.monument_type || '')
      setPeriod(record.period || '')
      setErrors({})
    }
  }, [record])

  // Reset monument type when site type changes
  function handleSiteTypeChange(value) {
    setSiteType(value)
    setMonumentType('')
  }

  const availableMonuments = monumentOptions[siteType] || []

  function validate() {
    const e = {}
    if (!title.trim()) e.title = 'Title is required.'
    if (!description.trim()) e.description = 'Description is required.'
    if (!siteType) e.siteType = 'Site type is required.'
    if (!monumentType) e.monumentType = 'Monument type is required.'
    if (!period) e.period = 'Period is required.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await Axios.patch(
        `${BASE_URL}/api/records/${record.id}/`,
        {
          title: title.trim(),
          description: description.trim(),
          PRN: prn.trim() || null,
          site_type: siteType,
          monument_type: monumentType,
          period,
        },
        { headers: { Authorization: `Token ${localStorage.getItem('theUserToken')}` } }
      )
      onSuccess()
      onClose()
    } catch (err) {
      const data = err.response?.data
      if (data) {
        setErrors({ server: Object.values(data).flat().join(' ') })
      } else {
        setErrors({ server: 'Update failed. Please try again.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!record) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        Edit Record
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <TextField
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              fullWidth
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
            />

            <TextField
              label="PRN (optional)"
              value={prn}
              onChange={e => setPrn(e.target.value)}
              fullWidth
            />

            <TextField
              label="Site Type"
              value={siteType}
              onChange={e => handleSiteTypeChange(e.target.value)}
              required
              select
              fullWidth
              error={!!errors.siteType}
              helperText={errors.siteType}
            >
              {siteOptions.filter(o => o.value).map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Monument Type"
              value={monumentType}
              onChange={e => setMonumentType(e.target.value)}
              required
              select
              fullWidth
              disabled={!siteType}
              error={!!errors.monumentType}
              helperText={errors.monumentType || (!siteType ? 'Select a site type first' : '')}
            >
              {availableMonuments.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Period"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              required
              select
              fullWidth
              error={!!errors.period}
              helperText={errors.period}
            >
              {periodOptions.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>

            {errors.server && (
              <Typography variant="body2" color="error">{errors.server}</Typography>
            )}

          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ backgroundColor: '#FFD034', color: 'black', textTransform: 'none', '&:hover': { backgroundColor: '#e6bc2e' } }}
          >
            {submitting ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
