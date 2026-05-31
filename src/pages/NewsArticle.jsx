import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LidarFooter from '../Components/LidarFooter'
import Support from '../Components/Support'
import '../assets/styles/Home.css'
import '../assets/styles/news.css'

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function NewsArticle() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'News | Welsh LiDAR Portal'
    const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    fetch(`${BASE}/api/news/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setItem(data)
        document.title = `${data.title} | Welsh LiDAR Portal`
      })
      .catch(err => {
        console.error('Failed to load article:', err)
        setItem(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const heroTitle = loading ? 'Loading…' : item ? item.title : 'Article not found'
  const heroTagline = !loading && item?.published_at ? formatDate(item.published_at) : null

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero__text">
              <p className="eyebrow-text">News</p>
              <h1 className="hero__title hero__title--article">{heroTitle}</h1>
              {heroTagline && <p className="hero__tagline">{heroTagline}</p>}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="article-section">
          <div className="container">

            {loading && (
              <div className="article-loading">
                <div className="news-spinner" aria-hidden="true" />
                <p>Loading article…</p>
              </div>
            )}

            {!loading && !item && (
              <div className="article-not-found">
                <p>This article could not be found.</p>
                <Link to="/news" className="article-back">← Back to news</Link>
              </div>
            )}

            {!loading && item && (
              <>
                <Link to="/news" className="article-back">← Back to news</Link>

                {item.image && (
                  <img
                    className="article-img"
                    src={item.image}
                    alt={item.title}
                  />
                )}

                <header className="article-header">
                  <div className="article-meta">
                    {item.published_at && (
                      <span className="article-date">{formatDate(item.published_at)}</span>
                    )}
                    {item.tags?.length > 0 && (
                      <div className="article-tags">
                        {item.tags.map(tag => (
                          <span key={tag.id} className="tag-pill">{tag.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </header>

                <div className="article-content">
                  {item.content}
                </div>
              </>
            )}

          </div>
        </section>
      </main>

      <Support />
      <LidarFooter />
    </>
  )
}
