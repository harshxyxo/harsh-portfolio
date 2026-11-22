import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'

export function ExperienceSection({ journey }) {
  const containerRef = useRef(null)
  const [roadPath, setRoadPath] = useState({ d: '', width: 1, height: 1 })
  const revealRef = useReveal()

  // Calculate dynamic curve connecting stop markers
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false

    const computeRoad = () => {
      if (cancelled) return
      const containerRect = container.getBoundingClientRect()
      const markers = Array.from(container.querySelectorAll('.journey-stop-marker'))
      const points = markers.map((marker) => {
        const rect = marker.getBoundingClientRect()
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        }
      })

      if (points.length < 2) return

      const isMobileStacked = window.matchMedia('(max-width: 700px)').matches
      let d = `M ${points[0].x} ${points[0].y}`

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        if (isMobileStacked) {
          const midY = (prev.y + curr.y) / 2
          d += ` C ${prev.x + 28} ${midY}, ${curr.x - 20} ${midY}, ${curr.x} ${curr.y}`
        } else {
          const midX = (prev.x + curr.x) / 2
          d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`
        }
      }

      setRoadPath({
        d,
        width: Math.max(containerRect.width, 1),
        height: Math.max(containerRect.height, 1),
      })
    }

    const resizeObserver = new ResizeObserver(computeRoad)
    resizeObserver.observe(container)
    container.querySelectorAll('.journey-stop').forEach((stop) => resizeObserver.observe(stop))

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        container.dataset.drawn = String(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )
    intersectionObserver.observe(container)

    computeRoad()
    if (document.fonts?.ready) {
      document.fonts.ready.then(computeRoad)
    }

    return () => {
      cancelled = true
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [journey])

  return (
    <section id="experience" className="experience-section section-pad reveal-section" ref={revealRef} aria-labelledby="experience-heading-title">
      <div className="wrap">
        <div className="experience-heading">
          <div>
            <p className="section-eyebrow">Academic &amp; Engineering Track</p>
            <h2 id="experience-heading-title">Education &amp;<br />Experience.</h2>
          </div>
          <p>
            Academic milestones.<br />
            Core computer science journey.
          </p>
        </div>

        <div className="journey-roadmap" ref={containerRef}>
          {/* Animated SVG Path Connecting Career / Academic Stops */}
          <svg
            className="journey-road"
            viewBox={`0 0 ${roadPath.width} ${roadPath.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="journey-road-base" d={roadPath.d} />
            <path className="journey-road-ink" d={roadPath.d} pathLength={1} />
          </svg>

          {journey.map((stop) => (
            <article
              key={stop.id}
              className={`journey-stop ${stop.isCurrent ? 'journey-now' : ''} journey-${stop.id}`}
              aria-labelledby={`stop-title-${stop.id}`}
            >
              <span className="journey-stop-marker" aria-hidden="true">
                <span />
              </span>

              <div className="journey-stop-content">
                <p className="journey-date">
                  {stop.isCurrent && (
                    <span className="journey-current">{stop.currentLabel || 'Current status'}</span>
                  )}
                  {stop.date}
                </p>

                <h3 id={`stop-title-${stop.id}`}>{stop.title}</h3>

                <p className="journey-place">
                  {stop.place}
                  {stop.affiliation && <span>{stop.affiliation}</span>}
                </p>

                <p className="journey-description">{stop.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
