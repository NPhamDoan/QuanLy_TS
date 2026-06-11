interface StatCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  colorClass: string;
  onClick?: () => void;
}

export default function StatCard({ icon, count, label, colorClass, onClick }: StatCardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`${colorClass} rounded-xl p-4 text-white shadow hover:shadow-md transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}
