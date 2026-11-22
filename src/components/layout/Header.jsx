import { useEffect, useRef, useState } from 'react'
import { NavigationOverlay } from './NavigationOverlay'
import { HoverFlipText } from '../HoverFlipText'

const THEME_STORAGE_KEY = 'portfolio-theme'

// Prefer the saved choice, then the operating-system preference
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // localStorage can be unavailable in privacy-restricted contexts
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19.2 15.3A7.8 7.8 0 0 1 8.7 4.8 7.8 7.8 0 1 0 19.2 15.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="1.65" fill="currentColor" />
      <circle cx="12" cy="12" r="1.65" fill="currentColor" />
      <circle cx="18" cy="12" r="1.65" fill="currentColor" />
    </svg>
  )
}

export function Header({ profile }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const menuTriggerRef = useRef(null)
  const themeTransitionTimerRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Persisting the preference is best-effort only
    }
  }, [theme])

  useEffect(() => () => window.clearTimeout(themeTransitionTimerRef.current), [])

  const toggleTheme = () => {
    window.clearTimeout(themeTransitionTimerRef.current)
    document.documentElement.classList.add('theme-in-transition')
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
    themeTransitionTimerRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-in-transition')
    }, 600)
  }

  // Return keyboard focus to the trigger once the overlay has closed
  const handleCloseMenu = () => {
    setIsMenuOpen(false)
    menuTriggerRef.current?.focus()
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <a
            className="site-logo hover-flip-link"
            href="#about"
            aria-label={`${profile.name} home`}
          >
            <HoverFlipText text="Harsh." />
          </a>
          <div className="site-header__actions">
            <button
              className="theme-toggle"
              type="button"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              onClick={toggleTheme}
            >
              <span className={`theme-toggle-icon ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </span>
            </button>
            <button
              ref={menuTriggerRef}
              className="nav-menu-trigger"
              type="button"
              aria-label="Navigation menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="dialog"
              aria-controls="site-nav-dialog"
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      <NavigationOverlay email={profile.email} isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </>
  )
}
