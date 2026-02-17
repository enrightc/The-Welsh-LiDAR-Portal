import { useEffect, useState } from "react";
import { Box, Typography, Stack, Card, CardContent, Link } from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import LidarFooter from "../Components/LidarFooter";
import Support from "../Components/Support";

const LINK_MAP = { support: "#support", feedback: "/feedback" };

function renderWithLinks(text) {
  if (!text) return null;
  const regex = /(support|feedback)/gi;
  const nodes = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const key = match[0].toLowerCase();
    if (key === "support") {
      nodes.push(
        <Link
          key={`${key}-${match.index}`}
          href="#support"
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          {match[0]}
        </Link>
      );
    } else {
      nodes.push(
        <Link
          key={`${key}-${match.index}`}
          component={RouterLink}
          to={LINK_MAP[key]}
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          {match[0]}
        </Link>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function getExcerpt(text, max = 260) {
  if (!text) return "";
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trimEnd() + "…";
}


export default function NewsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BASE = import.meta.env.VITE_BACKEND_URL || "";
    const url = `${BASE}/api/news/`;
    fetch(url) // same origin proxy; see note below if different ports
      .then((r) => r.json())
      .then(setItems)
      .catch((e) => console.error("Failed to load news", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Typography>Loading news…</Typography>;
  if (!items.length) return <Typography>No news yet.</Typography>;

  return (
    <>
        <Box component="section" sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
            
            <Typography variant="h1" component="h1" sx={{ my: 4, textAlign: "center", fontWeight: 600, }}>
            News
            </Typography>

            <Stack spacing={3} sx={{mb: 12,}}>
                {items.map((n, idx) => (

                <Card
                    key={n.id}
                    sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    mb: 9,
                    backgroundColor: idx % 2 === 0 ? '#F6F2E8' : '#EEF3F4',
                    }}
                >
                    
                    <CardContent>
                    <Typography variant="h2" component="h2" gutterBottom sx={{fontWeight: 600,
                    }}>
                        {n.title}
                    </Typography>
                    {n.published_at && (
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 4 }}>
                        {new Date(n.published_at).toLocaleDateString()}
                        </Typography>
                    )}
                      <Typography sx={{ mt: 1 }}>
                        {getExcerpt(n.content)}
                      </Typography>

                      <Link
                        component={RouterLink}
                        to={`/news/${n.id}`}
                        underline="hover"
                        sx={{ display: "inline-block", mt: 2, fontWeight: 600 }}
                      >
                        Read more
                      </Link>
                    </CardContent>
                </Card>
                ))}
            </Stack>

            
        </Box>

        <Box id="support">
            <Support />
        </Box>
        <LidarFooter />
    </>         
    
  );
}