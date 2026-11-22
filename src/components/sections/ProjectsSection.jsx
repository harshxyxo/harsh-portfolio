import { useCallback, useEffect, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { HoverFlipText } from '../HoverFlipText'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function ProjectsSection({ projects }) {
  const smoothScroll = useSmoothScroll()
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [isDetailsClosing, setIsDetailsClosing] = useState(false)
  const detailPanelRef = useRef(null)
  const folderButtonRefs = useRef(new Map())
  const returnFocusRef = useRef(null)
  const revealRef = useReveal()

  const activeProject = projects.find((p) => p.id === activeProjectId) || null

  const handleToggleFolder = (projectId) => {
    returnFocusRef.current = folderButtonRefs.current.get(projectId)
    if (activeProjectId === projectId) {
      handleClosePanel()
      return
    }

    setIsDetailsClosing(false)
    setActiveProjectId(projectId)
  }

  const handleClosePanel = useCallback(() => {
    if (activeProjectId) setIsDetailsClosing(true)
  }, [activeProjectId])

  useEffect(() => {
    if (!isDetailsClosing || !detailPanelRef.current) return undefined

    const duration = Number.parseFloat(window.getComputedStyle(detailPanelRef.current).animationDuration) || 0
    const durationMs = window.getComputedStyle(detailPanelRef.current).animationDuration.endsWith('ms')
      ? duration
      : duration * 1000
    const timer = window.setTimeout(() => {
      setActiveProjectId(null)
      setIsDetailsClosing(false)
    }, durationMs)

    return () => window.clearTimeout(timer)
  }, [isDetailsClosing])

  // Focus the panel on open and restore focus to its initiating folder on close.
  useEffect(() => {
    if (activeProjectId && detailPanelRef.current) {
      detailPanelRef.current.focus({ preventScroll: true })
      if (smoothScroll) {
        smoothScroll.scrollTo(detailPanelRef.current, { duration: 0.85 })
      } else {
        detailPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (!activeProjectId && returnFocusRef.current) {
      returnFocusRef.current.focus()
      returnFocusRef.current = null
    }
  }, [activeProjectId, smoothScroll])

  // Support Escape key to close active project details
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && activeProjectId) {
        event.preventDefault()
        handleClosePanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeProjectId, handleClosePanel])

  return (
    <section id="projects" className="projects-section section-pad reveal-section" ref={revealRef} aria-labelledby="projects-heading-title">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Selected work</p>
            <h2 id="projects-heading-title">
              Featured<br />Projects
            </h2>
          </div>
          <a
            href="https://github.com/harshxyxo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover-flip-link"
          >
            <HoverFlipText text="GitHub" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </div>

        <p className="projects-intro">
          Selected software projects and engineering studies. Open a folder to explore project details.
        </p>

        {/* 3D Interactive Folder Grid */}
        <div className="project-folder-grid">
          {projects.map((project) => {
            const isExpanded = activeProjectId === project.id

            return (
              <button
                type="button"
                key={project.id}
                ref={(element) => {
                  if (element) {
                    folderButtonRefs.current.set(project.id, element)
                  } else {
                    folderButtonRefs.current.delete(project.id)
                  }
                }}
                className="project-folder"
                data-folder-id={project.id}
                aria-expanded={isExpanded}
                aria-controls="project-details-panel"
                onClick={() => handleToggleFolder(project.id)}
              >
                <span className="sr-only">{project.name}</span>

                {/* 3D Folder Perspective Scene */}
                <span className="folder-scene" aria-hidden="true">
                  <span className="folder-back" />

                  {/* Back Paper */}
                  <span className="folder-paper folder-paper-back">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                    <span>{project.type}</span>
                    <span className="folder-paper-lines" />
                  </span>

                  {/* Middle Preview Paper */}
                  <span className="folder-paper folder-paper-preview">
                    <span className="folder-case-preview">
                      <span className="folder-project-num">{project.number}</span>
                      <strong>{project.previewText}</strong>
                      <span className="folder-project-cat">{project.category}</span>
                    </span>
                    <span className="folder-project-title-sub">{project.name}</span>
                  </span>

                  {/* Front Paper */}
                  <span className="folder-paper folder-paper-front">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                    <span>{project.status}</span>
                    <span className="folder-paper-lines" />
                  </span>

                  {/* Front Cover */}
                  <span className="folder-front">
                    <span className="folder-front-title">{project.name}</span>
                    <span className="folder-open-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </span>
                  </span>
                </span>

                {/* Folder Bottom Caption */}
                <span className="folder-caption">
                  <span>{project.category} · {project.number}</span>
                  <span className="folder-caption-action">
                    <HoverFlipText text={isExpanded ? 'Close details' : 'Explore project'} />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Project Details Expandable Drawer */}
        <div
          id="project-details-panel"
          ref={detailPanelRef}
          className={`project-details-panel ${isDetailsClosing ? 'project-details-panel--closing' : ''}`}
          hidden={!activeProject}
          tabIndex={-1}
          role="region"
          aria-label="Project details panel"
        >
          {activeProject && (
            <>
              <div className="project-panel-toolbar">
                <span>Project details — {activeProject.name}</span>
                <button
                  type="button"
                  aria-label="Close project details"
                  className="icon-button project-panel-close"
                  onClick={handleClosePanel}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <article className="project-study">
                {/* Visual Graphic Representation */}
                <div className="project-image-link">
                  <figure className="project-image">
                    <div className="project-card-graphic">
                      <span className="graphic-number">{activeProject.number}</span>
                      <strong className="graphic-title">{activeProject.name}</strong>
                      <span className="graphic-tagline">{activeProject.tagline}</span>
                      {activeProject.isInProgress && (
                        <span className="project-badge-in-progress">IN PROGRESS</span>
                      )}
                    </div>
                  </figure>
                </div>

                {/* Editorial Content */}
                <div className="study-content">
                  <div className="study-header">
                    <div>
                      <h3>{activeProject.name}</h3>
                      <p className="project-category">{activeProject.category} · {activeProject.type}</p>
                    </div>

                    {/* Live Demo & GitHub Action Links */}
                    <div className="project-action-links">
                      {activeProject.live && (
                        <a
                          href={activeProject.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-btn project-btn--primary hover-flip-link"
                        >
                          <HoverFlipText text="Live Demo" />
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </a>
                      )}
                      {activeProject.github && (
                        <a
                          href={activeProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-btn project-btn--secondary hover-flip-link"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                          </svg>
                          <HoverFlipText text="Repository" />
                        </a>
                      )}
                      {activeProject.isInProgress && (
                        <span className="project-in-progress-note">
                          Active research &amp; development — repository and demo will be available upon prototype completion.
                        </span>
                      )}
                    </div>
                  </div>

                  <details open className="project-details">
                    <summary>
                      <span>Overview &amp; Implementation</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>

                    <p className="study-description">{activeProject.summary}</p>

                    <div className="stack-list">
                      {activeProject.stack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>

                    <p className="study-outcome">
                      <strong>Status:</strong> {activeProject.status}
                    </p>

                    <div className="detail-body">
                      <p>{activeProject.details}</p>
                    </div>
                  </details>
                </div>
              </article>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
