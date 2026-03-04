import { percentOfGoal } from '../lib/nutrition';

interface MacroBarProps {
  label: string;
  value: number;
  goal: number;
  unit?: string;
  color?: string;
}

export function MacroBar({ label, value, goal, unit = 'g', color = '#7cb87a' }: MacroBarProps) {
  const pct = percentOfGoal(value, goal);
  const isOver = goal > 0 && value > goal;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-[#c8c4b0] font-medium">{label}</span>
        <span className={isOver ? 'text-[#c17a5a]' : 'text-[#9a9680]'}>
          {Math.round(value)}<span className="text-[#5a5a44]">/{goal}{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#2e2e22] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: isOver ? '#c17a5a' : color,
          }}
        />
      </div>
    </div>
  );
}
