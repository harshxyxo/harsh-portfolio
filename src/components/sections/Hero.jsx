import { useEffect, useRef, useState } from 'react'
import { HoverFlipText } from '../HoverFlipText'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function Hero({ profile }) {
  const smoothScroll = useSmoothScroll()
  const shortName = profile.shortName || profile.name.split(' ')[0]
  const heroRef = useRef(null)
  const spotlightRef = useRef(null)
  const portraitRef = useRef(null)
  const biographyRef = useRef(null)
  const [portraitLoaded, setPortraitLoaded] = useState(false)

  const handlePointerMove = (event) => {
    const spotlight = spotlightRef.current
    const hero = heroRef.current
    if (!spotlight || !hero || event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const heroBounds = hero.getBoundingClientRect()
    if (event.clientY < heroBounds.top || event.clientY > heroBounds.bottom) {
      spotlight.classList.remove('is-active')
      return
    }

    const rect = spotlight.getBoundingClientRect()
    spotlight.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
    spotlight.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
    spotlight.classList.add('is-active')
  }

  const handlePointerLeave = () => {
    spotlightRef.current?.classList.remove('is-active')
  }

  // Keep the one portrait linked to scroll progress without re-rendering the hero.
  useEffect(() => {
    const hero = heroRef.current
    const portrait = portraitRef.current
    const biography = biographyRef.current
    if (!hero || !portrait || !biography) return undefined

    const heroTitle = hero.querySelector('.hero-title')
    const heroLetters = Array.from(heroTitle?.querySelectorAll('.hero-letter') || [])
    const codeMarks = Array.from(heroTitle?.querySelectorAll('.hero-code-mark') || [])
    const root = document.documentElement

    const portraitFrames = [
      { progress: 0, rotation: 0, scale: 1, topPosition: null },
      { progress: 0.22, rotation: 0, scale: 1, topPosition: 0.45 },
      { progress: 0.44, rotation: 60, scale: 1.02, topPosition: 0.38 },
      { progress: 0.54, rotation: 90, scale: 1.08, topPosition: 0.37 },
      { progress: 0.78, rotation: 40, scale: 1.15, topPosition: 0.45 },
      { progress: 1, rotation: 0, scale: null, topPosition: null },
    ]
    const sampleFrame = (progress, property, initialValue = 0, finalValue = initialValue) => {
      const getValue = (frame, index) => {
        if (frame[property] !== null && frame[property] !== undefined) return frame[property]
        return index === portraitFrames.length - 1 ? finalValue : initialValue
      }
      const nextIndex = portraitFrames.findIndex((frame) => frame.progress >= progress)
      if (nextIndex <= 0) {
        const index = Math.max(nextIndex, 0)
        return getValue(portraitFrames[index], index)
      }

      const previous = portraitFrames[nextIndex - 1]
      const next = portraitFrames[nextIndex]
      const position = (progress - previous.progress) / (next.progress - previous.progress)
      return getValue(previous, nextIndex - 1)
        + (getValue(next, nextIndex) - getValue(previous, nextIndex - 1)) * position
    }

    let ticking = false
    let frame = 0
    const updatePortrait = () => {
      const isMobile = window.matchMedia('(max-width: 700px)').matches
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const scrollY = smoothScroll?.scroll ?? window.scrollY
      const heroTop = hero.getBoundingClientRect().top + scrollY
      const progress = Math.min(Math.max((scrollY - heroTop) / hero.offsetHeight, 0), 1)
      const motionProgress = prefersReducedMotion ? 0 : progress * progress * (3 - 2 * progress)
      const letterMotionStart = portraitFrames[1].progress - 0.04
      const letterScrollProgress = prefersReducedMotion
        ? 0
        : Math.min(Math.max((progress - letterMotionStart) / (1 - letterMotionStart), 0), 1)
      const scrollWave = Math.sin(motionProgress * Math.PI)
      const titleShift = -Math.min(window.innerHeight * 0.1, 120) * motionProgress
      heroTitle?.style.setProperty('--hero-scroll-y', `${titleShift.toFixed(2)}px`)
      heroTitle?.style.setProperty('--hero-scroll-scale', (1 - 0.08 * motionProgress).toFixed(3))
      heroTitle?.style.setProperty('--hero-scroll-opacity', (1 - 0.28 * motionProgress).toFixed(3))
      heroTitle?.style.setProperty('--hero-scroll-rotate-x', `${(-8 * motionProgress).toFixed(2)}deg`)
      heroLetters.forEach((letter, index) => {
        const stagger = 0.015 + index * 0.007
        const letterProgress = Math.min(Math.max((letterScrollProgress - stagger) / 0.58, 0), 1)
        const wave = Math.sin(letterProgress * Math.PI)
        const lane = index % 4
        const verticalDirection = lane % 2 === 0 ? -1 : 1
        const verticalShift = verticalDirection * ((112 + lane * 18) * letterProgress + 12 * wave)
        const horizontalShift = (((index * 3) % 7) - 3) * 3.2 * letterProgress
        const skew = ((index % 5) - 2) * 1.8 * letterProgress
        const rotation = (index % 2 === 0 ? -1 : 1) * (4 + (index % 3) * 3) * letterProgress
        const rotationX = (index % 2 === 0 ? 1 : -1) * (5 + (index % 3) * 7) * letterProgress

        letter.style.setProperty('--letter-scroll-x', `${horizontalShift.toFixed(2)}px`)
        letter.style.setProperty('--letter-scroll-y', `${verticalShift.toFixed(2)}px`)
        letter.style.setProperty('--letter-scroll-skew', `${skew.toFixed(2)}deg`)
        letter.style.setProperty('--letter-scroll-rotate', `${rotation.toFixed(2)}deg`)
        letter.style.setProperty('--letter-scroll-rotate-x', `${rotationX.toFixed(2)}deg`)
        letter.style.setProperty('--letter-scroll-opacity', (1 - letterProgress).toFixed(3))
      })
      codeMarks.forEach((mark, index) => {
        const markProgress = Math.min(Math.max((motionProgress - 0.08 - index * 0.04) / 0.66, 0), 1)
        const markDirection = index === 0 ? -1 : 1
        mark.style.setProperty('--hero-mark-shift-y', `${(-26 * markProgress).toFixed(2)}px`)
        mark.style.setProperty('--hero-mark-skew', `${(markDirection * 3.2 * markProgress).toFixed(2)}deg`)
        mark.style.setProperty('--hero-mark-opacity', (1 - 0.9 * markProgress).toFixed(3))
      })
      root.style.setProperty('--wordmark-rotate-x', `${(34 * scrollWave).toFixed(2)}deg`)
      root.style.setProperty('--wordmark-rotate-y', `${(-16 * scrollWave).toFixed(2)}deg`)
      root.style.setProperty('--wordmark-rotate-z', `${(-7 * scrollWave).toFixed(2)}deg`)
      root.style.setProperty('--wordmark-translate-y', `${(-3 * scrollWave).toFixed(2)}px`)

      if (prefersReducedMotion) {
        portrait.style.removeProperty('--portrait-sticky-top')
        portrait.style.removeProperty('--portrait-shift-y')
        portrait.style.setProperty('--portrait-rotate-y', '0deg')
        portrait.style.setProperty('--portrait-rotate-x', '0deg')
        portrait.style.setProperty('--portrait-scale', '1')
        portrait.style.boxShadow = '0 18px 38px -16px rgba(0, 0, 0, .2)'
        return
      }

      const finalPortraitScale = isMobile ? 1.14 : window.innerWidth <= 1100 ? 1.22 : 1.42
      const imageBottom = Number.parseFloat(
        window.getComputedStyle(hero.parentElement).getPropertyValue('--hero-image-bottom')
      ) || 0
      const initialTop = heroTop + hero.offsetHeight - portrait.offsetHeight - imageBottom
      const mobileClearanceShift = () => {
        const contentTop = biography.getBoundingClientRect().top
          + Number.parseFloat(window.getComputedStyle(biography).paddingTop)
        const stickyTop = Number.parseFloat(window.getComputedStyle(portrait).top)
        const portraitHeight = portrait.offsetHeight * scale + 8
        return Math.min(0, contentTop - stickyTop - portraitHeight - 24)
      }
      const turn = Math.sin(motionProgress * Math.PI)
      const rotation = sampleFrame(motionProgress, 'rotation')
      const scale = sampleFrame(motionProgress, 'scale', 1, finalPortraitScale)
      let shiftY = isMobile ? -8 * turn + 8 * motionProgress : 0
      let targetTop = 0

      if (isMobile) {
        portrait.style.removeProperty('--portrait-sticky-top')
        shiftY = Math.min(shiftY, mobileClearanceShift())
      } else {
        const initialTopPosition = initialTop / window.innerHeight
        const intro = biography.querySelector('.bio-introduction')
        const description = biography.querySelector('.bio-description')
        const introBounds = intro?.getBoundingClientRect()
        const descriptionBounds = description?.getBoundingClientRect()
        const rowTop = Math.min(introBounds?.top ?? 0, descriptionBounds?.top ?? 0)
        const rowBottom = Math.max(introBounds?.bottom ?? 0, descriptionBounds?.bottom ?? 0)
        const biographyCenterTop = (rowTop + rowBottom) / 2 - (portrait.offsetHeight * scale) / 2
        const finalTopPosition = biographyCenterTop / window.innerHeight
        targetTop = sampleFrame(
          motionProgress,
          'topPosition',
          initialTopPosition,
          finalTopPosition
        ) * window.innerHeight
        portrait.style.setProperty('--portrait-sticky-top', `${targetTop}px`)
      }

      portrait.style.setProperty('--portrait-shift-y', `${shiftY}px`)
      portrait.style.setProperty('--portrait-rotate-y', `${rotation}deg`)
      portrait.style.setProperty('--portrait-rotate-x', `${-3 * turn}deg`)
      portrait.style.setProperty('--portrait-scale', String(scale))
      portrait.style.boxShadow = `0 ${18 + motionProgress * 14}px ${38 + motionProgress * 16}px -16px rgba(0, 0, 0, ${0.2 + motionProgress * 0.12})`

      if (!isMobile) {
        const visualTop = portrait.getBoundingClientRect().top
        portrait.style.setProperty('--portrait-shift-y', `${targetTop - visualTop}px`)
      }
    }

    const handleNativeScroll = () => {
      if (ticking) return
      ticking = true
      frame = window.requestAnimationFrame(() => {
        updatePortrait()
        ticking = false
        frame = 0
      })
    }

    const unsubscribeLenisScroll = smoothScroll?.on('scroll', updatePortrait)
    if (!smoothScroll) window.addEventListener('scroll', handleNativeScroll, { passive: true })
    window.addEventListener('resize', handleNativeScroll, { passive: true })
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionPreference.addEventListener('change', handleNativeScroll)

    updatePortrait()
    return () => {
      unsubscribeLenisScroll?.()
      if (!smoothScroll) window.removeEventListener('scroll', handleNativeScroll)
      window.removeEventListener('resize', handleNativeScroll)
      motionPreference.removeEventListener('change', handleNativeScroll)
      if (frame) window.cancelAnimationFrame(frame)
      heroTitle?.style.removeProperty('--hero-scroll-y')
      heroTitle?.style.removeProperty('--hero-scroll-scale')
      heroTitle?.style.removeProperty('--hero-scroll-opacity')
      heroTitle?.style.removeProperty('--hero-scroll-rotate-x')
      heroLetters.forEach((letter) => {
        letter.style.removeProperty('--letter-scroll-x')
        letter.style.removeProperty('--letter-scroll-y')
        letter.style.removeProperty('--letter-scroll-skew')
        letter.style.removeProperty('--letter-scroll-rotate')
        letter.style.removeProperty('--letter-scroll-rotate-x')
        letter.style.removeProperty('--letter-scroll-opacity')
      })
      codeMarks.forEach((mark) => {
        mark.style.removeProperty('--hero-mark-shift-y')
        mark.style.removeProperty('--hero-mark-skew')
        mark.style.removeProperty('--hero-mark-opacity')
      })
      root.style.removeProperty('--wordmark-rotate-x')
      root.style.removeProperty('--wordmark-rotate-y')
      root.style.removeProperty('--wordmark-rotate-z')
      root.style.removeProperty('--wordmark-translate-y')
    }
  }, [smoothScroll])

  const backgroundCode = `const harsh = {
  name: "${profile.name}",
  role: "${profile.role}",
  specialization: "${profile.specialization}",
  email: "${profile.email}",
  projects: [
${profile.projects.map((project) => `    "${project.name}"`).join(',\n')}
  ],
  education: {
    institution: "MIET / AKTU",
    degree: "B.Tech Computer Science & Engineering",
    gradYear: 2027
  },
  skills: [
    "Java", "JavaScript", "TypeScript", "Python",
    "FastAPI", "React", "Tailwind CSS", "MongoDB"
  ],
  status: "available for software engineering roles"
};

export default function Portfolio() {
  return <main>
    <header><h1>{harsh.name}</h1><p>{harsh.role}</p></header>
  </main>;
}`
  const spotlightCode = `// [SYSTEM INITIALIZATION — HARSH SHARMA REPO]
import { createDeveloperProfile } from '@harsh/core';

export const engineer = createDeveloperProfile({
  handle: "harshxyxo",
  focus: "Full-Stack Software Architecture & Applied AI",
  stack: ["Java", "TypeScript", "React", "Python", "FastAPI", "MongoDB"],
  mission: "Crafting performant digital experiences with architectural clarity."
});

// Cursor trace active...
console.log("Welcome to Harsh Sharma's portfolio interface.");`

  return (
    <section
      className="about-section"
      id="about"
      aria-labelledby="hero-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="hero wrap" ref={heroRef}>
        {/* Background source code glyph preview */}
        <div className="glyph-background hero-code-background" aria-hidden="true">
          <div className="glyph-code-tiles glyph-code-tiles--ambient">
            {Array.from({ length: 12 }, (_, index) => (
              <pre className="glyph-code-fallback" key={index}>{backgroundCode}</pre>
            ))}
          </div>

          {/* Cursor-following reveal spotlight layer */}
          <div ref={spotlightRef} className="cursor-code-spotlight">
            <div className="glyph-code-tiles glyph-code-tiles--spotlight">
              {Array.from({ length: 12 }, (_, index) => (
                <pre className="glyph-code-spotlight-text" key={index}>{spotlightCode}</pre>
              ))}
            </div>
          </div>
        </div>

        {/* Hero heading composition with SVG code marks */}
        <div className="hero-heading-composition">
          <h1 className="hero-title hero-display-title" id="hero-title" aria-label="Software Engineer">
            <span className="title-line" aria-hidden="true">
              <span className="hero-word">
                <span className="hero-code-open hero-code-mark" aria-hidden="true">
                  <svg viewBox="20 0 110 160" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="square" strokeLinejoin="miter" focusable="false">
                    <path className="hero-code-depth" opacity=".16" d="M105 30 48 80 105 130" transform="translate(5 6)" />
                    <path d="M105 30 48 80 105 130" />
                  </svg>
                </span>
                <span className="hero-letter-window"><span className="hero-letter">S</span></span>
                <span className="hero-letter-window"><span className="hero-letter">O</span></span>
                <span className="hero-letter-window"><span className="hero-letter">F</span></span>
                <span className="hero-letter-window"><span className="hero-letter">T</span></span>
                <span className="hero-letter-window"><span className="hero-letter">W</span></span>
                <span className="hero-letter-window"><span className="hero-letter">A</span></span>
                <span className="hero-letter-window"><span className="hero-letter">R</span></span>
                <span className="hero-letter-window"><span className="hero-letter">E</span></span>
              </span>
            </span>
            <span className="title-line" aria-hidden="true">
              <span className="hero-word">
                <span className="hero-code-close hero-code-mark" aria-hidden="true">
                  <svg viewBox="0 0 180 160" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="square" strokeLinejoin="miter" focusable="false">
                    <path className="hero-code-depth" opacity=".16" d="M65 30 25 130M100 30 157 80 100 130" transform="translate(5 6)" />
                    <path d="M65 30 25 130M100 30 157 80 100 130" />
                  </svg>
                </span>
                <span className="hero-letter-window"><span className="hero-letter">E</span></span>
                <span className="hero-letter-window"><span className="hero-letter">N</span></span>
                <span className="hero-letter-window"><span className="hero-letter">G</span></span>
                <span className="hero-letter-window"><span className="hero-letter">I</span></span>
                <span className="hero-letter-window"><span className="hero-letter">N</span></span>
                <span className="hero-letter-window"><span className="hero-letter">E</span></span>
                <span className="hero-letter-window"><span className="hero-letter">E</span></span>
                <span className="hero-letter-window"><span className="hero-letter">R</span></span>
              </span>
            </span>
          </h1>
        </div>

        {/* Hero footer metadata */}
        <div className="hero-footer">
          <span className="hero-year">{profile.year || '©2026'}</span>
          <span className="hero-focus">
            <span className="terminal-text">
              <span aria-hidden="true">&#123;&#123;&nbsp;</span>
              <span>{profile.focus || '/ COMPUTER SCIENCE ENGINEERING'}</span>
              <span className="terminal-caret" aria-hidden="true" />
              <span aria-hidden="true">&nbsp;&#125;&#125;</span>
            </span>
          </span>
        </div>
      </div>

      <a
        ref={portraitRef}
        href="#biography"
        className="hero-portrait-link"
        aria-label={`About ${profile.name}`}
      >
        <div className={`portrait-visual-stage${portraitLoaded ? ' has-portrait' : ''}`}>
          <img
            className="portrait-photo"
            src="/images/harsh-portrait.jpg"
            alt={portraitLoaded ? `Portrait of ${profile.name}` : ''}
            onLoad={() => setPortraitLoaded(true)}
            onError={() => setPortraitLoaded(false)}
            draggable="false"
          />
          {!portraitLoaded && (
            <span
              className="portrait-fallback"
              role="img"
              aria-label={`Temporary neutral portrait fallback for ${profile.name}. Add a photo at /images/harsh-portrait.jpg.`}
            >
              <span>Portrait photo not added yet</span>
              <code>/images/harsh-portrait.jpg</code>
            </span>
          )}
        </div>
      </a>

      {/* Editorial biography */}
      <div ref={biographyRef} id="biography" className="biography wrap measure-content">
        <div className="bio-introduction">
          <p className="section-eyebrow">About {profile.name}</p>
          <h2>Hi, I&apos;m<br /> {shortName}.</h2>
          <p className="bio-role">
            {profile.role} <span>&amp; {profile.specialization}.</span>
          </p>
          {profile.education && (
            <div className="bio-current">
              <span>{profile.education.status}</span>
              <p>
                <strong>{profile.education.degree}</strong><br />
                <span>{profile.education.field}</span>
              </p>
            </div>
          )}
        </div>

        <div className="bio-description">
          <p className="bio-lead">
            {profile.bioLead || "A focused space for my software projects, learning, and the work I'm preparing to share."}
          </p>
          <div className="bio-actions">
            <a className="bio-projects hover-flip-link" href="#projects">
              <HoverFlipText text="Explore projects" />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
