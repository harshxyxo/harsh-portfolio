import { useCallback, useEffect, useRef, useState } from 'react'
import { HoverFlipText } from '../HoverFlipText'

export function AskAiButton({ profile }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const closeButtonRef = useRef(null)

  const closePopover = useCallback((restoreFocus = false) => {
    setIsOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!isOpen) return undefined

    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closePopover(true)
      }
    }
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        closePopover()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [closePopover, isOpen])

  return (
    <aside ref={containerRef} className="ask-ai-container" aria-label="Quick inquiry assistant">
      {isOpen && (
        <div id="ask-ai-popover" className="ask-ai-popover" role="dialog" aria-modal="false" aria-labelledby="ask-ai-heading">
          <div className="ask-ai-header">
            <div className="ask-ai-title-wrap">
              <span className="ask-ai-badge">PORTFOLIO ASSISTANT</span>
              <h3 id="ask-ai-heading">Direct Inquiry</h3>
            </div>
            <button
              type="button"
              className="ask-ai-close"
              ref={closeButtonRef}
              onClick={() => closePopover(true)}
              aria-label="Close assistant"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="ask-ai-intro">
            Looking for something specific about Harsh&apos;s software experience, projects, or background? Choose a quick question:
          </p>

          <div className="ask-ai-suggestions">
            <a href="#projects" onClick={() => closePopover()} className="ask-ai-pill hover-flip-link">
              <HoverFlipText text="📁 What are his core projects?" />
            </a>
            <a href="#skills" onClick={() => closePopover()} className="ask-ai-pill hover-flip-link">
              <HoverFlipText text="⚡ What is his tech stack?" />
            </a>
            <a href="#experience" onClick={() => closePopover()} className="ask-ai-pill hover-flip-link">
              <HoverFlipText text="🎓 Where does he study?" />
            </a>
            <a href={`mailto:${profile.email}`} onClick={() => closePopover()} className="ask-ai-pill ask-ai-pill--highlight hover-flip-link">
              <HoverFlipText text="✉️ Send him an email directly" />
            </a>
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={`ask-ai-trigger ${isOpen ? 'is-active' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="ask-ai-popover"
        aria-label={`${isOpen ? 'Close' : 'Open'} quick inquiry assistant`}
      >
        <span className="ask-ai-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span className="ask-ai-label">Ask AI</span>
      </button>
    </aside>
  )
}
