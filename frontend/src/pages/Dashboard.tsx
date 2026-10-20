function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-900 p-8">

      {/* Welcome */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Good morning, Student 👋
        </h1>

        <p className="mt-2 text-slate-400">
          Here's how your academic journey is going.
        </p>
      </section>


      {/* Academic Health Score */}
      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-medium text-slate-400">
              Academic Health Score
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-5xl font-bold text-white">
                78
              </span>

              <span className="mb-2 text-lg text-slate-500">
                / 100
              </span>
            </div>

            <p className="mt-2 text-sm text-emerald-400">
              ● You're currently on track
            </p>
          </div>


          {/* Score Circle */}
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-indigo-500/30">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10">

              <span className="text-2xl font-bold text-indigo-400">
                78%
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* Statistics */}
      <section className="mb-6 grid gap-5 md:grid-cols-3">


        {/* Attendance */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <p className="text-sm text-slate-400">
            Attendance
          </p>

          <div className="mt-3 flex items-end justify-between">

            <p className="text-3xl font-bold text-white">
              84%
            </p>

            <span className="text-sm text-emerald-400">
              Healthy
            </span>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

            <div className="h-full w-[84%] rounded-full bg-emerald-500" />

          </div>

        </div>


        {/* Assignments */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <p className="text-sm text-slate-400">
            Assignment Completion
          </p>

          <div className="mt-3 flex items-end justify-between">

            <p className="text-3xl font-bold text-white">
              72%
            </p>

            <span className="text-sm text-amber-400">
              Attention
            </span>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

            <div className="h-full w-[72%] rounded-full bg-amber-500" />

          </div>

        </div>


        {/* Performance */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <p className="text-sm text-slate-400">
            Average Performance
          </p>

          <div className="mt-3 flex items-end justify-between">

            <p className="text-3xl font-bold text-white">
              78%
            </p>

            <span className="text-sm text-indigo-400">
              Good
            </span>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

            <div className="h-full w-[78%] rounded-full bg-indigo-500" />

          </div>

        </div>

      </section>


      {/* Bottom Dashboard Grid */}
      <section className="grid gap-6 lg:grid-cols-2">


        {/* Risk Insights */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Risk Insights
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Areas that may need your attention
              </p>
            </div>

            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
              2 Alerts
            </span>

          </div>


          {/* Alert 1 */}
          <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                !
              </div>

              <div>

                <h3 className="font-medium text-white">
                  Assignment completion is dropping
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Your completion rate has fallen to 72%.
                  Consider completing your pending assignments this week.
                </p>

              </div>

            </div>

          </div>


          {/* Alert 2 */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                i
              </div>

              <div>

                <h3 className="font-medium text-white">
                  Computer Networks needs attention
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Your recent performance in this subject
                  is below your overall average.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Upcoming Deadlines */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Upcoming Deadlines
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your next academic tasks
              </p>
            </div>

            <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
              View all
            </button>

          </div>


          {/* Deadline 1 */}
          <div className="flex items-center justify-between border-b border-slate-800 py-4">

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                CN
              </div>

              <div>

                <h3 className="text-sm font-medium text-white">
                  Network Security Assignment
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Computer Networks
                </p>

              </div>

            </div>

            <span className="text-xs font-medium text-amber-400">
              Tomorrow
            </span>

          </div>


          {/* Deadline 2 */}
          <div className="flex items-center justify-between border-b border-slate-800 py-4">

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                DB
              </div>

              <div>

                <h3 className="text-sm font-medium text-white">
                  Database Mini Project
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Database Management
                </p>

              </div>

            </div>

            <span className="text-xs font-medium text-slate-400">
              3 days
            </span>

          </div>


          {/* Deadline 3 */}
          <div className="flex items-center justify-between py-4">

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-sm font-semibold text-purple-400">
                OS
              </div>

              <div>

                <h3 className="text-sm font-medium text-white">
                  Operating Systems Quiz
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Operating Systems
                </p>

              </div>

            </div>

            <span className="text-xs font-medium text-slate-400">
              5 days
            </span>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Dashboard