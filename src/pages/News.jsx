import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Card, CardContent, Link, Chip, CardMedia, Container, CircularProgress } from "@mui/material";
import SellIcon from '@mui/icons-material/Sell';

export default function News() {
  const [items, setItems] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    setLoading(true);


    fetch(`${BASE}/api/news/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => {
        console.error("Failed to load news:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  function getExcerpt(text) {
    if (!text) return "";
    const maxLength = 120;
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "…";
  }

  // -----------------------------
  // Build list of available tags
  // -----------------------------
  // This creates a unique, alphabetically sorted list of all tags
  // found across the fetched news items.
  //
  // We use a Map to prevent duplicate tags (keyed by tag.id).
  // useMemo ensures this only recalculates when `items` changes.
  const availableTags = useMemo(() => {
    const map = new Map();
    for (const n of items) {
      if (!n.tags) continue;
      for (const t of n.tags) {
        if (t?.id == null) continue;
        map.set(t.id, t);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  // -----------------------------
  // Filter news items by selected tags
  // -----------------------------
  // If no tags are selected, return all items.
  // If tags are selected, return items that match ANY selected tag.
  //
  // This recalculates only when either the full list of items
  // or the selectedTagIds array changes.
  const filteredItems = useMemo(() => {
    if (!selectedTagIds.length) return items;
    return items.filter((n) => (n.tags || []).some((t) => selectedTagIds.includes(t.id)));
  }, [items, selectedTagIds]);

  // Toggle a tag in the selectedTagIds state.
  // If the tag is already selected, remove it.
  // If it is not selected, add it.
  function toggleTag(tagId) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  // Reset all active tag filters.
  // After this runs, the full list of news items is shown again.
  function clearFilters() {
    setSelectedTagIds([]);
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h1" component="h1" sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}>
          News
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}>
          <CircularProgress aria-label="Loading news" />
        </Box>

        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          Loading stories…
        </Typography>
      </Container>
    );
  }


  if (!items.length) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h1" component="h1" sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}>
          News
        </Typography>
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No news yet. Check back soon.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h1"
        component="h1"
        sx={{
          mb: 1,
          textAlign: "center",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        News
      </Typography>

      <Typography
        sx={{
          mb: { xs: 4, md: 5 },
          textAlign: "center",
          color: "text.secondary",
          maxWidth: 720,
          mx: "auto",
        }}
      >
        Updates, inspiration, and stories from the Welsh LiDAR Portal.
      </Typography>

      {/*
        Tag filter bar
        ----------------
        This section renders the clickable tag filters shown above the news grid.
        It only appears if there are tags available.

        - "All / Clear filters" resets the selectedTagIds state
        - Each Chip represents a tag found in the news items
        - Clicking a tag toggles it on/off via toggleTag()
        - Selected tags are visually highlighted (filled + primary colour)
      */}
      {availableTags.length > 0 && (
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Reset button: clears all active tag filters */}
          <Chip
            label={selectedTagIds.length ? "Clear filters" : "All"}
            onClick={clearFilters}
            variant={selectedTagIds.length ? "filled" : "outlined"}
            sx={{ fontWeight: 700 }}
          />

          {/* Render one Chip per available tag */}
          {availableTags.map((tag) => (
            <Chip
              key={tag.id}
              icon={<SellIcon fontSize="small" />}
              label={tag.name}
              clickable
              onClick={() => toggleTag(tag.id)}
              color={selectedTagIds.includes(tag.id) ? "primary" : "default"}
              variant={selectedTagIds.includes(tag.id) ? "filled" : "outlined"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: { xs: 2.5, md: 3 },
        }}
      >
        {/*
          Empty state message
          -------------------
          This renders when the active tag filters remove all results.
          It spans the full grid width and provides a quick way to reset filters.
        */}
        {filteredItems.length === 0 && (
          <Card sx={{ gridColumn: "1 / -1", p: 3, textAlign: "center", boxShadow: 0, border: "1px solid rgba(0,0,0,0.08)" }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>No results</Typography>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              Try clearing your filters or selecting a different tag.
            </Typography>
            <Chip label="Clear filters" onClick={clearFilters} sx={{ fontWeight: 700 }} />
          </Card>
        )}

        {/*
          Render news cards
          -----------------
          This maps over the filteredItems array and renders one
          responsive card per news article.
        */}
        {filteredItems.map((n) => (
          <Card
            key={n.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 2,
              transition: "transform 160ms ease, box-shadow 160ms ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: 6,
              },
            }}
          >
            {n.image && (
              <CardMedia
                component="img"
                height="180"
                image={n.image}
                alt={n.title}
                sx={{ objectFit: "cover" }}
              />
            )}

            <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.15rem", md: "1.25rem" },
                  lineHeight: 1.2,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {n.title}
              </Typography>

              {n.published_at && (
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", mt: 1 }}
                >
                  {new Date(n.published_at).toLocaleDateString("en-GB")}
                </Typography>
              )}

              {n.tags && n.tags.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {n.tags.map((tag) => (
                    <Chip 
                      key={tag.id} 
                      icon={<SellIcon fontSize="small" />}
                      label={tag.name} 
                      size="small" 
                      sx={{ fontWeight: 500 }} />
                  ))}
                </Box>
              )}

              <Typography
                sx={{
                  mt: 2,
                  color: "text.secondary",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  overflow: "hidden",
                }}
              >
                {getExcerpt(n.content)}
              </Typography>

              <Box sx={{ mt: "auto", pt: 2 }}>
                <Link
                  component={RouterLink}
                  to={`/news/${n.id}`}
                  underline="hover"
                  sx={{ fontWeight: 700 }}
                  aria-label={`Read more: ${n.title}`}
                >
                  Read more →
                </Link>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}