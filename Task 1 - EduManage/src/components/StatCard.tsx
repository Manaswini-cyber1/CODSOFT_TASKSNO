export default function StatCard({
  label,
  value,
  icon = "📊",
  trend,
}: {
  label: string;
  value: string | number;
  icon?: string;
  trend?: string;
}) {
  return (
    <div className="dashboard-card group p-5 transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[#172033]">
            {value}
          </p>

          {trend && (
            <p className="mt-2 text-xs font-medium text-green-600">
              {trend}
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 text-xl transition group-hover:scale-110">
          {icon}
        </div>
      </div>
    </div>
  );
}