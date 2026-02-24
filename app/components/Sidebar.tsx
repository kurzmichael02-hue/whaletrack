export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-green-400">🐋 WhaleTrack</h1>
      <nav className="flex flex-col gap-2">
        <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800">Dashboard</a>
        <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800">Portfolio</a>
        <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800">Trades</a>
        <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800">Settings</a>
      </nav>
    </aside>
  );
}