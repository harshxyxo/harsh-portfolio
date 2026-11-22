import { useReveal } from '../../hooks/useReveal'

export function SkillsSection({ skills }) {
  const revealRef = useReveal()

  return (
    <section id="skills" className="skills-section section-pad reveal-section" ref={revealRef} aria-labelledby="skills-heading-title">
      <div className="wrap">
        <div className="skills-heading">
          <h2 id="skills-heading-title">Tech Stack</h2>
          <p>
            The tools behind<br /> my work.
          </p>
        </div>

        <div className="skills-specimens">
          {skills.map((specimen) => (
            <article
              key={specimen.id}
              className="skills-specimen"
              aria-labelledby={`specimen-${specimen.id}`}
            >
              <h3 id={`specimen-${specimen.id}`}>{specimen.category}</h3>
              <p className="skills-specimen-note">{specimen.note}</p>
              <ul className="skills-type-mosaic">
                {specimen.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
