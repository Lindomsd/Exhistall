interface SpinnerProps {
  label?: string;
  className?: string;
}

/** Brand-coloured spinner used for route and data loading states. */
export default function Spinner({ label = 'Loading…', className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <span className="market-display-font relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-brand-blue/15 border-t-brand-gold" />
        <span className="h-3 w-3 rounded-full bg-brand-gold" />
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
