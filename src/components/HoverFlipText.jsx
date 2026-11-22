export function HoverFlipText({ text }) {
  return (
    <span className="hover-flip-text">
      <span className="sr-only">{text}</span>
      <span className="hover-flip-text__visual" aria-hidden="true">
        {Array.from(text).map((character, index) => (
          <span
            key={`${character}-${index}`}
            className="hover-flip-char"
            style={{
              '--hover-flip-delay': `${Math.min(index, 24) * 18}ms`,
              whiteSpace: character === ' ' ? 'pre' : undefined,
            }}
          >
            {character}
          </span>
        ))}
      </span>
    </span>
  )
}
