import React from 'react'

// Mui Imports
import Dialog from '@mui/material/Dialog'; // Container for the modal
import DialogTitle from '@mui/material/DialogTitle'; // The top header area
import DialogContent from '@mui/material/DialogContent'; // scrollable/content section
import DialogActions from '@mui/material/DialogActions'; // the bottom bar, usually for buttons like "close" or "save"
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';

// Constants

import { siteOptions, monumentOptions } from '../Constants/Options';

// A reusable modal component for helping with monument and site types.
// Props:
//  - open (boolean): whether the dialog is visible.
//  - onClose (function): called when the dialog should be closed.
export default function SiteMonumentHelpModal({ open, onClose }) {

    // Keep display order consistent with the Site Type dropdown
    const orderedEntries = (siteOptions || []) // use array of site options if it exists. if it doesnt use empty array []
    .map(option => [ (option.value ?? option), monumentOptions[option.value ?? option] ]) // For each item in siteOptions take its value (option.value) otherwise just use the option itself (option)
    // find all the monument types for that site in monumentOptions
    // put them together as a pair e.g. ["enclosure", [list of monument types]]
    // e.g. If option = { value: "enclosure", label: "Enclosure" }
	//option.value ?? option → "enclosure"
	//monumentOptions["enclosure"] → [ { value: "banjo", … }, { value: "hillfort", … } ]
    .filter(([, mons]) => Array.isArray(mons) && mons.length > 0);
    // filter removes any site types that don't have monuments
    // ([, mons]) = array destructuring → ignore the first item (siteKey), take the second (mons array)
    // Array.isArray(mons) → check that mons is a real array
    // mons.length > 0 → make sure the array is not empty
    // result = only keep site types with at least one monument

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" aria-labelledby="site-monument-help-title">
            <DialogTitle id="site-monument-help-title">Site Type → Monument Types</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Choose a broad Site Type first, then pick the matching Monument Type.
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
                        gap: 2,
                        alignItems: 'start',
                    }}
                    >
                    {(orderedEntries.length ? orderedEntries : Object.entries(monumentOptions))
                        // Ternary check: if orderedEntries has items (length > 0), use it. 
                        // Otherwise fall back to Object.entries(monumentOptions) (convert the object into [key, value] pairs)

                    .map(([siteKey, mons]) => (
                        // Loops through each [siteKey, mons] pair
                        // siteKey = the string key like "enclosure" or "mound"
                        // mons = the array of monuments for that site type

                        // Each Site Type gets its own Paper "card"
                        <Paper key={siteKey} variant="outlined" sx={{ p: 1.5, height: '100%',  }}>

                        {/* header for card     */}
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, textTransform: 'capitalize', mb: 0.75 }}>
                            {/* takes site type key (e.g. field)system) and converts underscores to spaces */}
                            {String(siteKey).replaceAll('_', ' ')}
                        </Typography>

                        {/* Starts a list */}
                        <List sx={{ m: 0, pl: 2 }}>
                            {mons.map(m => (
                                // Loops though every monument in the mons array
                                // for each m....
                        
                            <ListItem key={m?.value ?? m} sx={{ py: 0.2, px: 0 }}>
                                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                                {m?.label ?? m}
                                {/* key={m?.value ?? m} → use m.value if it’s an object, otherwise use the string itself.  */}
                                </Typography>
                            </ListItem>
                            ))}
                        </List>
                        </Paper>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Got it</Button>
            </DialogActions>
        </Dialog>
    );
}

