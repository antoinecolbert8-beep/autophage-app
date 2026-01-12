/**
 * 📊 PROGRESS BAR - Barre de progression réutilisable
 */

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: "emerald" | "indigo" | "yellow" | "red";
  showPercentage?: boolean;
}

export default function ProgressBar({
  label,
  value,
  max = 100,
  color = "emerald",
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    emerald: "bg-emerald-500",
    indigo: "bg-indigo-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">{label}</span>
        {showPercentage && (
          <span className="text-sm font-bold">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}





