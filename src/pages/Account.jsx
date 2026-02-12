import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Stack,
  Divider,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";

import LidarFooter from "../Components/LidarFooter";

function TabPanel({ value, index, children }) {
  if (value !== index) return null;
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {children}
    </Box>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          {description ? (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        <Divider />
        {children}
      </Stack>
    </Paper>
  );
}

export default function Account() {
  const [tab, setTab] = useState(0);

  // Security form state (UI only for now)
  const [email, setEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");

  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailError, setEmailError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Notifications state (email only)
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyMentions, setNotifyMentions] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(false);

  // Privacy state (no private finds yet, keep it simple)
  const [showProfilePublicly, setShowProfilePublicly] = useState(true);
  const [showLocationRegionOnly, setShowLocationRegionOnly] = useState(true);

  const passwordMismatch = useMemo(() => {
    if (!newPassword && !confirmNewPassword) return false;
    return newPassword !== confirmNewPassword;
  }, [newPassword, confirmNewPassword]);

  // Base URL for the backend API.
  // If you already have an axios helper (e.g. API.jsx), you can swap this fetch call to use it instead.
  const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

  // Change Password
  const handleSavePassword = async () => {
    // Basic front-end checks
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword || !newPassword) {
      setPasswordError("Please enter your current password and a new password.");
      return;
    }

    if (passwordMismatch) {
      setPasswordError("Your new password and confirmation do not match.");
      return;
    }

    // Djoser expects the token in the Authorization header: "Token <token>"
    const token = localStorage.getItem("theUserToken");
    if (!token) {
      setPasswordError("You are not signed in. Please sign in again and retry.");
      return;
    }

    setSavingPassword(true);

    try {
      // Common Djoser endpoint when mounted at /auth/
      // If your backend mounts Djoser under a different prefix, change this path.
      const url = `${API_BASE_URL}/api-auth-djoser/users/set_password/`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        // Djoser typically returns a JSON object with field errors
        let message = "Sorry — your password could not be updated.";
        try {
          const data = await res.json();
          // Examples: { current_password: ["Invalid password."] } or { new_password: ["..."] }
          const firstKey = data && typeof data === "object" ? Object.keys(data)[0] : null;
          if (firstKey && Array.isArray(data[firstKey]) && data[firstKey][0]) {
            message = data[firstKey][0];
          }
        } catch {
          // ignore JSON parse issues
        }
        setPasswordError(message);
        return;
      }

      setPasswordSuccess("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError("Network error — please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  // Change Email
  const handleSaveEmail = async () => {
  // Clear old messages
  setEmailSuccess("");
  setEmailError("");

  // Basic check
  if (!email) {
    setEmailError("Please enter a new email address.");
    return;
  }

  // Get token (must be logged in)
  const token = localStorage.getItem("theUserToken");
  if (!token) {
    setEmailError("You are not signed in. Please sign in again and retry.");
    return;
  }

  setSavingEmail(true);

  try {
    const url = `${API_BASE_URL}/api-auth-djoser/users/me/`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      // Try to read the error message from the API response
      let message = "Sorry — your email could not be updated.";
      try {
        const data = await res.json();
        const firstKey = data && typeof data === "object" ? Object.keys(data)[0] : null;
        if (firstKey && Array.isArray(data[firstKey]) && data[firstKey][0]) {
          message = data[firstKey][0];
        }
      } catch {
        // ignore JSON parse issues
      }
      setEmailError(message);
      return;
    }

    // Success
    setEmailSuccess("Email updated.");
    setCurrentPasswordForEmail(""); // optional field, but nice to clear it
  } catch {
    setEmailError("Network error — please try again.");
  } finally {
    setSavingEmail(false);
  }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Account settings
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85 }}>
              Manage sign-in and security, email notifications, privacy, and your data.
            </Typography>
          </Box>

          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
                minHeight: { md: 520 },
              }}
            >
              {/* Left nav */}
              <Box
                sx={{
                  borderRight: { md: "1px solid" },
                  borderColor: "divider",
                }}
              >
                <Tabs
                  orientation="vertical"
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  variant="scrollable"
                  sx={{
                    "& .MuiTab-root": {
                      alignItems: "flex-start",
                      textTransform: "none",
                      py: 2,
                      px: 2.5,
                    },
                  }}
                >
                  <Tab label="Sign-in and security" />
                  <Tab label="Notifications" />
                  <Tab label="Privacy" />
                  <Tab label="Data export" />
                  <Tab label="Delete account" />
                </Tabs>
              </Box>

              {/* Right content */}
              <Box>
                {/* 0: Security */}
                <TabPanel value={tab} index={0}>
                  <Stack spacing={2}>
                    <SectionCard
                      title="Change email"
                      description="This is the email you use to sign in. You’ll typically need to confirm the new email address."
                    >
                      <Stack spacing={2}>
                        <TextField
                          label="New email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                            setEmailSuccess("");
                          }}
                          fullWidth
                        />
                        <TextField
                          label="Current password"
                          type="password"
                          value={currentPasswordForEmail}
                          onChange={(e) => {
                            setCurrentPasswordForEmail(e.target.value);
                            setEmailError("");
                            setEmailSuccess("");
                          }}
                          fullWidth
                        />
                        {emailError ? <Alert severity="error">{emailError}</Alert> : null}
                        {emailSuccess ? <Alert severity="success">{emailSuccess}</Alert> : null}
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          <Button
                            variant="contained"
                            disabled={!email || savingEmail}
                            onClick={handleSaveEmail}
                          >
                            {savingEmail ? "Saving…" : "Save email"}
                          </Button>
                        </Box>
                      </Stack>
                    </SectionCard>

                    <SectionCard
                      title="Change password"
                      description="Choose a strong password you don’t use anywhere else."
                    >
                      <Stack spacing={2}>
                        <TextField
                          label="Current password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(""); setPasswordSuccess(""); }}
                          fullWidth
                        />
                        <TextField
                          label="New password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); setPasswordSuccess(""); }}
                          fullWidth
                        />
                        <TextField
                          label="Confirm new password"
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => { setConfirmNewPassword(e.target.value); setPasswordError(""); setPasswordSuccess(""); }}
                          error={passwordMismatch}
                          helperText={passwordMismatch ? "Passwords do not match." : " "}
                          fullWidth
                        />

                        {passwordMismatch ? (
                          <Alert severity="warning">
                            Your new password and confirmation need to match before you can save.
                          </Alert>
                        ) : null}

                        {passwordError ? (
                          <Alert severity="error">{passwordError}</Alert>
                        ) : null}

                        {passwordSuccess ? (
                          <Alert severity="success">{passwordSuccess}</Alert>
                        ) : null}

                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          <Button
                            variant="contained"
                            disabled={!currentPassword || !newPassword || passwordMismatch || savingPassword}
                            onClick={handleSavePassword}
                          >
                            {savingPassword ? "Saving…" : "Save password"}
                          </Button>
                        </Box>
                      </Stack>
                    </SectionCard>
                  </Stack>
                </TabPanel>

                {/* 1: Notifications */}
                <TabPanel value={tab} index={1}>
                  <Stack spacing={2}>
                    <SectionCard
                      title="Email notifications"
                      description="Choose which emails you want to receive. You can change these at any time."
                    >
                      <Stack spacing={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifyComments}
                              onChange={(e) => setNotifyComments(e.target.checked)}
                            />
                          }
                          label="Comments or replies on my finds"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifyMentions}
                              onChange={(e) => setNotifyMentions(e.target.checked)}
                            />
                          }
                          label="Mentions (when someone tags me)"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifyDigest}
                              onChange={(e) => setNotifyDigest(e.target.checked)}
                            />
                          }
                          label="Weekly digest"
                        />

                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
                          <Button variant="contained" onClick={() => alert("Save preferences later")}>
                            Save preferences
                          </Button>
                        </Box>
                      </Stack>
                    </SectionCard>
                  </Stack>
                </TabPanel>

                {/* 2: Privacy */}
                <TabPanel value={tab} index={2}>
                  <Stack spacing={2}>
                    <SectionCard
                      title="Profile visibility"
                      description="Control what other users can see about you."
                    >
                      <Stack spacing={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showProfilePublicly}
                              onChange={(e) => setShowProfilePublicly(e.target.checked)}
                            />
                          }
                          label="Show my profile publicly"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showLocationRegionOnly}
                              onChange={(e) => setShowLocationRegionOnly(e.target.checked)}
                            />
                          }
                          label="Show my location as region only (not exact)"
                        />

                        <Alert severity="info" sx={{ mt: 1 }}>
                          You don’t have private finds yet, so these settings only affect your profile details for now.
                        </Alert>

                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
                          <Button variant="contained" onClick={() => alert("Save privacy later")}>
                            Save privacy
                          </Button>
                        </Box>
                      </Stack>
                    </SectionCard>
                  </Stack>
                </TabPanel>

                {/* 3: Data export */}
                <TabPanel value={tab} index={3}>
                  <Stack spacing={2}>
                    <SectionCard
                      title="Download your data"
                      description="Export a copy of your account data and contributions."
                    >
                      <Stack spacing={2}>
                        <Alert severity="info">
                          Start simple: export JSON or CSV. You can add “email me when ready” later if exports get big.
                        </Alert>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          <Button variant="outlined" onClick={() => alert("Export account JSON later")}>
                            Export account (JSON)
                          </Button>
                          <Button variant="outlined" onClick={() => alert("Export finds CSV later")}>
                            Export finds (CSV)
                          </Button>
                        </Box>
                      </Stack>
                    </SectionCard>
                  </Stack>
                </TabPanel>

                {/* 4: Delete account */}
                <TabPanel value={tab} index={4}>
                  <Stack spacing={2}>
                    <SectionCard
                      title="Danger zone"
                      description="Deleting your account is permanent and cannot be undone."
                    >
                      <Stack spacing={2}>
                        <Alert severity="warning">
                          Before you implement this, decide what happens to any finds you’ve created:
                          delete them, or anonymise them.
                        </Alert>

                        <TextField
                          label='Type "DELETE" to confirm'
                          placeholder="DELETE"
                          fullWidth
                        />
                        <TextField
                          label="Password"
                          type="password"
                          fullWidth
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => alert("Wire to Djoser delete endpoint later")}
                          >
                            Delete my account
                          </Button>
                        </Box>
                      </Stack>
                    </SectionCard>
                  </Stack>
                </TabPanel>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>

      <LidarFooter />
    </>
  );
}