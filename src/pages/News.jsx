import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import LidarFooter from '../Components/LidarFooter'
import Support from '../Components/Support'
import '../assets/styles/Home.css'
import '../assets/styles/news.css'

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function News() {
  const [items, setItems] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'News | Welsh LiDAR Portal'
    const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    fetch(`${BASE}/api/news/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => setItems(data))
      .catch(err => {
        console.error('Failed to load news:', err)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [])

  const availableTags = useMemo(() => {
    const map = new Map()
    for (const n of items) {
      for (const t of n.tags ?? []) {
        if (t?.id != null) map.set(t.id, t)
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  const filteredItems = useMemo(() => {
    if (!selectedTagIds.length) return items
    return items.filter(n => (n.tags ?? []).some(t => selectedTagIds.includes(t.id)))
  }, [items, selectedTagIds])

  function toggleTag(tagId) {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  function clearFilters() {
    setSelectedTagIds([])
  }

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero__text">
              <h1 className="hero__title">Latest <span className="accent">News</span></h1>
              <p className="hero__tagline">Updates, discoveries, and stories from the Welsh LiDAR Portal.</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="news-section" aria-label="News articles">
          <div className="container">

            {/* Tag filters */}
            {!loading && availableTags.length > 0 && (
              <div className="tag-filters" role="group" aria-label="Filter by tag">
                <button
                  className={`tag-filter-btn${!selectedTagIds.length ? ' tag-filter-btn--active' : ''}`}
                  onClick={clearFilters}
                >
                  All
                </button>
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    className={`tag-filter-btn${selectedTagIds.includes(tag.id) ? ' tag-filter-btn--active' : ''}`}
                    onClick={() => toggleTag(tag.id)}
                    aria-pressed={selectedTagIds.includes(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="news-loading">
                <div className="news-spinner" aria-hidden="true" />
                <p>Loading stories…</p>
              </div>
            )}

            {/* No articles at all */}
            {!loading && items.length === 0 && (
              <p className="news-empty">No news yet — check back soon.</p>
            )}

            {/* Active filters with no results */}
            {!loading && items.length > 0 && filteredItems.length === 0 && (
              <div className="news-no-results">
                <p>No articles match the selected filters.</p>
                <button className="tag-filter-btn tag-filter-btn--active" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && filteredItems.length > 0 && (
              <ul className="news-grid">
                {filteredItems.map(n => (
                  <li key={n.id} style={{ display: 'flex' }}>
                    <Link
                      to={`/news/${n.id}`}
                      className="news-card"
                      aria-label={`Read article: ${n.title}`}
                    >
                      {n.image && (
                        <img className="news-card__img" src={n.image} alt="" loading="lazy" />
                      )}
                      <div className="news-card__body">
                        <h2 className="news-card__title" aria-hidden="true">{n.title}</h2>
                        {n.published_at && (
                          <p className="news-card__date">{formatDate(n.published_at)}</p>
                        )}
                        {n.tags?.length > 0 && (
                          <div className="news-card__tags" aria-hidden="true">
                            {n.tags.map(tag => (
                              <span key={tag.id} className="tag-pill">{tag.name}</span>
                            ))}
                          </div>
                        )}
                        {n.content && (
                          <p className="news-card__excerpt" aria-hidden="true">{n.content}</p>
                        )}
                        <span className="news-card__read-more" aria-hidden="true">Read more →</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <Support />
      <LidarFooter />
    </>
  )
}
