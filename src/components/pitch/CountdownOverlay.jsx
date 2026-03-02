export default function CountdownOverlay({ count }) {
  if (count === null || count <= 0) return null

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="text-center">
        <span
          key={count}
          className="block text-9xl font-bold text-accent animate-pulse"
          style={{ textShadow: '0 0 40px rgba(6, 182, 212, 0.5)' }}
        >
          {count}
        </span>
        <p className="mt-4 text-xl text-text-secondary">Get ready...</p>
      </div>
    </div>
  )
}
