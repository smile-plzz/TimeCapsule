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
  Image as ImageIcon,
  MessageSquare,
  MapPinned,
  Shield,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { sampleMemories, COLLECTIONS } from './data/sampleMemories'
import type { Memory, ViewMode, Mood } from './lib/types'
import { ImportPanel } from './components/ImportPanel'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
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
  status: <MessageSquare className="w-4 h-4" />,
  photo: <ImageIcon className="w-4 h-4" />,
  video: <ImageIcon className="w-4 h-4" />,
  checkin: <MapPinned className="w-4 h-4" />,
  event: <Calendar className="w-4 h-4" />,
  life_event: <Sparkles className="w-4 h-4" />,
  other: <BookOpen className="w-4 h-4" />,
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

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return memories.filter(m =>
      m.text?.toLowerCase().includes(q) ||
      m.title?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.people?.some(p => p.toLowerCase().includes(q)) ||
      m.tags?.some(t => t.toLowerCase().includes(q))
    ).sort((a, b) => b.date.localeCompare(a.date))
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {showOnboarding && (
        <OnboardingFlow
          step={onboardingStep}
          setStep={setOnboardingStep}
          onComplete={completeOnboarding}
          onSkip={completeOnboarding}
        />
      )}

      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                TimeCapsule
              </h1>
              <p className="text-xs text-slate-500">Every day has a story</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-400">
              {memories.length} memories · {years.length} years
            </div>
            {hasSeenOnboarding && (
              <button
                onClick={() => { setOnboardingStep('welcome'); setShowOnboarding(true) }}
                className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
              >
                How to import
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <nav className="w-48 shrink-0 hidden md:block">
          <ul className="space-y-1 sticky top-24">
            {navItems.map(item => {
              const Icon = item.icon
              const active = view === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-800 z-50 flex justify-around py-2">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs ${
                  view === item.id ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </div>

        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          {view === 'explorer' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-2xl font-semibold text-white">Any-Day Explorer</h2>
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl p-1.5 border border-slate-700">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="bg-transparent text-slate-200 px-2 py-1.5 rounded-lg focus:outline-none"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1} className="bg-slate-900">{m}</option>
                    ))}
                  </select>
                  <span className="text-slate-600">/</span>
                  <select
                    value={selectedDay}
                    onChange={e => setSelectedDay(Number(e.target.value))}
                    className="bg-transparent text-slate-200 px-2 py-1.5 rounded-lg focus:outline-none"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d} className="bg-slate-900">{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-slate-400">
                {dayMemories.length} memories on {MONTHS[selectedMonth - 1]} {selectedDay} across the years
              </p>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-indigo-500/30 to-transparent" />
                <div className="space-y-4">
                  {dayMemories.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      No memories found for this day in your archive. Try another date.
                    </div>
                  ) : (
                    dayMemories.map(mem => (
                      <MemoryCard key={mem.id} memory={mem} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {view === 'heatmap' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Calendar Heatmap</h2>
              <p className="text-slate-400">Activity density across the year. Click a day to explore.</p>
              <Heatmap
                data={heatmapData}
                onSelect={(month, day) => {
                  setSelectedMonth(month)
                  setSelectedDay(day)
                  setView('explorer')
                }}
              />
            </div>
          )}

          {view === 'search' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Search Everything</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Japan, University, Coffee, Rain, Cat, Dhaka..."
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              {searchQuery && (
                <p className="text-slate-400">{searchResults.length} results</p>
              )}
              <div className="space-y-3">
                {searchResults.map(mem => (
                  <MemoryCard key={mem.id} memory={mem} />
                ))}
              </div>
            </div>
          )}

          {view === 'collections' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Anniversary Collections</h2>
              {!selectedCollection ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {COLLECTIONS.map(col => {
                    const count = memories.filter(col.filter).length
                    return (
                      <button
                        key={col.id}
                        onClick={() => setSelectedCollection(col.id)}
                        className="text-left p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-cyan-500/40 hover:bg-slate-800 transition-all group"
                      >
                        <div className="text-3xl mb-2">{col.emoji}</div>
                        <div className="font-semibold text-slate-100 group-hover:text-cyan-300">{col.name}</div>
                        <div className="text-sm text-slate-500 mt-1">{count} memories</div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedCollection(null)}
                    className="flex items-center gap-1 text-cyan-400 text-sm mb-4 hover:underline"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to collections
                  </button>
                  <h3 className="text-xl font-medium mb-4">
                    {COLLECTIONS.find(c => c.id === selectedCollection)?.emoji}{' '}
                    {COLLECTIONS.find(c => c.id === selectedCollection)?.name}
                  </h3>
                  <div className="space-y-3">
                    {collectionMemories.map(mem => (
                      <MemoryCard key={mem.id} memory={mem} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'compare' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Compare Years</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Month/Day:</span>
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={selectedDay}
                    onChange={e => setSelectedDay(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={compareYearA}
                    onChange={e => setCompareYearA(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <span className="text-slate-500">vs</span>
                  <select
                    value={compareYearB}
                    onChange={e => setCompareYearB(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[compareYearA, compareYearB].map(year => {
                  const mems = memories.filter(
                    m => m.year === year && m.month === selectedMonth && m.day === selectedDay
                  )
                  return (
                    <div key={year} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
                      <h3 className="text-lg font-semibold text-cyan-300 mb-4">{year}</h3>
                      {mems.length === 0 ? (
                        <p className="text-slate-500 text-sm">No memories this day</p>
                      ) : (
                        mems.map(m => <MemoryCard key={m.id} memory={m} compact />)
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {view === 'import' && (
            <ImportPanel
              onMemoriesLoaded={(mems) => {
                setMemories(mems)
                if (mems[0]) {
                  setSelectedMonth(mems[0].month)
                  setSelectedDay(mems[0].day)
                }
                setView('explorer')
              }}
              onExplore={() => setView('explorer')}
              onShowGuide={() => { setOnboardingStep('how'); setShowOnboarding(true) }}
            />
          )}
        </main>
      </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex gap-1.5 px-6 pt-5">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= idx ? 'bg-cyan-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="p-6 space-y-5">
          {step === 'welcome' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Every day has a story</h2>
              <p className="text-slate-400 leading-relaxed">
                Facebook only shows you one memory at a time. TimeCapsule lets you pick any calendar day
                and instantly see every post, photo, and moment from that day across all the years you have.
              </p>
              <p className="text-slate-500 text-sm">
                Everything stays on your device. No Facebook login. No cloud upload of your archive.
              </p>
            </>
          )}

          {step === 'why' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-7 h-7 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Why we need your archive</h2>
              <p className="text-slate-400 leading-relaxed">
                To show you “every August 5 for the last 15 years,” we need the official copy of your
                Facebook history. You download it once from Meta, then drop the ZIP here.
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  We never log into Facebook on your behalf
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  The ZIP never leaves your browser
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  You can delete everything locally at any time
                </li>
              </ul>
            </>
          )}

          {step === 'how' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <Download className="w-7 h-7 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">How to get your data</h2>
              <ol className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="font-mono text-cyan-400 shrink-0">1</span>
                  <span>On a computer, open Facebook → profile picture → <strong>Settings & privacy</strong> → <strong>Settings</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-cyan-400 shrink-0">2</span>
                  <span>Open <strong>Accounts Center</strong> → <strong>Your information and permissions</strong> → <strong>Download / Export your information</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-cyan-400 shrink-0">3</span>
                  <span>Select your profile, date range <strong>All time</strong>, format <strong className="text-amber-300">JSON</strong> (not HTML), media quality High</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-cyan-400 shrink-0">4</span>
                  <span>Create the export. Meta will email you when the ZIP is ready (minutes to a couple of days)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-cyan-400 shrink-0">5</span>
                  <span>Download the ZIP and come back here</span>
                </li>
              </ol>
              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200/90">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span><strong>Critical:</strong> Choose <strong>JSON</strong> format. HTML archives cannot be parsed by TimeCapsule.</span>
              </div>
              <a
                href="https://www.facebook.com/dyi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:underline"
              >
                Open Facebook Download Your Information <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          )}

          {step === 'ready' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">You’re ready to explore</h2>
              <p className="text-slate-400 leading-relaxed">
                Demo memories are already loaded so you can experience the Any-Day Explorer immediately.
                When your real JSON ZIP arrives, bring it to the Import screen — everything stays on your device.
              </p>
              <p className="text-slate-500 text-sm">
                Tip: start with August 5 (or your birthday) to see the multi-year stack in action.
              </p>
            </>
          )}
        </div>

        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <button
            onClick={onSkip}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Skip for now
          </button>
          <div className="flex gap-2">
            {idx > 0 && (
              <button
                onClick={() => setStep(steps[idx - 1])}
                className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            )}
            {idx < steps.length - 1 ? (
              <button
                onClick={() => setStep(steps[idx + 1])}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
              >
                Explore my memories
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MemoryCard({ memory, compact = false }: { memory: Memory; compact?: boolean }) {
  return (
    <div className={`relative pl-12 ${compact ? 'mb-3' : ''}`}>
      {!compact && (
        <div className="absolute left-4 top-3 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 z-10" />
      )}
      <div className={`rounded-xl border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800/80 transition-colors ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-cyan-300">{memory.year}</span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              {TYPE_ICON[memory.type]}
              {memory.type}
            </span>
            {memory.mood && (
              <span className="text-base" title={memory.mood}>{MOOD_EMOJI[memory.mood]}</span>
            )}
          </div>
          {memory.location && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              {memory.location}
            </span>
          )}
        </div>
        {memory.title && (
          <h4 className={`font-medium text-slate-100 mt-1 ${compact ? 'text-sm' : ''}`}>{memory.title}</h4>
        )}
        {memory.text && (
          <p className={`text-slate-400 mt-1 ${compact ? 'text-sm line-clamp-2' : ''}`}>{memory.text}</p>
        )}
        {memory.people && memory.people.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
            <Users className="w-3 h-3" />
            {memory.people.join(', ')}
          </div>
        )}
        {memory.tags && memory.tags.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {memory.tags.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-slate-700/80 text-xs text-slate-400">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
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
    <div className="overflow-x-auto pb-4">
      <div className="inline-block min-w-full">
        <div className="flex gap-1 mb-1 text-xs text-slate-500">
          <div className="w-10" />
          {Array.from({ length: 31 }, (_, i) => (
            <div key={i} className="w-4 text-center">{(i + 1) % 5 === 0 || i === 0 ? i + 1 : ''}</div>
          ))}
        </div>
        {months.map(month => (
          <div key={month} className="flex gap-1 items-center mb-1">
            <div className="w-10 text-xs text-slate-500 text-right pr-1">
              {MONTHS[month - 1].slice(0, 3)}
            </div>
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1
              const daysInMonth = new Date(2024, month, 0).getDate()
              if (day > daysInMonth) {
                return <div key={day} className="w-4 h-4" />
              }
              const key = `${month}-${day}`
              const count = data.get(key) || 0
              const intensity = count === 0 ? 0 : 0.2 + (count / max) * 0.8
              return (
                <button
                  key={day}
                  title={`${MONTHS[month - 1]} ${day}: ${count} memories`}
                  onClick={() => onSelect(month, day)}
                  className="heatmap-cell w-4 h-4 rounded-sm"
                  style={{
                    backgroundColor: count === 0
                      ? '#1e293b'
                      : `rgba(34, 211, 238, ${intensity})`,
                  }}
                />
              )
            })}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
          <span>Less</span>
          {[0, 0.3, 0.5, 0.7, 1].map(v => (
            <div
              key={v}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: v === 0 ? '#1e293b' : `rgba(34, 211, 238, ${v})` }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

export default App
