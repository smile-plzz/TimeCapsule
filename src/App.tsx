import { useState, useMemo, useCallback, useEffect, type ReactNode } from 'react'
import {
  Calendar,
  Search,
  Upload,
  Heart,
  MapPin,
  Users,
  Sparkles,
  Grid3X3,
  BookOpen,
  GitCompare,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  MessageSquare,
  MapPinned,
  Shield,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { sampleMemories, COLLECTIONS } from './data/sampleMemories'
import type { Memory, ViewMode, Mood } from './lib/types'
import { ImportPanel } from './components/ImportPanel'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MOOD_EMOJI: Record<Mood, string> = {
  happy: '😊',
  sad: '😢',
  excited: '😍',
  quiet: '😴',
  celebration: '🎉',
  neutral: '😐',
}

const TYPE_ICON: Record<string, ReactNode> = {
  status: <MessageSquare className="w-3.5 h-3.5" />,
  photo: <ImageIcon className="w-3.5 h-3.5" />,
  video: <ImageIcon className="w-3.5 h-3.5" />,
  checkin: <MapPinned className="w-3.5 h-3.5" />,
  event: <Calendar className="w-3.5 h-3.5" />,
  life_event: <Sparkles className="w-3.5 h-3.5" />,
  other: <BookOpen className="w-3.5 h-3.5" />,
}

type OnboardingStep = 'welcome' | 'why' | 'how' | 'ready'

function App() {
  const [memories, setMemories] = useState<Memory[]>(sampleMemories)
  const [view, setView] = useState<ViewMode>('explorer')
  const [selectedMonth, setSelectedMonth] = useState(8)
  const [selectedDay, setSelectedDay] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [compareYearA, setCompareYearA] = useState(2015)
  const [compareYearB, setCompareYearB] = useState(2025)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [collapsedYears, setCollapsedYears] = useState<Set<number>>(new Set())

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome')
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('timecapsule_onboarding_seen')
    if (!seen) {
      setShowOnboarding(true)
    } else {
      setHasSeenOnboarding(true)
    }
    const side = localStorage.getItem('timecapsule_sidebar')
    if (side === '0') setSidebarOpen(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => {
      const next = !prev
      localStorage.setItem('timecapsule_sidebar', next ? '1' : '0')
      return next
    })
  }, [])

  const toggleYear = useCallback((year: number) => {
    setCollapsedYears(prev => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }, [])

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('timecapsule_onboarding_seen', '1')
    setHasSeenOnboarding(true)
    setShowOnboarding(false)
    setSelectedMonth(8)
    setSelectedDay(5)
    setView('explorer')
  }, [])

  const dayMemories = useMemo(() => {
    return memories
      .filter(m => m.month === selectedMonth && m.day === selectedDay)
      .sort((a, b) => b.year - a.year)
  }, [memories, selectedMonth, selectedDay])

  const memoriesByYear = useMemo(() => {
    const map = new Map<number, Memory[]>()
    for (const m of dayMemories) {
      const list = map.get(m.year) || []
      list.push(m)
      map.set(m.year, list)
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0])
  }, [dayMemories])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return memories
      .filter(
        m =>
          m.text?.toLowerCase().includes(q) ||
          m.title?.toLowerCase().includes(q) ||
          m.location?.toLowerCase().includes(q) ||
          m.people?.some(p => p.toLowerCase().includes(q)) ||
          m.tags?.some(t => t.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [memories, searchQuery])

  const collectionMemories = useMemo(() => {
    if (!selectedCollection) return []
    const col = COLLECTIONS.find(c => c.id === selectedCollection)
    if (!col) return []
    return memories.filter(col.filter).sort((a, b) => b.date.localeCompare(a.date))
  }, [memories, selectedCollection])

  const heatmapData = useMemo(() => {
    const map = new Map<string, number>()
    memories.forEach(m => {
      const key = `${m.month}-${m.day}`
      map.set(key, (map.get(key) || 0) + 1)
    })
    return map
  }, [memories])

  const years = useMemo(() => {
    return [...new Set(memories.map(m => m.year))].sort((a, b) => b - a)
  }, [memories])

  const navItems = [
    { id: 'explorer' as ViewMode, label: 'Any-Day', icon: Calendar },
    { id: 'heatmap' as ViewMode, label: 'Heatmap', icon: Grid3X3 },
    { id: 'search' as ViewMode, label: 'Search', icon: Search },
    { id: 'collections' as ViewMode, label: 'Collections', icon: Heart },
    { id: 'compare' as ViewMode, label: 'Compare', icon: GitCompare },
    { id: 'import' as ViewMode, label: 'Import', icon: Upload },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {showOnboarding && (
        <OnboardingFlow
          step={onboardingStep}
          setStep={setOnboardingStep}
          onComplete={completeOnboarding}
          onSkip={completeOnboarding}
        />
      )}

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 transition-colors"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/90 to-indigo-500/90 shadow-sm shadow-cyan-500/10">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <h1 className="text-sm font-semibold tracking-tight text-zinc-50">TimeCapsule</h1>
                <p className="text-[11px] text-zinc-500 hidden sm:block">Every day has a story</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="hidden sm:inline tabular-nums">
              {memories.length} memories · {years.length} years
            </span>
            {hasSeenOnboarding && (
              <button
                type="button"
                onClick={() => {
                  setOnboardingStep('welcome')
                  setShowOnboarding(true)
                }}
                className="text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                How to import
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`sidebar hidden md:flex flex-col border-r border-white/[0.06] bg-zinc-950 sticky top-14 h-[calc(100vh-3.5rem)] ${
            sidebarOpen ? 'sidebar-expanded w-52' : 'sidebar-collapsed w-[60px]'
          }`}
        >
          <nav className="flex flex-col gap-0.5 p-2 pt-3">
            {navItems.map(item => {
              const Icon = item.icon
              const active = view === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  title={item.label}
                  className={`group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300'
                      : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : ''}`} />
                  <span className="sidebar-label">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-auto p-3 border-t border-white/[0.06]">
            <p
              className={`text-[10px] text-zinc-600 leading-relaxed ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
              }`}
            >
              Privacy-first. On-device only.
            </p>
          </div>
        </aside>

        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.06] bg-zinc-950/95 backdrop-blur-xl">
          <div className="flex justify-around px-1 py-1.5">
            {navItems.map(item => {
              const Icon = item.icon
              const active = view === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[3.25rem] ${
                    active ? 'text-cyan-400' : 'text-zinc-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-10 pb-24 md:pb-10 max-w-5xl mx-auto w-full">
          {view === 'explorer' && (
            <div className="space-y-6 fade-up">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Any-Day Explorer</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {dayMemories.length} {dayMemories.length === 1 ? 'memory' : 'memories'} on{' '}
                    {MONTHS[selectedMonth - 1]} {selectedDay}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.08] bg-zinc-900/80 p-1">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="bg-transparent text-sm text-zinc-200 px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1} className="bg-zinc-900">{m}</option>
                    ))}
                  </select>
                  <span className="text-zinc-700">/</span>
                  <select
                    value={selectedDay}
                    onChange={e => setSelectedDay(Number(e.target.value))}
                    className="bg-transparent text-sm text-zinc-200 px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d} className="bg-zinc-900">{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {dayMemories.length === 0 ? (
                <EmptyState
                  title="Nothing on this day"
                  body="Try another date, or import your Facebook archive to fill the timeline."
                  actionLabel="Go to Import"
                  onAction={() => setView('import')}
                />
              ) : (
                <div className="space-y-3">
                  {memoriesByYear.map(([year, mems]) => {
                    const isCollapsed = collapsedYears.has(year)
                    return (
                      <div
                        key={year}
                        className="rounded-xl border border-white/[0.06] bg-zinc-900/40 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleYear(year)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-base font-semibold tabular-nums text-cyan-300/90">{year}</span>
                            <span className="text-xs text-zinc-600">
                              {mems.length} {mems.length === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${
                              isCollapsed ? '-rotate-90' : ''
                            }`}
                          />
                        </button>
                        <div className={`year-group-body ${isCollapsed ? 'collapsed' : ''}`}>
                          <div>
                            <div className="border-t border-white/[0.04] px-3 pb-3 pt-1 space-y-2">
                              {mems.map(mem => (
                                <MemoryCard key={mem.id} memory={mem} nested />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {view === 'heatmap' && (
            <div className="space-y-6 fade-up">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Calendar Heatmap</h2>
                <p className="mt-1 text-sm text-zinc-500">Activity density across the year. Click a day to explore.</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 sm:p-5 overflow-x-auto">
                <Heatmap
                  data={heatmapData}
                  onSelect={(month, day) => {
                    setSelectedMonth(month)
                    setSelectedDay(day)
                    setView('explorer')
                  }}
                />
              </div>
            </div>
          )}

          {view === 'search' && (
            <div className="space-y-6 fade-up">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Search</h2>
                <p className="mt-1 text-sm text-zinc-500">Captions, places, people, tags.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Japan, birthday, Dhaka…"
                  className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-shadow"
                />
              </div>
              {searchQuery && (
                <p className="text-xs text-zinc-500 tabular-nums">{searchResults.length} results</p>
              )}
              <div className="space-y-2">
                {searchResults.map(mem => (
                  <MemoryCard key={mem.id} memory={mem} />
                ))}
              </div>
            </div>
          )}

          {view === 'collections' && (
            <div className="space-y-6 fade-up">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Collections</h2>
                <p className="mt-1 text-sm text-zinc-500">Anniversary sets from your archive.</p>
              </div>
              {!selectedCollection ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COLLECTIONS.map(col => {
                    const count = memories.filter(col.filter).length
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelectedCollection(col.id)}
                        className="group text-left rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 hover:border-cyan-500/25 hover:bg-zinc-900/70 transition-all"
                      >
                        <div className="text-2xl mb-2">{col.emoji}</div>
                        <div className="text-sm font-medium text-zinc-100 group-hover:text-cyan-300 transition-colors">{col.name}</div>
                        <div className="text-xs text-zinc-600 mt-0.5 tabular-nums">{count} memories</div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedCollection(null)}
                    className="inline-flex items-center gap-1 text-sm text-cyan-400/90 hover:text-cyan-300 mb-4 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <h3 className="text-lg font-medium mb-4 text-zinc-100">
                    {COLLECTIONS.find(c => c.id === selectedCollection)?.emoji}{' '}
                    {COLLECTIONS.find(c => c.id === selectedCollection)?.name}
                  </h3>
                  <div className="space-y-2">
                    {collectionMemories.map(mem => (
                      <MemoryCard key={mem.id} memory={mem} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'compare' && (
            <div className="space-y-6 fade-up">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Compare Years</h2>
                <p className="mt-1 text-sm text-zinc-500">Same calendar day, side by side.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.08] bg-zinc-900/80 p-1">
                  <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="bg-transparent text-sm text-zinc-200 px-2 py-1.5 rounded-lg focus:outline-none">
                    {MONTHS.map((m, i) => (<option key={m} value={i + 1} className="bg-zinc-900">{m}</option>))}
                  </select>
                  <select value={selectedDay} onChange={e => setSelectedDay(Number(e.target.value))} className="bg-transparent text-sm text-zinc-200 px-2 py-1.5 rounded-lg focus:outline-none">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (<option key={d} value={d} className="bg-zinc-900">{d}</option>))}
                  </select>
                </div>
                <div className="inline-flex items-center gap-2 text-sm">
                  <select value={compareYearA} onChange={e => setCompareYearA(Number(e.target.value))} className="rounded-lg border border-white/[0.08] bg-zinc-900/80 px-2.5 py-1.5 text-zinc-200 focus:outline-none">
                    {years.map(y => (<option key={y} value={y} className="bg-zinc-900">{y}</option>))}
                  </select>
                  <span className="text-zinc-600 text-xs">vs</span>
                  <select value={compareYearB} onChange={e => setCompareYearB(Number(e.target.value))} className="rounded-lg border border-white/[0.08] bg-zinc-900/80 px-2.5 py-1.5 text-zinc-200 focus:outline-none">
                    {years.map(y => (<option key={y} value={y} className="bg-zinc-900">{y}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {[compareYearA, compareYearB].map(year => {
                  const mems = memories.filter(m => m.year === year && m.month === selectedMonth && m.day === selectedDay)
                  return (
                    <div key={year} className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
                      <h3 className="text-sm font-semibold tabular-nums text-cyan-300/90 mb-3">{year}</h3>
                      {mems.length === 0 ? (
                        <p className="text-xs text-zinc-600">No memories this day</p>
                      ) : (
                        <div className="space-y-2">{mems.map(m => (<MemoryCard key={m.id} memory={m} compact nested />))}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {view === 'import' && (
            <div className="fade-up">
              <ImportPanel
                onMemoriesLoaded={mems => {
                  setMemories(mems)
                  if (mems[0]) {
                    setSelectedMonth(mems[0].month)
                    setSelectedDay(mems[0].day)
                  }
                  setView('explorer')
                }}
                onExplore={() => setView('explorer')}
                onShowGuide={() => {
                  setOnboardingStep('how')
                  setShowOnboarding(true)
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string
  body: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.08] bg-zinc-900/20 px-6 py-16 text-center">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      <p className="mt-1.5 text-sm text-zinc-600 max-w-sm mx-auto">{body}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="mt-5 inline-flex items-center rounded-lg bg-cyan-600/90 hover:bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function OnboardingFlow({
  step,
  setStep,
  onComplete,
  onSkip,
}: {
  step: OnboardingStep
  setStep: (s: OnboardingStep) => void
  onComplete: () => void
  onSkip: () => void
}) {
  const steps: OnboardingStep[] = ['welcome', 'why', 'how', 'ready']
  const idx = steps.indexOf(step)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-900 shadow-2xl shadow-black/40 overflow-hidden">
        <div className="flex gap-1.5 px-5 pt-5">
          {steps.map((s, i) => (
            <div key={s} className={`h-0.5 flex-1 rounded-full transition-colors ${i <= idx ? 'bg-cyan-400' : 'bg-zinc-800'}`} />
          ))}
        </div>
        <div className="p-5 space-y-4">
          {step === 'welcome' && (
            <>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Every day has a story</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Facebook shows one memory at a time. TimeCapsule lets you pick any calendar day and see every moment from that day across all the years you have.
              </p>
              <p className="text-xs text-zinc-600">On-device only. No Facebook login. No cloud upload.</p>
            </>
          )}
          {step === 'why' && (
            <>
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Why your archive</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                To answer “every August 5 for the last 15 years,” we need Meta’s official copy of your history. Download once, drop the ZIP here.
              </p>
              <ul className="space-y-2 text-sm text-zinc-400">
                {['Never logs into Facebook for you', 'ZIP stays in your browser', 'Clear local data anytime'].map(t => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}
          {step === 'how' && (
            <>
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Get your data</h2>
              <ol className="space-y-2.5 text-sm text-zinc-400">
                <li className="flex gap-2.5"><span className="font-mono text-cyan-400/80 text-xs mt-0.5">1</span><span>Facebook → Settings → Accounts Center → Download your information</span></li>
                <li className="flex gap-2.5"><span className="font-mono text-cyan-400/80 text-xs mt-0.5">2</span><span>Format <strong className="text-amber-300/90">JSON</strong>, date range All time, include Posts + Photos</span></li>
                <li className="flex gap-2.5"><span className="font-mono text-cyan-400/80 text-xs mt-0.5">3</span><span>Download the ZIP when Meta emails you, then import here</span></li>
              </ol>
              <div className="flex items-start gap-2 rounded-lg bg-amber-500/8 border border-amber-500/20 p-2.5 text-xs text-amber-200/80">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong>JSON only.</strong> HTML exports cannot be parsed.</span>
              </div>
              <a href="https://www.facebook.com/dyi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300">
                Open Download Your Information <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          )}
          {step === 'ready' && (
            <>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Ready to explore</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Demo memories are loaded so you can try Any-Day Explorer now. Import your real JSON ZIP whenever it arrives.
              </p>
              <p className="text-xs text-zinc-600">Tip: start with August 5 — or your birthday.</p>
            </>
          )}
        </div>
        <div className="px-5 pb-5 flex items-center justify-between gap-3">
          <button type="button" onClick={onSkip} className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Skip</button>
          <div className="flex gap-2">
            {idx > 0 && (
              <button type="button" onClick={() => setStep(steps[idx - 1])} className="px-3.5 py-2 rounded-lg border border-white/[0.08] text-zinc-400 text-sm hover:bg-white/[0.03] transition-colors">Back</button>
            )}
            {idx < steps.length - 1 ? (
              <button type="button" onClick={() => setStep(steps[idx + 1])} className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors inline-flex items-center gap-1">Continue <ChevronRight className="w-3.5 h-3.5" /></button>
            ) : (
              <button type="button" onClick={onComplete} className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors">Explore</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MemoryCard({
  memory,
  compact = false,
  nested = false,
}: {
  memory: Memory
  compact?: boolean
  nested?: boolean
}) {
  const showMedia =
    !!memory.mediaUrl &&
    (memory.mediaUrl.startsWith('blob:') ||
      memory.mediaUrl.startsWith('http') ||
      memory.mediaUrl.startsWith('data:'))

  return (
    <article
      className={`rounded-lg border border-white/[0.05] bg-zinc-950/50 hover:border-white/[0.08] transition-colors ${
        compact || nested ? 'p-3' : 'p-4'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {!nested && (
            <>
              <span className="font-semibold tabular-nums text-cyan-300/80">{memory.year}</span>
              <span className="text-zinc-700">·</span>
            </>
          )}
          <span className="inline-flex items-center gap-1 capitalize">
            {TYPE_ICON[memory.type]}
            {memory.type.replace('_', ' ')}
          </span>
          {memory.mood && memory.mood !== 'neutral' && (
            <span title={memory.mood} className="text-sm leading-none">{MOOD_EMOJI[memory.mood]}</span>
          )}
        </div>
        {memory.location && (
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-600 shrink-0">
            <MapPin className="w-3 h-3" />
            {memory.location}
          </span>
        )}
      </div>
      {memory.title && (
        <h4 className={`font-medium text-zinc-100 mt-1.5 ${compact ? 'text-sm' : 'text-[15px]'}`}>{memory.title}</h4>
      )}
      {memory.text && (
        <p className={`text-zinc-500 mt-1 leading-relaxed ${compact ? 'text-xs line-clamp-2' : 'text-sm'}`}>{memory.text}</p>
      )}
      {showMedia && (
        <div className={`mt-2.5 overflow-hidden rounded-md border border-white/[0.06] ${compact ? 'max-h-28' : 'max-h-64'}`}>
          <img
            src={memory.mediaUrl}
            alt={memory.title || memory.text || 'Memory photo'}
            className="w-full object-cover"
            style={{ maxHeight: compact ? '7rem' : '16rem' }}
            loading="lazy"
          />
        </div>
      )}
      {memory.people && memory.people.length > 0 && (
        <div className="flex items-center gap-1 mt-2 text-[11px] text-zinc-600">
          <Users className="w-3 h-3" />
          {memory.people.join(', ')}
        </div>
      )}
      {memory.tags && memory.tags.length > 0 && !compact && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {memory.tags.map(t => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[11px] text-zinc-500">#{t}</span>
          ))}
        </div>
      )}
    </article>
  )
}

function Heatmap({
  data,
  onSelect,
}: {
  data: Map<string, number>
  onSelect: (month: number, day: number) => void
}) {
  const max = Math.max(...Array.from(data.values()), 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="inline-block min-w-full">
      <div className="flex gap-1 mb-1 text-[10px] text-zinc-600">
        <div className="w-9" />
        {Array.from({ length: 31 }, (_, i) => (
          <div key={i} className="w-3.5 text-center">{(i + 1) % 5 === 0 || i === 0 ? i + 1 : ''}</div>
        ))}
      </div>
      {months.map(month => (
        <div key={month} className="flex gap-1 items-center mb-1">
          <div className="w-9 text-[10px] text-zinc-600 text-right pr-1.5 tabular-nums">{MONTHS[month - 1].slice(0, 3)}</div>
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1
            const daysInMonth = new Date(2024, month, 0).getDate()
            if (day > daysInMonth) return <div key={day} className="w-3.5 h-3.5" />
            const key = `${month}-${day}`
            const count = data.get(key) || 0
            const intensity = count === 0 ? 0 : 0.18 + (count / max) * 0.82
            return (
              <button
                key={day}
                type="button"
                title={`${MONTHS[month - 1]} ${day}: ${count} memories`}
                onClick={() => onSelect(month, day)}
                className="heatmap-cell w-3.5 h-3.5"
                style={{ backgroundColor: count === 0 ? '#18181b' : `rgba(34, 211, 238, ${intensity})` }}
              />
            )
          })}
        </div>
      ))}
      <div className="flex items-center gap-1.5 mt-4 text-[10px] text-zinc-600">
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <div key={v} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: v === 0 ? '#18181b' : `rgba(34, 211, 238, ${v})` }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

export default App
