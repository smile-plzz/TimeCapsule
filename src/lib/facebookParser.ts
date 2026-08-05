/**
 * Facebook archive parser (domain 03 — Import Pipeline)
 *
 * All processing stays in the browser. Soft-fail per file.
 * Media: extracts relative URIs from attachments and resolves them to blob URLs.
 */

import JSZip from 'jszip'
import type { Memory, MemoryType, Mood } from './types'

export type ImportProgress = {
  phase: 'reading' | 'scanning' | 'parsing' | 'media' | 'done' | 'error'
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
    mediaResolved: number
  }
}

type ProgressCb = (p: ImportProgress) => void

const POST_PATH_HINTS = ['posts', 'your_posts', 'post', 'activity_and_posts']

function isLikelyPostsJson(path: string): boolean {
  const lower = path.toLowerCase().replace(/\\/g, '/')
  if (!lower.endsWith('.json')) return false
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
  return { date: `${year}-${pad(month)}-${pad(day)}`, year, month, day }
}

function guessType(entry: Record<string, unknown>, hasMedia: boolean): MemoryType {
  if (hasMedia) {
    const raw = JSON.stringify(entry).toLowerCase()
    if (raw.includes('video')) return 'video'
    return 'photo'
  }
  const raw = JSON.stringify(entry).toLowerCase()
  if (raw.includes('photo') || raw.includes('image') || entry.photos) return 'photo'
  if (raw.includes('video')) return 'video'
  if (raw.includes('check') || raw.includes('place') || entry.place) return 'checkin'
  if (raw.includes('life_event') || raw.includes('life event')) return 'life_event'
  return 'status'
}

function extractText(entry: Record<string, unknown>): string | undefined {
  const candidates = [entry.data, entry.title, entry.post, entry.label, entry.name]
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

function extractMediaUris(entry: Record<string, unknown>): string[] {
  const uris: string[] = []
  const push = (u: unknown) => {
    if (typeof u === 'string' && u.trim() && !u.startsWith('http')) {
      uris.push(u.replace(/^\/+/, ''))
    }
  }
  const walk = (node: unknown, depth = 0) => {
    if (depth > 8 || node == null) return
    if (Array.isArray(node)) {
      for (const item of node) walk(item, depth + 1)
      return
    }
    if (typeof node !== 'object') return
    const o = node as Record<string, unknown>
    if (o.uri != null) push(o.uri)
    if (o.media && typeof o.media === 'object') {
      const m = o.media as Record<string, unknown>
      if (m.uri != null) push(m.uri)
    }
    for (const key of ['attachments', 'data', 'media', 'photos', 'photo', 'videos', 'video']) {
      if (o[key] != null) walk(o[key], depth + 1)
    }
  }
  walk(entry)
  return [...new Set(uris)]
}

function extractPeople(entry: Record<string, unknown>): string[] | undefined {
  const names: string[] = []
  const tags = entry.tags as unknown
  if (Array.isArray(tags)) {
    for (const t of tags) {
      if (t && typeof t === 'object') {
        const o = t as Record<string, unknown>
        if (typeof o.name === 'string') names.push(o.name)
      }
    }
  }
  const data = entry.data
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>
        if (Array.isArray(o.tags)) {
          for (const t of o.tags) {
            if (t && typeof t === 'object' && typeof (t as { name?: string }).name === 'string') {
              names.push((t as { name: string }).name)
            }
          }
        }
      }
    }
  }
  return names.length ? [...new Set(names)] : undefined
}

function entryToMemory(entry: Record<string, unknown>, idPrefix: string, index: number): Memory | null {
  const ts =
    (entry.timestamp as number | string | undefined) ??
    (entry.update_timestamp as number | string | undefined) ??
    (entry.creation_timestamp as number | string | undefined)
  const parts = timestampToParts(ts)
  if (!parts) return null
  const mediaUris = extractMediaUris(entry)
  const text = extractText(entry)
  const title = extractTitle(entry)
  if (!text && !title && mediaUris.length === 0) {
    if (guessType(entry, false) === 'status') return null
  }
  const mem: Memory = {
    id: `${idPrefix}-${index}`,
    date: parts.date,
    year: parts.year,
    month: parts.month,
    day: parts.day,
    type: guessType(entry, mediaUris.length > 0),
    title,
    text,
    location: extractLocation(entry),
    people: extractPeople(entry),
    mediaUrl: mediaUris[0],
    mediaUrls: mediaUris.length ? [...mediaUris] : undefined,
    tags: [],
    mood: 'neutral' as Mood,
  }
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
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (Array.isArray(val) && val.length && typeof val[0] === 'object') {
        return val as Record<string, unknown>[]
      }
    }
  }
  return []
}

function findZipFile(zip: JSZip, relativePath: string): JSZip.JSZipObject | null {
  const target = relativePath.replace(/\\/g, '/').replace(/^\/+/, '').toLowerCase()
  const keys = Object.keys(zip.files)
  for (const k of keys) {
    const norm = k.replace(/\\/g, '/').replace(/^\/+/, '').toLowerCase()
    if (norm === target || norm.endsWith('/' + target) || norm.endsWith(target)) {
      if (!zip.files[k].dir) return zip.files[k]
    }
  }
  const base = target.split('/').pop()
  if (base) {
    for (const k of keys) {
      const norm = k.replace(/\\/g, '/').toLowerCase()
      if (norm.endsWith('/' + base) && !zip.files[k].dir) return zip.files[k]
    }
  }
  return null
}

function mimeFromPath(path: string): string {
  const lower = path.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.mp4')) return 'video/mp4'
  if (lower.endsWith('.mov')) return 'video/quicktime'
  return 'image/jpeg'
}

async function resolveOne(
  zip: JSZip,
  rel: string,
  cache: Map<string, string>,
): Promise<string | null> {
  if (rel.startsWith('blob:') || rel.startsWith('http') || rel.startsWith('data:')) return rel
  if (cache.has(rel)) return cache.get(rel)!
  const entry = findZipFile(zip, rel)
  if (!entry) return null
  try {
    const buf = await entry.async('arraybuffer')
    const blob = new Blob([buf], { type: mimeFromPath(rel) })
    const url = URL.createObjectURL(blob)
    cache.set(rel, url)
    return url
  } catch {
    return null
  }
}

async function resolveMediaBlobs(
  zip: JSZip,
  memories: Memory[],
  onProgress?: ProgressCb,
): Promise<number> {
  let resolved = 0
  const cache = new Map<string, string>()
  for (let i = 0; i < memories.length; i++) {
    const m = memories[i]
    const candidates = m.mediaUrls?.length ? m.mediaUrls : m.mediaUrl ? [m.mediaUrl] : []
    if (!candidates.length) continue
    const resolvedList: string[] = []
    for (const rel of candidates) {
      const url = await resolveOne(zip, rel, cache)
      if (url) {
        resolvedList.push(url)
        resolved++
      }
    }
    if (resolvedList.length) {
      m.mediaUrls = resolvedList
      m.mediaUrl = resolvedList[0]
    }
    if (i % 20 === 0) {
      onProgress?.({
        phase: 'media',
        message: `Resolving media… ${resolved} files`,
        filesSeen: memories.length,
        memoriesFound: memories.length,
      })
    }
  }
  return resolved
}

export async function parseFacebookZip(file: File, onProgress?: ProgressCb): Promise<ImportResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const memories: Memory[] = []
  let filesScanned = 0
  let jsonFiles = 0
  let postsParsed = 0
  let mediaResolved = 0

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
        stats: { filesScanned: 0, jsonFiles: 0, postsParsed: 0, mediaResolved: 0 },
      }
    }

    const jsonPaths = Object.keys(zip.files).filter(
      p => !zip.files[p].dir && p.toLowerCase().endsWith('.json'),
    )

    report({ phase: 'scanning', message: `Found ${jsonPaths.length} JSON files`, filesSeen: jsonPaths.length })

    for (const path of jsonPaths) {
      filesScanned++
      const lower = path.toLowerCase()
      const interesting =
        isLikelyPostsJson(path) ||
        lower.includes('profile_information') ||
        lower.includes('your_post') ||
        lower.includes('album') ||
        lower.includes('photos_and_videos')
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
        errors.push(`Skipped ${path}: ${e instanceof Error ? e.message : 'unknown error'}`)
      }
    }

    const seen = new Set<string>()
    const unique: Memory[] = []
    for (const m of memories) {
      const key = `${m.date}|${m.title ?? ''}|${m.text ?? ''}|${m.mediaUrl ?? ''}`
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(m)
    }

    report({ phase: 'media', message: 'Resolving photos from archive…', memoriesFound: unique.length })
    mediaResolved = await resolveMediaBlobs(zip, unique, onProgress)

    if (unique.length === 0) {
      warnings.push(
        'No posts were found in this ZIP. Make sure you requested Posts (and Photos) in JSON format with a wide date range.',
      )
    } else if (mediaResolved === 0 && unique.some(m => m.mediaUrl && !m.mediaUrl.startsWith('blob:'))) {
      warnings.push(
        'Some media paths could not be resolved inside the ZIP. Photos may show as placeholders.',
      )
    }

    report({
      phase: 'done',
      message: `Imported ${unique.length} memories (${mediaResolved} with photos)`,
      memoriesFound: unique.length,
    })

    return {
      ok: unique.length > 0,
      memories: unique.sort((a, b) => b.date.localeCompare(a.date)),
      errors,
      warnings,
      stats: { filesScanned, jsonFiles, postsParsed, mediaResolved },
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to read ZIP'
    return {
      ok: false,
      memories: [],
      errors: [msg],
      warnings: [],
      stats: { filesScanned, jsonFiles, postsParsed, mediaResolved },
    }
  }
}
