export default function Navbar() {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-white">Dashboard</h2>
      <button className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">
        Connect Wallet
      </button>
    </header>
  );
}