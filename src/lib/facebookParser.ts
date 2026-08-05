/**
 * Facebook archive parser (domain 03 — Import Pipeline)
 *
 * Hard constraints from CLAUDE.md / PRODUCT.md:
 * - All processing stays in the browser
 * - Soft-fail per file; never abort the whole import on one bad JSON
 * - Idempotent: calling again replaces the in-memory set cleanly
 *
 * Supported: Meta "Download Your Information" JSON ZIPs (posts, photos metadata).
 * HTML exports are rejected with a clear error.
 */

import JSZip from 'jszip'
import type { Memory, MemoryType, Mood } from './types'

export type ImportProgress = {
  phase: 'reading' | 'scanning' | 'parsing' | 'done' | 'error'
  message: string
  filesSeen: number
  memoriesFound: number
}

export type ImportResult = {
  ok: boolean
  memories: Memory[]
  errors: string[]
  warnings: string[]
  stats: {
    filesScanned: number
    jsonFiles: number
    postsParsed: number
  }
}

type ProgressCb = (p: ImportProgress) => void

const POST_PATH_HINTS = [
  'posts',
  'your_posts',
  'post',
  'activity_and_posts',
]

function isLikelyPostsJson(path: string): boolean {
  const lower = path.toLowerCase().replace(/\\/g, '/')
  if (!lower.endsWith('.json')) return false
  // Skip obvious non-post dumps
  if (lower.includes('message') && lower.includes('inbox')) return false
  if (lower.includes('friends') || lower.includes('ads_information')) return false
  return POST_PATH_HINTS.some(h => lower.includes(h)) || lower.includes('/posts/')
}

function isHtmlExport(zip: JSZip): boolean {
  const names = Object.keys(zip.files)
  const hasHtmlIndex =
    names.some(n => /start_here\.html$/i.test(n)) ||
    names.some(n => /index\.html$/i.test(n) && n.toLowerCase().includes('posts'))
  const hasJsonPosts = names.some(n => isLikelyPostsJson(n))
  return hasHtmlIndex && !hasJsonPosts
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function timestampToParts(ts: number | string | undefined): {
  date: string
  year: number
  month: number
  day: number
} | null {
  if (ts == null) return null
  let ms: number
  if (typeof ts === 'number') {
    // Facebook often uses seconds
    ms = ts < 1e12 ? ts * 1000 : ts
  } else if (typeof ts === 'string') {
    const parsed = Date.parse(ts)
    if (Number.isNaN(parsed)) return null
    ms = parsed
  } else {
    return null
  }
  const d = new Date(ms)
  if (Number.isNaN(d.getTime())) return null
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return {
    date: `${year}-${pad(month)}-${pad(day)}`,
    year,
    month,
    day,
  }
}

function guessType(entry: Record<string, unknown>): MemoryType {
  const raw = JSON.stringify(entry).toLowerCase()
  if (raw.includes('photo') || raw.includes('image') || entry.photos) return 'photo'
  if (raw.includes('video')) return 'video'
  if (raw.includes('check') || raw.includes('place') || entry.place) return 'checkin'
  if (raw.includes('life_event') || raw.includes('life event')) return 'life_event'
  return 'status'
}

function extractText(entry: Record<string, unknown>): string | undefined {
  const candidates = [
    entry.data,
    entry.title,
    entry.post,
    entry.label,
    entry.name,
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim()
    if (Array.isArray(c)) {
      for (const item of c) {
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>
          if (typeof o.post === 'string' && o.post.trim()) return o.post.trim()
          if (typeof o.text === 'string' && o.text.trim()) return o.text.trim()
        }
        if (typeof item === 'string' && item.trim()) return item.trim()
      }
    }
  }
  if (typeof entry.update_timestamp === 'undefined' && typeof entry.timestamp === 'undefined') {
    return undefined
  }
  return undefined
}

function extractTitle(entry: Record<string, unknown>): string | undefined {
  if (typeof entry.title === 'string' && entry.title.trim()) return entry.title.trim()
  return undefined
}

function extractLocation(entry: Record<string, unknown>): string | undefined {
  const place = entry.place as Record<string, unknown> | undefined
  if (place && typeof place.name === 'string') return place.name
  if (typeof entry.location === 'string') return entry.location
  return undefined
}

function entryToMemory(entry: Record<string, unknown>, idPrefix: string, index: number): Memory | null {
  const ts =
    (entry.timestamp as number | string | undefined) ??
    (entry.update_timestamp as number | string | undefined) ??
    (entry.creation_timestamp as number | string | undefined)

  const parts = timestampToParts(ts)
  if (!parts) return null

  const text = extractText(entry)
  const title = extractTitle(entry)
  if (!text && !title) {
    // Keep check-ins / media-only items if we have a type signal
    const t = guessType(entry)
    if (t === 'status') return null
  }

  const mem: Memory = {
    id: `${idPrefix}-${index}`,
    date: parts.date,
    year: parts.year,
    month: parts.month,
    day: parts.day,
    type: guessType(entry),
    title,
    text,
    location: extractLocation(entry),
    tags: [],
    mood: 'neutral' as Mood,
  }

  // Light tag extraction from text
  const blob = `${title ?? ''} ${text ?? ''}`.toLowerCase()
  if (blob.includes('birthday')) mem.tags!.push('birthday')
  if (blob.includes('eid')) mem.tags!.push('eid')
  if (blob.includes('new year')) mem.tags!.push('newyear')
  if (blob.includes('travel') || blob.includes('trip')) mem.tags!.push('travel')
  if (blob.includes('university') || blob.includes('campus')) mem.tags!.push('university')

  return mem
}

function collectEntries(data: unknown): Record<string, unknown>[] {
  if (!data) return []
  if (Array.isArray(data)) {
    return data.filter(x => x && typeof x === 'object') as Record<string, unknown>[]
  }
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>
    // Common wrappers: { posts: [...] }, { status_updates: [...] }, etc.
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (Array.isArray(val) && val.length && typeof val[0] === 'object') {
        return val as Record<string, unknown>[]
      }
    }
  }
  return []
}

export async function parseFacebookZip(
  file: File,
  onProgress?: ProgressCb,
): Promise<ImportResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const memories: Memory[] = []
  let filesScanned = 0
  let jsonFiles = 0
  let postsParsed = 0

  const report = (partial: Partial<ImportProgress>) => {
    onProgress?.({
      phase: 'scanning',
      message: '',
      filesSeen: filesScanned,
      memoriesFound: memories.length,
      ...partial,
    })
  }

  try {
    report({ phase: 'reading', message: 'Reading ZIP…' })
    const zip = await JSZip.loadAsync(file)

    if (isHtmlExport(zip)) {
      return {
        ok: false,
        memories: [],
        errors: [
          'This looks like an HTML Facebook export. TimeCapsule needs the JSON format. Request a new download and choose JSON (not HTML).',
        ],
        warnings: [],
        stats: { filesScanned: 0, jsonFiles: 0, postsParsed: 0 },
      }
    }

    const jsonPaths = Object.keys(zip.files).filter(
      p => !zip.files[p].dir && p.toLowerCase().endsWith('.json'),
    )

    report({ phase: 'scanning', message: `Found ${jsonPaths.length} JSON files`, filesSeen: jsonPaths.length })

    for (const path of jsonPaths) {
      filesScanned++
      const lower = path.toLowerCase()

      // Prefer post-like files; still try a few other activity files
      const interesting =
        isLikelyPostsJson(path) ||
        lower.includes('profile_information') ||
        lower.includes('your_post')

      if (!interesting && !lower.includes('posts')) continue

      try {
        const raw = await zip.files[path].async('string')
        let data: unknown
        try {
          data = JSON.parse(raw)
        } catch {
          errors.push(`Could not parse JSON: ${path}`)
          continue
        }
        jsonFiles++

        const entries = collectEntries(data)
        let localIndex = 0
        for (const entry of entries) {
          const mem = entryToMemory(entry, path.replace(/[^a-zA-Z0-9]/g, '_').slice(-40), localIndex++)
          if (mem) {
            memories.push(mem)
            postsParsed++
          }
        }

        report({
          phase: 'parsing',
          message: `Parsed ${path.split('/').pop()}`,
          filesSeen: filesScanned,
          memoriesFound: memories.length,
        })
      } catch (e) {
        // Soft-fail per file (I-ERR)
        errors.push(`Skipped ${path}: ${e instanceof Error ? e.message : 'unknown error'}`)
      }
    }

    // Deduplicate by date+text+title
    const seen = new Set<string>()
    const unique: Memory[] = []
    for (const m of memories) {
      const key = `${m.date}|${m.title ?? ''}|${m.text ?? ''}`
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(m)
    }

    if (unique.length === 0) {
      warnings.push(
        'No posts were found in this ZIP. Make sure you requested Posts (and Photos) in JSON format with a wide date range.',
      )
    }

    report({ phase: 'done', message: `Imported ${unique.length} memories`, memoriesFound: unique.length })

    return {
      ok: unique.length > 0,
      memories: unique.sort((a, b) => b.date.localeCompare(a.date)),
      errors,
      warnings,
      stats: { filesScanned, jsonFiles, postsParsed },
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to read ZIP'
    return {
      ok: false,
      memories: [],
      errors: [msg],
      warnings: [],
      stats: { filesScanned, jsonFiles, postsParsed },
    }
  }
}
