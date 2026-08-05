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
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-semibold text-white">Import Your Archive</h2>

      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center">
          <Upload className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white mb-2">Facebook Data Download</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Request your archive from Meta in <strong className="text-amber-300">JSON</strong> format,
            then drop the ZIP here. All processing stays on your device.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          Select Facebook ZIP
          <input type="file" accept=".zip,application/zip" className="hidden" onChange={handleFile} />
        </label>

        <div className="pt-4 border-t border-slate-700 space-y-3">
          <p className="text-slate-500 text-sm">Demo data is available if you want to explore first</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onExplore}
              className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
            >
              Go to Any-Day Explorer
            </button>
            <button
              onClick={onShowGuide}
              className="px-5 py-2.5 rounded-xl border border-cyan-600/50 text-cyan-300 hover:bg-cyan-500/10 transition-colors text-sm"
            >
              Show export steps again
            </button>
          </div>
        </div>
      </div>

      {progress && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-sm text-slate-300">
          <p className="font-medium text-cyan-300">{progress.message}</p>
          <p className="text-slate-500 text-xs mt-1">
            Files seen: {progress.filesSeen} · Memories: {progress.memoriesFound} · Phase: {progress.phase}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-200/90 space-y-2">
        <p>
          <strong>Privacy first:</strong> All processing happens in your browser. No data leaves your device.
          No Facebook login required.
        </p>
        <p className="text-amber-200/70 text-xs">
          JSON Facebook archives are supported. HTML exports are rejected with guidance to re-request JSON.
        </p>
      </div>
    </div>
  )
}
