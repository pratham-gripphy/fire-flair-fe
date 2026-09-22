const WM_LIGHT = 'linear-gradient(100deg,#FBF0CA,#E6CE84 26%,#B08D2A 52%,#EBD695 74%,#FCF2D2)';
const WM_DARK = 'linear-gradient(100deg,#9A7A24,#6F5514 30%,#B08D2A 52%,#7E611D 76%,#A5832B)';

interface WordmarkProps {
  size?: number;
  tone?: string;
}

/** "FIREFLAIR" set in metallic gold, on either a dark or light background. */
export function Wordmark({ size = 15, tone = '#EAD79C' }: WordmarkProps) {
  const onLight = tone !== '#EAD79C';
  return (
    <span
      className="ff-metal"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: size,
        letterSpacing: '.22em',
        whiteSpace: 'nowrap',
        backgroundImage: onLight ? WM_DARK : WM_LIGHT,
        display: 'inline-block',
      }}
    >
      FIREFLAIR
    </span>
  );
}
