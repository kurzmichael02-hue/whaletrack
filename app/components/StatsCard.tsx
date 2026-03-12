type Props = {
  label: string;
  value: string;
  positive?: boolean;
  icon?: string;
};

export default function StatsCard({ label, value, positive, icon }: Props) {
  return (
    <div className="relative rounded-2xl p-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}>
      <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(circle at top right, rgba(16,185,129,0.4), transparent 70%)" }} />
      <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${positive ? "text-green-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}