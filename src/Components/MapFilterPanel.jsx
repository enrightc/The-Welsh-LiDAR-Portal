import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const PERIODS = [
  { value: 'neolithic',     label: 'Neolithic' },
  { value: 'bronze_age',    label: 'Bronze Age' },
  { value: 'iron_age',      label: 'Iron Age' },
  { value: 'roman',         label: 'Roman' },
  { value: 'medieval',      label: 'Medieval' },
  { value: 'post_medieval', label: 'Post Medieval' },
  { value: 'modern',        label: 'Modern' },
  { value: 'unknown',       label: 'Unknown' },
]

const SITE_TYPES = [
  { value: 'enclosure',   label: 'Enclosure' },
  { value: 'mound',       label: 'Mound' },
  { value: 'field_system',label: 'Field System' },
  { value: 'settlement',  label: 'Settlement' },
  { value: 'trackway',    label: 'Trackway' },
  { value: 'industrial',  label: 'Industrial' },
  { value: 'pit',         label: 'Pit' },
  { value: 'bank',        label: 'Bank' },
  { value: 'ditch',       label: 'Ditch' },
  { value: 'other',       label: 'Other' },
  { value: 'unknown',     label: 'Unknown' },
]

export default function MapFilterPanel({
  open,
  onClose,
  selectedPeriods,
  selectedSiteTypes,
  onTogglePeriod,
  onToggleSiteType,
  onClearAll,
  totalCount,
  filteredCount,
}) {
  if (!open) return null

  const hasFilters = selectedPeriods.length > 0 || selectedSiteTypes.length > 0

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        width: 280,
        maxHeight: 'calc(100% - 80px)',
        overflowY: 'auto',
        bgcolor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.4)',
        p: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Filter Records
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close filter panel">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Record count */}
      <Typography variant="caption" color={hasFilters ? 'primary' : 'text.secondary'} sx={{ display: 'block', mb: 1.5 }}>
        {hasFilters
          ? `Showing ${filteredCount} of ${totalCount} records`
          : `${totalCount} records on map`}
      </Typography>

      <Divider sx={{ mb: 1.5 }} />

      {/* Period */}
      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
        Period
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
        {PERIODS.map(p => (
          <FormControlLabel
            key={p.value}
            label={<Typography variant="body2">{p.label}</Typography>}
            control={
              <Checkbox
                size="small"
                checked={selectedPeriods.includes(p.value)}
                onChange={() => onTogglePeriod(p.value)}
                sx={{ py: 0.25 }}
              />
            }
            sx={{ mx: 0, my: 0 }}
          />
        ))}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Site Type */}
      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
        Site Type
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
        {SITE_TYPES.map(s => (
          <FormControlLabel
            key={s.value}
            label={<Typography variant="body2">{s.label}</Typography>}
            control={
              <Checkbox
                size="small"
                checked={selectedSiteTypes.includes(s.value)}
                onChange={() => onToggleSiteType(s.value)}
                sx={{ py: 0.25 }}
              />
            }
            sx={{ mx: 0, my: 0 }}
          />
        ))}
      </Box>

      {/* Clear all */}
      {hasFilters && (
        <>
          <Divider sx={{ mt: 1.5, mb: 1 }} />
          <Button
            size="small"
            onClick={onClearAll}
            sx={{ textTransform: 'none', p: 0 }}
          >
            Clear all filters
          </Button>
        </>
      )}
    </Box>
  )
}
