export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-sm text-gray-600">
        <span>© {new Date().getFullYear()} Amana Transportation</span>
        <span className="opacity-70">Prototype UI</span>
      </div>
    </footer>
  );
}
