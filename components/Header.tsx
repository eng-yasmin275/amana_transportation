// components/Header.tsx
export default function Header() {
  return (
    <header className="w-full">
      <nav className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="font-semibold">Amana Logo</div>
          <button
            type="button"
            className="rounded-md border border-white/20 px-3 py-1 text-sm hover:bg-white/10"
          >
            Menu
          </button>
        </div>
      </nav>

<div className="bg-green-500 text-black text-center">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <h1 className="text-2xl sm:text-3xl font-bold">Amana Transportation</h1>
    <h3 className="text-sm sm:text-base opacity-90 mt-1">
      Proudly servicing Malysian Bus Riders since 2019
    </h3>
  </div>
</div>
 
    </header>
  );
}