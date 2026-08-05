import { useState, type ChangeEvent } from 'react'
import { Upload } from 'lucide-react'
import { parseFacebookZip, type ImportProgress } from '../lib/facebookParser'
import type { Memory } from '../lib/types'

type Props = {
  onMemoriesLoaded: (memories: Memory[]) => void
  onExplore: () => void
  onShowGuide: () => void
}

export function ImportPanel({ onMemoriesLoaded, onExplore, onShowGuide }: Props) {
  const [progress, setProgress] = useState<ImportProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setProgress({ phase: 'reading', message: 'Reading ZIP…', filesSeen: 0, memoriesFound: 0 })
    try {
      const result = await parseFacebookZip(file, setProgress)
      if (result.ok && result.memories.length > 0) {
        onMemoriesLoaded(result.memories)
        const mediaN = result.stats.mediaResolved ?? 0
        setProgress({
          phase: 'done',
          message:
            mediaN > 0
              ? `Loaded ${result.memories.length} memories (${mediaN} with photos)`
              : `Loaded ${result.memories.length} memories from your archive`,
          filesSeen: result.stats.filesScanned,
          memoriesFound: result.memories.length,
        })
        if (result.warnings.length) {
          console.info('Import warnings:', result.warnings)
        }
      } else {
        setError(result.errors[0] || result.warnings[0] || 'No memories found in this archive.')
        setProgress(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
      setProgress(null)
    }
    e.target.value = ''
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Import</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Facebook JSON archive. All processing stays on your device.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-6 text-center space-y-5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15">
          <Upload className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-zinc-100">Facebook data download</h3>
          <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
            Request your archive from Meta in <strong className="text-amber-300/90">JSON</strong>{' '}
            format, then select the ZIP here.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-sm font-medium text-white cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          Select ZIP
          <input type="file" accept=".zip,application/zip" className="hidden" onChange={handleFile} />
        </label>

        <div className="pt-4 border-t border-white/[0.05] space-y-2.5">
          <p className="text-[11px] text-zinc-600">Or explore with demo data first</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={onExplore}
              className="rounded-lg border border-white/[0.08] px-3.5 py-2 text-xs text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200 transition-colors"
            >
              Any-Day Explorer
            </button>
            <button
              type="button"
              onClick={onShowGuide}
              className="rounded-lg border border-cyan-500/20 px-3.5 py-2 text-xs text-cyan-400/90 hover:bg-cyan-500/5 transition-colors"
            >
              Export steps
            </button>
          </div>
        </div>
      </div>

      {progress && (
        <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 px-4 py-3 text-sm">
          <p className="font-medium text-cyan-300/90">{progress.message}</p>
          <p className="text-[11px] text-zinc-600 mt-1 tabular-nums">
            Files {progress.filesSeen} · Memories {progress.memoriesFound} · {progress.phase}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200/90">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/70 space-y-1">
        <p>
          <strong className="text-amber-200/90">Privacy first.</strong> Processing runs in your
          browser. No Facebook login. No server receives your archive.
        </p>
      </div>
    </div>
  )
}
