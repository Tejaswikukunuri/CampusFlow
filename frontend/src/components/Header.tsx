function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">

      {/* Page title */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Here's your academic overview
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-300 transition hover:bg-slate-800">
          <span className="text-lg">🔔</span>

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        {/* Date */}
        <div className="hidden text-right sm:block">
          <p className="text-xs text-slate-500">
            TODAY
          </p>

          <p className="text-sm font-medium text-slate-300">
            Academic Year 2026
          </p>
        </div>

      </div>

    </header>
  )
}

export default Header