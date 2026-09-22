interface LevelProps {
  n?: number;
  color?: string;
  size?: number;
}

/** Five-diamond level indicator shown on a person's card. */
export function Level({ n = 3, color = '#C9A227', size = 6 }: LevelProps) {
  return (
    <span className="inline-flex items-center gap-[3px]" title={`Level ${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          style={{
            width: size,
            height: size,
            transform: 'rotate(45deg)',
            display: 'block',
            background: i <= n ? color : 'transparent',
            border: `1px solid ${color}`,
            opacity: i <= n ? 1 : 0.4,
          }}
        />
      ))}
    </span>
  );
}
