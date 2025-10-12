export function SlimmersLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
        <div className="text-white text-2xl font-bold">
          <svg viewBox="0 0 100 100" className="w-12 h-12 fill-current">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d="M35 35 Q50 20 65 35 Q50 50 35 65 Q20 50 35 35" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-1">SLIMMERS</h1>
        <h2 className="text-3xl font-bold text-primary">WORLD</h2>
        <p className="text-sm text-muted-foreground mt-2">MARIKINA</p>
      </div>
    </div>
  )
}
