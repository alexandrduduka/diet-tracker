import { percentOfGoal } from '../lib/nutrition';

interface MacroBarProps {
  label: string;
  value: number;
  goal: number;
  unit?: string;
  color?: string;
  animationDelay?: number;
}

export function MacroBar({ label, value, goal, unit = 'g', color = '#7cb87a', animationDelay = 0 }: MacroBarProps) {
  const pct = percentOfGoal(value, goal);
  const isOver = goal > 0 && value > goal;
  const isNearGoal = goal > 0 && value >= goal * 0.8 && !isOver;

  return (
    <div
      className="space-y-1.5 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex justify-between items-center text-sm">
        <span className="text-[#c8c4b0] font-medium">{label}</span>
        <span className={isOver ? 'text-[#c17a5a]' : 'text-[#9a9680]'}>
          {Math.round(value)}<span className="text-[#5a5a44]">/{goal}{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#2e2e22] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isNearGoal ? 'shadow-[0_0_6px_0_var(--glow-color)]' : ''}`}
          style={{
            width: `${pct}%`,
            backgroundColor: isOver ? '#c17a5a' : color,
            '--glow-color': color + '80',
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
