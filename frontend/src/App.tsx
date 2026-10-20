
import { useCallback, useEffect, useMemo, useState } from 'react'

type RiskLevel = 'HIGH' | 'WATCH' | 'ON_TRACK'
type Page = 'overview' | 'risk' | 'insights'

type StudentRisk = {
  id: number
  name: string
  department: string
  attendance: number
  assignmentCompletion: number
  performance: number
  healthScore: number
  riskLevel: RiskLevel
  insights: string[]
}

type StudentForm = {
  fullName: string
  department: string
  attendance: string
  assignmentCompletion: string
  performance: string
}

const API_BASE = 'http://localhost:8080/api'
const RISK_URL = `${API_BASE}/students/risk`
const STUDENTS_URL = `${API_BASE}/students`

const emptyForm: StudentForm = {
  fullName: '',
  department: '',
  attendance: '75',
  assignmentCompletion: '70',
  performance: '70',
}

const inputStyle =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100'

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'

const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'

function getErrorMessage(body: string, status: number) {
  if (status === 401 || status === 403) {
    return 'Your session may have expired or your account does not have permission to manage students. Sign in again and retry.'
  }

  if (status === 404) return 'The requested student was not found.'
  if (status === 409) return 'This change conflicts with an existing record.'

  try {
    const data = JSON.parse(body) as {
      message?: string
      detail?: string
      error?: string
    }

    return data.message || data.detail || data.error ||
      `The server returned HTTP ${status}.`
  } catch {
    return body || `The server returned HTTP ${status}.`
  }
}

async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(getErrorMessage(body, response.status))
  }

  return response
}

function App() {
  const [students, setStudents] = useState<StudentRisk[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [page, setPage] = useState<Page>('overview')
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('ALL')
  const [riskFilter, setRiskFilter] = useState('ALL')

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentRisk | null>(null)
  const [form, setForm] = useState<StudentForm>(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadStudents = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true)
    setError('')

    try {
      const response = await fetch(RISK_URL, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(getErrorMessage(await response.text(), response.status))
      }

      const data = (await response.json()) as StudentRisk[]
      setStudents(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the CampusFlow backend. Make sure Spring Boot is running on port 8080.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStudents()
  }, [loadStudents])

  const departments = useMemo(
    () => [...new Set(students.map((student) => student.department))].sort(),
    [students],
  )

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query) ||
        String(student.id).includes(query)

      const matchesDepartment =
        department === 'ALL' || student.department === department

      const matchesRisk =
        riskFilter === 'ALL' || student.riskLevel === riskFilter

      return matchesSearch && matchesDepartment && matchesRisk
    })
  }, [students, search, department, riskFilter])

  const highRisk = students.filter((s) => s.riskLevel === 'HIGH').length
  const watch = students.filter((s) => s.riskLevel === 'WATCH').length
  const onTrack = students.filter((s) => s.riskLevel === 'ON_TRACK').length
  const average = percentage(students.map((s) => s.healthScore))

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'overview', label: 'Academic overview', icon: '◈' },
    { id: 'risk', label: 'Student risk register', icon: '▦' },
    { id: 'insights', label: 'Performance insights', icon: '◷' },
  ]

  function openCreateForm() {
    setEditingStudent(null)
    setForm({ ...emptyForm })
    setFormError('')
    setNotice('')
    setEditorOpen(true)
  }

  function openEditForm(student: StudentRisk) {
    setEditingStudent(student)
    setForm({
      fullName: student.name,
      department: student.department,
      attendance: String(student.attendance),
      assignmentCompletion: String(student.assignmentCompletion),
      performance: String(student.performance),
    })
    setFormError('')
    setNotice('')
    setEditorOpen(true)
  }

  function closeForm() {
    if (saving) return
    setEditorOpen(false)
    setEditingStudent(null)
    setFormError('')
  }

  function updateForm(field: keyof StudentForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function saveStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setNotice('')

    const fullName = form.fullName.trim()
    const studentDepartment = form.department.trim()

    if (!fullName || !studentDepartment) {
      setFormError('Student name and department are required.')
      return
    }

    const attendance = Number(form.attendance)
    const assignmentCompletion = Number(form.assignmentCompletion)
    const performance = Number(form.performance)

    const scores = [
      ['Attendance', attendance],
      ['Assignment completion', assignmentCompletion],
      ['Performance', performance],
    ] as const

    for (const [label, value] of scores) {
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        setFormError(`${label} must be a number between 0 and 100.`)
        return
      }
    }

    const payload = {
      fullName,
      department: studentDepartment,
      attendance,
      assignmentCompletion,
      performance,
    }

    setSaving(true)

    try {
      const editing = editingStudent !== null

      await apiRequest(
        editing
          ? `${STUDENTS_URL}/${editingStudent.id}`
          : STUDENTS_URL,
        {
          method: editing ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        },
      )

      setEditorOpen(false)
      setEditingStudent(null)
      setForm({ ...emptyForm })

      await loadStudents(false)
      setNotice(
        editing
          ? `Student "${fullName}" was updated.`
          : `Student "${fullName}" was added.`,
      )
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Unable to save the student. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteStudent(student: StudentRisk) {
    const confirmed = window.confirm(
      `Delete ${student.name} (ID ${student.id})?\n\nThis permanently removes the student record from the database.`,
    )

    if (!confirmed) return

    setDeletingId(student.id)
    setError('')
    setNotice('')

    try {
      await apiRequest(`${STUDENTS_URL}/${student.id}`, {
        method: 'DELETE',
      })

      await loadStudents(false)
      setNotice(`Student "${student.name}" was deleted.`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete this student. Please try again.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  function exportCsv() {
    const headers = [
      'Student ID',
      'Student Name',
      'Department',
      'Attendance',
      'Assignment Completion',
      'Performance',
      'Health Score',
      'Risk Level',
      'Insights',
    ]

    const rows = filteredStudents.map((student) => [
      student.id,
      student.name,
      student.department,
      student.attendance,
      student.assignmentCompletion,
      student.performance,
      student.healthScore,
      student.riskLevel,
      student.insights.join('; '),
    ])

    const escapeCell = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(','))
      .join('\r\n')

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'campusflow-student-report.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white p-6 md:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xl font-extrabold text-white shadow-lg shadow-indigo-200">
            C
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">CampusFlow</h1>
            <p className="mt-0.5 text-xs text-slate-500">Student success platform</p>
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1.5" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                aria-current={page === item.id ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                  page === item.id
                    ? 'bg-indigo-50 font-semibold text-indigo-700 ring-1 ring-indigo-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-lg" aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
            ✦
          </div>
          <p className="mt-3 text-sm font-bold">Academic Risk Engine</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Transparent insights to help faculty identify students who may need support.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Rule-based analysis
          </div>
        </div>
      </aside>

      <main className="mx-auto max-w-[1600px] p-4 sm:p-6 md:ml-64 md:p-9">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              Student success center
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {page === 'overview'
                ? 'Academic overview'
                : page === 'risk'
                  ? 'Student risk register'
                  : 'Performance insights'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              {page === 'overview'
                ? 'Understand performance, identify risk, and help students move forward.'
                : page === 'risk'
                  ? 'Explore risk indicators and find students who may benefit from support.'
                  : 'Compare academic indicators and understand overall student progress.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openCreateForm}
              className={primaryButton}
            >
              <span aria-hidden="true">＋</span> Add student
            </button>
            <button
              type="button"
              onClick={() => void loadStudents()}
              disabled={loading}
              className={secondaryButton}
            >
              {loading ? 'Refreshing…' : '↻ Refresh'}
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filteredStudents.length === 0}
              className={secondaryButton}
            >
              ↓ Export CSV
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <span>✓ {notice}</span>
            <button
              type="button"
              onClick={() => setNotice('')}
              className="font-semibold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <section role="alert" className="mt-7 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="font-bold text-rose-800">Could not complete the request</p>
            <p className="mt-1 text-sm leading-6 text-rose-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadStudents()}
              className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
            >
              Retry loading students
            </button>
          </section>
        )}

        {editorOpen && (
          <section
            className="mt-7 rounded-2xl border border-indigo-100 bg-white shadow-sm"
            aria-labelledby="student-editor-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Student management
                </p>
                <h3 id="student-editor-title" className="mt-1 text-xl font-bold">
                  {editingStudent ? 'Edit student record' : 'Add a new student'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Enter student details and academic indicators from 0 to 100.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close student form"
                className="rounded-lg px-3 py-2 text-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={(event) => void saveStudent(event)} className="p-5 sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Full name *
                  <input
                    autoFocus
                    required
                    maxLength={100}
                    value={form.fullName}
                    onChange={(event) => updateForm('fullName', event.target.value)}
                    placeholder="e.g. Ananya Rao"
                    className={inputStyle}
                    disabled={saving}
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Department *
                  <input
                    required
                    maxLength={100}
                    list="campusflow-departments"
                    value={form.department}
                    onChange={(event) => updateForm('department', event.target.value)}
                    placeholder="e.g. IT or CSE"
                    className={inputStyle}
                    disabled={saving}
                  />
                  <datalist id="campusflow-departments">
                    {departments.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </label>

                <ScoreInput
                  label="Attendance (%)"
                  value={form.attendance}
                  onChange={(value) => updateForm('attendance', value)}
                  disabled={saving}
                />
                <ScoreInput
                  label="Assignment completion (%)"
                  value={form.assignmentCompletion}
                  onChange={(value) => updateForm('assignmentCompletion', value)}
                  disabled={saving}
                />
                <ScoreInput
                  label="Academic performance (%)"
                  value={form.performance}
                  onChange={(value) => updateForm('performance', value)}
                  disabled={saving}
                />
              </div>

              {formError && (
                <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-700">
                  {formError}
                </p>
              )}

              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className={secondaryButton}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={primaryButton}>
                  {saving
                    ? 'Saving…'
                    : editingStudent
                      ? 'Save changes'
                      : 'Create student'}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading && students.length === 0 && !error && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
                <div className="h-3 w-28 rounded bg-slate-100" />
                <div className="mt-5 h-8 w-16 rounded bg-slate-100" />
                <div className="mt-3 h-3 w-36 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">◎</div>
            <h3 className="mt-4 text-lg font-bold">No student records yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first student record to populate the dashboard.
            </p>
            <button type="button" onClick={openCreateForm} className={`${primaryButton} mt-5`}>
              ＋ Add your first student
            </button>
          </section>
        )}

        {!error && students.length > 0 && (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Students analyzed"
                value={String(students.length)}
                detail="Total records returned by the API"
                icon="◎"
                accent="indigo"
              />
              <SummaryCard
                label="Average health score"
                value={`${average}/100`}
                detail="Weighted academic indicator"
                icon="↗"
                accent="violet"
                progress={average}
              />
              <SummaryCard
                label="High risk"
                value={String(highRisk)}
                detail="Priority review recommended"
                icon="!"
                accent="rose"
              />
              <SummaryCard
                label="Needs attention"
                value={String(watch)}
                detail={`${onTrack} students currently on track`}
                icon="◷"
                accent="amber"
              />
            </section>

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center">
                <div>
                  <h3 className="text-lg font-bold">Student records</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Search, filter, add, edit, delete, or export student records.
                  </p>
                </div>
                <span className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  API connected
                </span>
              </div>

              <div className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1fr)_220px_190px_auto]">
                <label className="relative block">
                  <span className="sr-only">Search students</span>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, department, ID…"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>

                <label>
                  <span className="sr-only">Filter by department</span>
                  <select
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="ALL">All departments</option>
                    {departments.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="sr-only">Filter by risk level</span>
                  <select
                    value={riskFilter}
                    onChange={(event) => setRiskFilter(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="ALL">All risk levels</option>
                    <option value="HIGH">High risk</option>
                    <option value="WATCH">Watch</option>
                    <option value="ON_TRACK">On track</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setDepartment('ALL')
                    setRiskFilter('ALL')
                  }}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-700"
                >
                  Reset filters
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-xs text-slate-500 sm:px-6">
                <span>
                  Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of{' '}
                  <strong className="text-slate-800">{students.length}</strong> students
                </span>
                <span>Scores are indicators, not definitive judgments.</span>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="font-semibold text-slate-700">No matching students</p>
                  <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1080px] text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4 sm:px-6">Student</th>
                        <th className="px-4 py-4">Attendance</th>
                        <th className="px-4 py-4">Assignments</th>
                        <th className="px-4 py-4">Performance</th>
                        <th className="px-4 py-4">Health score</th>
                        <th className="px-4 py-4">Risk status</th>
                        <th className="px-5 py-4 sm:px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="transition hover:bg-indigo-50/30">
                          <td className="px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                                {student.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{student.name}</p>
                                <p className="mt-1 text-xs text-slate-500">{student.department} · ID {student.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">{student.attendance}%</td>
                          <td className="px-4 py-4">{student.assignmentCompletion}%</td>
                          <td className="px-4 py-4">{student.performance}%</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="w-7 font-bold">{student.healthScore}</span>
                              <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${clamp(student.healthScore)}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4"><RiskBadge level={student.riskLevel} /></td>
                          <td className="px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditForm(student)}
                                disabled={saving || deletingId !== null}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => void deleteStudent(student)}
                                disabled={saving || deletingId !== null}
                                className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                              >
                                {deletingId === student.id ? 'Deleting…' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {page === 'overview' && (
              <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">Risk distribution</h3>
                      <p className="mt-1 text-sm text-slate-500">Current student classification</p>
                    </div>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Overview</span>
                  </div>
                  <div className="mt-7 space-y-5">
                    <DistributionRow label="On track" count={onTrack} total={students.length} color="bg-emerald-500" />
                    <DistributionRow label="Watch" count={watch} total={students.length} color="bg-amber-500" />
                    <DistributionRow label="High risk" count={highRisk} total={students.length} color="bg-rose-500" />
                  </div>
                  <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    Risk levels are calculated from attendance, assignment completion, and performance using the configured weighted scoring rules.
                  </div>
                </section>
                <InsightsSection students={students} />
              </div>
            )}

            {page === 'risk' && (
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <h3 className="text-lg font-bold">Risk register and recommended attention</h3>
                  <p className="mt-1 text-sm text-slate-500">Use the filters above to focus on a department or risk category.</p>
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredStudents
                    .filter((student) => student.riskLevel !== 'ON_TRACK')
                    .map((student) => (
                      <article key={student.id} className="rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold">{student.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{student.department}</p>
                          </div>
                          <RiskBadge level={student.riskLevel} />
                        </div>
                        <div className="mt-5 flex items-end justify-between gap-2">
                          <div>
                            <p className="text-xs text-slate-500">Health score</p>
                            <p className="mt-1 text-3xl font-extrabold">{student.healthScore}<span className="text-base font-medium text-slate-400">/100</span></p>
                          </div>
                          <button type="button" onClick={() => openEditForm(student)} className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                            Update record
                          </button>
                        </div>
                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                          {student.insights.map((insight) => (
                            <p key={insight} className="flex gap-2 text-sm leading-5 text-slate-600">
                              <span className="text-amber-500">•</span>{insight}
                            </p>
                          ))}
                        </div>
                      </article>
                    ))}
                </div>
                {filteredStudents.filter((student) => student.riskLevel !== 'ON_TRACK').length === 0 && (
                  <p className="p-8 text-center text-sm text-slate-500">No students in this filtered view need attention under the current rules.</p>
                )}
              </section>
            )}

            {page === 'insights' && (
              <>
                <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <SummaryCard label="Average attendance" value={`${percentage(filteredStudents.map((s) => s.attendance))}%`} detail="Across the filtered students" icon="◷" accent="indigo" />
                  <SummaryCard label="Assignment completion" value={`${percentage(filteredStudents.map((s) => s.assignmentCompletion))}%`} detail="Average completion rate" icon="✓" accent="violet" />
                  <SummaryCard label="Academic performance" value={`${percentage(filteredStudents.map((s) => s.performance))}%`} detail="Average performance indicator" icon="↗" accent="emerald" />
                </section>
                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="text-lg font-bold">Performance comparison</h3>
                  <p className="mt-1 text-sm text-slate-500">Compare academic indicators for each student in the current filtered view.</p>
                  <div className="mt-7 space-y-7">
                    {filteredStudents.map((student) => (
                      <div key={student.id}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{student.department}</p>
                          </div>
                          <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">Health {student.healthScore}/100</span>
                        </div>
                        <MetricBar label="Attendance" value={student.attendance} color="bg-indigo-500" />
                        <MetricBar label="Assignments" value={student.assignmentCompletion} color="bg-violet-500" />
                        <MetricBar label="Performance" value={student.performance} color="bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                </section>
                <InsightsSection students={filteredStudents} />
              </>
            )}

            <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-200 py-6 text-xs text-slate-400 sm:flex-row sm:items-center">
              <p>© {new Date().getFullYear()} CampusFlow · Academic Risk & Student Success Platform</p>
              <p>Explainable, rule-based academic indicators</p>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}

function ScoreInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label} *
      <input
        required
        type="number"
        min={0}
        max={100}
        step="any"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputStyle}
        disabled={disabled}
      />
      <span className="mt-1 block text-xs font-normal text-slate-400">Allowed range: 0–100</span>
    </label>
  )
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
  accent,
  progress,
}: {
  label: string
  value: string
  detail: string
  icon: string
  accent: 'indigo' | 'violet' | 'rose' | 'amber' | 'emerald'
  progress?: number
}) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    violet: 'bg-violet-50 text-violet-700',
    rose: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${colors[accent]}`}>{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight">{value}</p>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${clamp(progress)}%` }} />
        </div>
      )}
      <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  )
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    HIGH: 'border-rose-100 bg-rose-50 text-rose-700',
    WATCH: 'border-amber-100 bg-amber-50 text-amber-700',
    ON_TRACK: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  }

  const labels: Record<RiskLevel, string> = {
    HIGH: 'High risk',
    WATCH: 'Watch',
    ON_TRACK: 'On track',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[level]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[level]}
    </span>
  )
}

function DistributionRow({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  const ratio = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{count} <span className="text-xs">({Math.round(ratio)}%)</span></span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  )
}

function MetricBar({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="mb-3 grid grid-cols-[95px_1fr_42px] items-center gap-3 text-xs">
      <span className="text-slate-500">{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${clamp(value)}%` }} />
      </div>
      <span className="text-right font-semibold text-slate-700">{value}%</span>
    </div>
  )
}

function InsightsSection({ students }: { students: StudentRisk[] }) {
  const flagged = students.filter((student) => student.riskLevel !== 'ON_TRACK')

  return (
    <section className="min-w-0">
      <div>
        <h3 className="text-lg font-bold">Priority insights</h3>
        <p className="mt-1 text-sm text-slate-500">Factors identified by the rule-based risk engine.</p>
      </div>
      {flagged.length === 0 ? (
        <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
          No students are flagged for attention in this view under the current rules.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {flagged.map((student) => (
            <article key={student.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">{student.name}</p>
                <RiskBadge level={student.riskLevel} />
              </div>
              <p className="mt-1 text-sm text-slate-500">{student.department} · Health score {student.healthScore}/100</p>
              <ul className="mt-4 space-y-2">
                {student.insights.map((insight) => (
                  <li key={insight} className="flex gap-2 text-sm leading-5 text-slate-600">
                    <span className="font-bold text-indigo-600">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function percentage(values: number[]) {
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

export default App
