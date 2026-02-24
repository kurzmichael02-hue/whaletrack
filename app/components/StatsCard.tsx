type Props = {
  label: string;
  value: string;
  positive?: boolean;
};

export default function StatsCard({ label, value, positive }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${positive ? "text-green-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}