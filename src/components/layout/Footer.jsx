import { HoverFlipText } from '../HoverFlipText'

const CURRENT_YEAR = new Date().getFullYear()

function CharacterArtwork() {
  return (
    <svg
      className="artwork-svg"
      viewBox="0 0 1200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
          {/* Subtle ground baseline */}
          <line x1="0" y1="110" x2="1200" y2="110" stroke="#333333" strokeWidth="2" strokeDasharray="4 8" />

          {/* Character silhouettes and mini doodle figures */}
          {/* Figure 1: Walking figure with backpack */}
          <g className="artwork-character artwork-char--1" transform="translate(60, 20)">
            <circle cx="20" cy="16" r="10" stroke="#555552" strokeWidth="2.5" fill="#1b1b1a" />
            <path d="M20 26v40m0 0l-12 36m12-36l14 36m-14-60l-16 20m16-20l18 18" stroke="#555552" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="8" y="32" width="10" height="20" rx="3" fill="#30302d" stroke="#555552" strokeWidth="1.5" />
          </g>

          {/* Figure 2: Person typing on a laptop */}
          <g className="artwork-character artwork-char--2" transform="translate(240, 32)">
            <circle cx="20" cy="14" r="9" stroke="#777770" strokeWidth="2.5" fill="#1b1b1a" />
            <path d="M20 23v34m0 0l-10 40m10-40l10 40m-10-24h18" stroke="#777770" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30 46l18-4v10H30z" fill="#3a3a37" stroke="#777770" strokeWidth="1.5" />
          </g>

          {/* Figure 3: Little dog running */}
          <g className="artwork-character artwork-char--3" transform="translate(420, 68)">
            <ellipse cx="28" cy="22" rx="16" ry="10" stroke="#666660" strokeWidth="2" fill="#242422" />
            <circle cx="46" cy="16" r="7" stroke="#666660" strokeWidth="2" fill="#242422" />
            <path d="M50 12l4-6m-4 12v18m-12-18v18m-14-16l-8 16m-4-16l-6 16m-4-26l-8-6" stroke="#666660" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Figure 4: Person waving */}
          <g className="artwork-character artwork-char--4" transform="translate(600, 16)">
            <circle cx="22" cy="15" r="10" stroke="#888882" strokeWidth="2.5" fill="#1b1b1a" />
            <path d="M22 25v42m0 0l-12 36m12-36l12 36m-12-60l20-18m-20 18l-16 22" stroke="#888882" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 7l4-5m-4 5l6 2" stroke="#888882" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Figure 5: Reader on a stool */}
          <g className="artwork-character artwork-char--5" transform="translate(800, 30)">
            <circle cx="20" cy="14" r="9" stroke="#666660" strokeWidth="2.5" fill="#1b1b1a" />
            <path d="M20 23v30l-14 30m14-30l16 30m-16-16h14m2 16h-34" stroke="#666660" strokeWidth="2" strokeLinecap="round" />
            <path d="M26 34l12-8v16l-12 4z" fill="#2c2c29" stroke="#666660" strokeWidth="1.5" />
          </g>

          {/* Figure 6: Developer with coffee */}
          <g className="artwork-character artwork-char--6" transform="translate(1000, 22)">
            <circle cx="20" cy="15" r="10" stroke="#777770" strokeWidth="2.5" fill="#1b1b1a" />
            <path d="M20 25v40m0 0l-14 38m14-38l14 38m-14-58l-16 18m16-18l18 12v-6" stroke="#777770" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="36" y="38" width="8" height="10" rx="2" fill="#353532" stroke="#777770" strokeWidth="1.5" />
          </g>
    </svg>
  )
}

function CharacterArtworkStrip() {
  return (
    <div className="footer-artwork-strip" aria-hidden="true">
      <div className="artwork-track">
        <CharacterArtwork />
        <CharacterArtwork />
      </div>
    </div>
  )
}

export function Footer({ profile }) {
  const currentYear = CURRENT_YEAR
  const name = profile?.name || 'Harsh Sharma'
  const firstName = profile?.shortName || name.split(' ')[0]
  const role = profile?.role || 'Software Developer'
  const specialization = profile?.specialization || 'Computer Science Engineering Student'
  const email = profile?.email || 'harshsharmarohta@gmail.com'

  return (
    <footer className="site-footer">
      <div className="footer-top wrap">
        <div className="footer-identity">
          <h2>{firstName}.</h2>
          <p>{role} &amp; {specialization}</p>
        </div>

        <nav aria-label="Footer navigation">
          <p>Explore</p>
          <div className="footer-nav-links">
            <a className="hover-flip-link" href="#about"><HoverFlipText text="About" /></a>
            <a className="hover-flip-link" href="#skills"><HoverFlipText text="Skills" /></a>
            <a className="hover-flip-link" href="#projects"><HoverFlipText text="Projects" /></a>
            <a className="hover-flip-link" href="#experience"><HoverFlipText text="Experience" /></a>
            <a className="hover-flip-link" href="#contact"><HoverFlipText text="Contact" /></a>
          </div>
        </nav>

        <div className="footer-contact">
          <p>Get in touch</p>
          <a href={`mailto:${email}`} className="footer-email-link hover-flip-link">
            <HoverFlipText text={email} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2.5 11.5L11.5 2.5M11.5 2.5H4.5M11.5 2.5V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <span>© {currentYear} {name}</span>
        </div>
      </div>

      <div className="footer-finale">
        <div className="footer-finale-heading wrap">
          <p>See you around.</p>
          <a href="#top" className="back-to-top hover-flip-link">
            <HoverFlipText text="Back to top" />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7 11.5V2.5M7 2.5L2.5 7M7 2.5L11.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Illustrated character strip artwork */}
      <CharacterArtworkStrip />
    </footer>
  )
}
