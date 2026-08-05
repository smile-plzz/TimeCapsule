import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import type { Memory } from '../lib/types'

type Props = {
  memory: Memory
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

function isVideo(url: string): boolean {
  const lower = url.toLowerCase().split('?')[0]
  return lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.webm') || lower.includes('video/')
}

export function MediaViewer({ memory, index, onClose, onIndexChange }: Props) {
  const urls = memory.mediaUrls?.length
    ? memory.mediaUrls
    : memory.mediaUrl
      ? [memory.mediaUrl]
      : []
  const safeIndex = Math.max(0, Math.min(index, urls.length - 1))
  const current = urls[safeIndex]
  const hasMany = urls.length > 1

  const goPrev = useCallback(() => {
    if (!hasMany) return
    onIndexChange((safeIndex - 1 + urls.length) % urls.length)
  }, [hasMany, onIndexChange, safeIndex, urls.length])

  const goNext = useCallback(() => {
    if (!hasMany) return
    onIndexChange((safeIndex + 1) % urls.length)
  }, [hasMany, onIndexChange, safeIndex, urls.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, goPrev, goNext])

  if (!current) return null

  const caption =
    memory.title || memory.text || `${memory.year}-${String(memory.month).padStart(2, '0')}-${String(memory.day).padStart(2, '0')}`

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06] shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-100 truncate">{caption}</p>
          <p className="text-[11px] text-zinc-500 tabular-nums">
            {memory.year}
            {memory.location ? ` · ${memory.location}` : ''}
            {hasMany ? ` · ${safeIndex + 1} / ${urls.length}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!current.startsWith('blob:') && (
            <a
              href={current}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 transition-colors"
              title="Open original"
              onClick={e => e.stopPropagation()}
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center min-h-0 p-4 sm:p-8"
        onClick={e => e.stopPropagation()}
      >
        {hasMany && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 sm:left-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 border border-white/10 text-zinc-200 hover:bg-black/70 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {isVideo(current) ? (
          <video
            key={current}
            src={current}
            controls
            autoPlay
            className="max-h-full max-w-full rounded-lg shadow-2xl"
          />
        ) : (
          <img
            key={current}
            src={current}
            alt={caption}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl select-none"
            draggable={false}
          />
        )}

        {hasMany && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 sm:right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 border border-white/10 text-zinc-200 hover:bg-black/70 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {hasMany && (
        <div
          className="shrink-0 border-t border-white/[0.06] px-4 py-3 overflow-x-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex gap-2 justify-center min-w-min mx-auto">
            {urls.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => onIndexChange(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border transition-all ${
                  i === safeIndex
                    ? 'border-cyan-400/80 ring-1 ring-cyan-400/40'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                {isVideo(url) ? (
                  <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                    VID
                  </div>
                ) : (
                  <img src={url} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
