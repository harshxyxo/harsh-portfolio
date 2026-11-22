import { useSyncExternalStore } from 'react'
import Lenis from 'lenis'

let smoothScroll = null
const subscribers = new Set()

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber())
}

function subscribe(subscriber) {
  subscribers.add(subscriber)
  return () => subscribers.delete(subscriber)
}

function getSnapshot() {
  return smoothScroll
}

export function useSmoothScroll() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}

export function startSmoothScroll() {
  const instance = new Lenis({
    anchors: true,
    autoRaf: true,
    respectReducedMotion: true,
    stopInertiaOnNavigate: true,
  })
  smoothScroll = instance
  notifySubscribers()

  const handleScrollKey = (event) => {
    if (
      event.defaultPrevented
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return

    const target = event.target instanceof Element ? event.target : null
    if (target?.closest('a, button, input, textarea, select, summary, [contenteditable="true"], [role="textbox"], [role="dialog"]')) {
      return
    }

    const pageStep = window.innerHeight * 0.85
    let destination
    switch (event.key) {
      case 'ArrowDown':
        destination = instance.scroll + 80
        break
      case 'ArrowUp':
        destination = instance.scroll - 80
        break
      case 'PageDown':
        destination = instance.scroll + pageStep
        break
      case 'PageUp':
        destination = instance.scroll - pageStep
        break
      case 'Home':
        destination = 0
        break
      case 'End':
        destination = instance.limit
        break
      case ' ':
        destination = instance.scroll + (event.shiftKey ? -pageStep : pageStep)
        break
      default:
        return
    }

    event.preventDefault()
    instance.scrollTo(destination)
  }

  window.addEventListener('keydown', handleScrollKey)
  return () => {
    window.removeEventListener('keydown', handleScrollKey)
    instance.destroy()
    if (smoothScroll === instance) {
      smoothScroll = null
      notifySubscribers()
    }
  }
}
