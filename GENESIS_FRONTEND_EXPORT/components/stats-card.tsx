/**
 * 📊 STATS CARD - Composant réutilisable
 */

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: string;
  className?: string;
}

export default function StatsCard({ icon, label, value, trend, className = "" }: StatsCardProps) {
  return (
    <div className={`glass p-6 rounded-2xl ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        {trend && (
          <span className="text-xs px-2 py-1 bg-emerald-900/50 text-emerald-400 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold neon-text">{value}</p>
    </div>
  );
}





