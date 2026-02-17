import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link, Card, CardContent, CardMedia } from "@mui/material";

export default function NewsArticle() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    fetch(`${BASE}/api/news/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setItem(data))
      .catch((err) => {
        console.error("Failed to load article:", err);
        setItem(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Typography sx={{ p: 2 }}>Loading…</Typography>;
  if (!item) return <Typography sx={{ p: 2 }}>Article not found.</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Link component={RouterLink} to="/news" underline="hover">
        ← Back to news
      </Link>
      <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        {item.image && (
          <CardMedia
            component="img"
            height="360"
            image={item.image}
            alt={item.title}
            sx={{
              objectFit: "cover",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
        )}

        <CardContent>
          <Typography variant="h3" sx={{ mt: 0, fontWeight: 700 }}>
            {item.title}
          </Typography>

          {item.published_at && (
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              {new Date(item.published_at).toLocaleDateString("en-GB")}
            </Typography>
          )}

          <Typography sx={{ mt: 3, whiteSpace: "pre-wrap" }}>
            {item.content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}