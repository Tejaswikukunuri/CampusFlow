function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold">
            C
          </div>

          <div>
            <h1 className="text-lg font-bold">CampusFlow</h1>
            <p className="text-xs text-slate-400">Student Success</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>

        <div className="space-y-2">

          {/* Dashboard */}
          <button className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-medium text-white">
            <span className="text-lg">â–£</span>
            Dashboard
          </button>

          {/* Subjects */}
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
            <span className="text-lg">â—‰</span>
            My Subjects
          </button>

          {/* Assignments */}
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
            <span className="text-lg">âœ“</span>
            Assignments
          </button>

          {/* Attendance */}
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
            <span className="text-lg">â—·</span>
            Attendance
          </button>

          {/* Performance */}
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
            <span className="text-lg">â–¥</span>
            Performance
          </button>

        </div>

        {/* Bottom section */}
        <div className="mt-8">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Account
          </p>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
            <span className="text-lg">âš™</span>
            Settings
          </button>

        </div>

      </nav>

      {/* User profile */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold">
            TS
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              Student
            </p>

            <p className="truncate text-xs text-slate-400">
              3rd Year â€¢ B.Tech
            </p>
          </div>

        </div>
      </div>

    </aside>
  )
}

export default Sidebar
