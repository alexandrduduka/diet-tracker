interface MacroRingProps {
  value: number;
  goal: number;
  label: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
}

export function MacroRing({
  value,
  goal,
  label,
  unit = 'kcal',
  size = 168,
  strokeWidth = 14,
  color = '#7cb87a',
  trackColor = '#2e2e22',
}: MacroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = goal > 0 ? Math.min(value / goal, 1) : 0;
  const dashOffset = circumference * (1 - pct);
  const isOver = goal > 0 && value > goal;
  const isNearGoal = goal > 0 && value >= goal * 0.9 && !isOver;
  const activeColor = isOver ? '#c17a5a' : color;
  const glowClass = isOver ? 'glow-amber' : isNearGoal ? 'glow-green' : '';

  return (
    <div className="flex flex-col items-center gap-2 animate-fade-in">
      <div
        className={`relative transition-all duration-500 ${glowClass}`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[#f0ede4] tabular-nums">{Math.round(value)}</span>
          <span className="text-xs text-[#9a9680] mt-0.5">{unit}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-[#9a9680]">{label}</p>
        <p className="text-xs text-[#5a5a44]">goal {goal} {unit}</p>
      </div>
    </div>
  );
}
