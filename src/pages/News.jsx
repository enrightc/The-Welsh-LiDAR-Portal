import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Card, CardContent, Link, Chip, CardMedia, Container } from "@mui/material";

export default function News() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    fetch(`${BASE}/api/news/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => {
        console.error("Failed to load news:", err);
        setItems([]);
      });
  }, []);

  function getExcerpt(text) {
    if (!text) return "";
    const maxLength = 120;
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "…";
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: { xs: 2.5, md: 3 },
        }}
      >
        {items.map((n) => (
          <Card
            key={n.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
              
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
                    <Chip key={tag.id} label={tag.name} size="small" sx={{ fontWeight: 500 }} />
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