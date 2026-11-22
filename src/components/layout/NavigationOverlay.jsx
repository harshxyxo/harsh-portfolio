import { useCallback, useEffect, useRef, useState } from 'react'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ScatterWord({ text, isClosing, closeDelayOffset = 0 }) {
  const wordSeed = text.split('').reduce((seed, char, index) => (
    seed + char.charCodeAt(0) * (index + 1)
  ), 0)
  const textSeed = text.split('').reduce((seed, char) => (
    Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0
  ), 2166136261)

  return (
    <span className="scatter-word" aria-label={text}>
      {text.split('').map((char, index) => {
        const variation = (wordSeed + index * 37) % 101
        const characterSeed = (textSeed ^ Math.imul(index + 1, 0x45d9f3b)) >>> 0
        const entryDirection = variation % 2 === 0 ? 1 : -1
        const entryRotate = (entryDirection * (12 + variation % 25)).toFixed(1)
        const driftDirection = characterSeed % 2 === 0 ? 1 : -1
        const randomX = driftDirection > 0
          ? 70 + (characterSeed % 13) * 24
          : -(18 + (characterSeed % 5) * 7)
        const randomY = 110 + ((characterSeed >>> 8) % 111)
        const exitDirection = (characterSeed >>> 4) % 2 === 0 ? 1 : -1
        const exitRotate = exitDirection * (12 + ((characterSeed >>> 16) % 29))
        const stagger = index / Math.max(text.length - 1, 1)
        const closeDelay = (
          closeDelayOffset + stagger * 0.18 + ((characterSeed >>> 24) % 5) * 0.01
        ).toFixed(3)
        const openDelay = (stagger * 0.16 + (variation % 3) * 0.008).toFixed(3)
        const closeDuration = (0.82 + (variation % 4) * 0.045).toFixed(3)

        return (
          <span
            key={`${char}-${index}`}
            className={`scatter-char ${isClosing ? 'is-scattering' : 'is-entering'}`}
            style={{
              '--scatter-rotate': `${entryRotate}deg`,
              '--scatter-end-rotate': `${exitRotate}deg`,
              '--scatter-x': `${randomX}px`,
              '--scatter-y': `${randomY}px`,
              '--scatter-mid-rotate': `${(exitRotate * 0.28).toFixed(1)}deg`,
              '--scatter-mid-x': `${(randomX * 0.34).toFixed(1)}px`,
              '--scatter-mid-y': `${Math.round(randomY * 0.3)}px`,
              animationDelay: `${isClosing ? closeDelay : openDelay}s`,
              ...(isClosing && { animationDuration: `${closeDuration}s` }),
            }}
            aria-hidden="true"
          >
            <span
              className="scatter-char__glyph"
              style={{ '--hover-flip-delay': `${Math.min(index, 24) * 18}ms` }}
            >
              {char}
            </span>
          </span>
        )
      })}
    </span>
  )
}

function getAnimationEndTime(element) {
  const styles = window.getComputedStyle(element)
  const duration = Number.parseFloat(styles.animationDuration) || 0
  const delay = Number.parseFloat(styles.animationDelay) || 0
  const durationMs = styles.animationDuration.endsWith('ms') ? duration : duration * 1000
  const delayMs = styles.animationDelay.endsWith('ms') ? delay : delay * 1000

  return durationMs + delayMs
}

export function NavigationOverlay({ email, isOpen, onClose }) {
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const [isClosing, setIsClosing] = useState(false)

  // Keep the newest onClose callback without restarting the dismiss timer
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // Derive rendering during render instead of syncing state inside an effect
  const shouldRender = isOpen || isClosing

  const handleInitiateClose = useCallback(() => {
    setIsClosing(true)
  }, [])

  // Wait for the longest active exit animation before unmounting the dialog.
  useEffect(() => {
    if (!isClosing) return undefined

    const backdrop = dialogRef.current?.parentElement
    const animatedElements = [
      backdrop,
      dialogRef.current,
      ...Array.from(dialogRef.current?.querySelectorAll('.scatter-char') || []),
    ].filter(Boolean)
    const closeAnimationMs = Math.max(...animatedElements.map(getAnimationEndTime))

    const timer = window.setTimeout(() => {
      setIsClosing(false)
      onCloseRef.current()
    }, closeAnimationMs)

    return () => window.clearTimeout(timer)
  }, [isClosing])

  // Focus management, Escape handling, focus trap and background scroll lock
  useEffect(() => {
    if (!shouldRender) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleInitiateClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [shouldRender, handleInitiateClose])

  if (!shouldRender) return null

  const handleLinkClick = () => {
    handleInitiateClose()
  }

  return (
    <div
      className={`nav-backdrop ${isClosing ? 'nav-backdrop--closing' : 'nav-backdrop--opening'}`}
      role="presentation"
      onMouseDown={handleInitiateClose}
    >
      <section
        ref={dialogRef}
        id="site-nav-dialog"
        className={`nav-dialog ${isClosing ? 'nav-dialog--closing' : 'nav-dialog--opening'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="nav-panel">
          <div className="nav-panel__top">
            <button
              className="nav-panel-close hover-flip-link"
              ref={closeButtonRef}
              type="button"
              onClick={handleInitiateClose}
              aria-label="Close navigation menu"
            >
              <ScatterWord text="close" isClosing={isClosing} />
              <span className="nav-close-circle">
                <CloseIcon />
              </span>
            </button>
          </div>

          <nav className="nav-panel__links" aria-label="Site navigation">
            <div className="nav-menu-primary">
              <a className="hover-flip-link" href="#projects" onClick={handleLinkClick}>
                <ScatterWord text="Projects" isClosing={isClosing} closeDelayOffset={0} />
              </a>
              <a className="hover-flip-link" href="#about" onClick={handleLinkClick}>
                <ScatterWord text="About" isClosing={isClosing} closeDelayOffset={0.09} />
              </a>
              <a className="hover-flip-link" href="#contact" onClick={handleLinkClick}>
                <ScatterWord text="Contact" isClosing={isClosing} closeDelayOffset={0.18} />
              </a>
            </div>

            <div className="nav-menu-secondary">
              <a className="hover-flip-link" href="#skills" onClick={handleLinkClick}>
                <ScatterWord text="Skills" isClosing={isClosing} closeDelayOffset={0.27} />
              </a>
              <a className="hover-flip-link" href="#experience" onClick={handleLinkClick}>
                <ScatterWord text="Experience" isClosing={isClosing} closeDelayOffset={0.36} />
              </a>
            </div>
          </nav>

          <div className="nav-panel__footer">
            <a className="nav-panel-email hover-flip-link" href={`mailto:${email}`}>
              <ScatterWord text={email} isClosing={isClosing} closeDelayOffset={0.45} />
            </a>
            <div className="nav-panel-socials" aria-label="Social links">
              <a href="https://github.com/harshxyxo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/harsh-sharma-3428a430b"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
