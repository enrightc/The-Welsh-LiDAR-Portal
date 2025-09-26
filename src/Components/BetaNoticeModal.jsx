// src/components/BetaNoticeModal.jsx
import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";

/*
  BetaNoticeModal
  ----------------
  Shows once per session (tab) or local storage by default.
*/
export default function BetaNoticeModal({
  
  storage = "session",        // "session" | "local" | "none"
  forceOpen = false,          // for debugging
  onClose
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) { setOpen(true); return; }
    if (storage === "none") { setOpen(true); return; }

    const api = storage === "local" ? localStorage : sessionStorage;
    const storageKey = "wlidar_seen_beta";
    try {
      if (!api.getItem(storageKey)) {
        setOpen(true);
        api.setItem(storageKey, "1");
      }
    } catch {
      // If storage is blocked (e.g. private mode), just show it.
      setOpen(true);
    }
  }, [forceOpen, storage]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="beta-modal-title">
      <DialogTitle id="beta-modal-title">Welcome to The Welsh LiDAR Portal</DialogTitle>
      <DialogContent dividers>
        
          <Typography >
            This site is currently in beta and still under development.
            It is being released for testing purposes only.
            Features may change, and you may encounter bugs or incomplete content.
            We’d love your feedback as we continue to improve!
          </Typography>
      
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
}