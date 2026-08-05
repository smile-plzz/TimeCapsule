export type MemoryType = 'status' | 'photo' | 'video' | 'checkin' | 'event' | 'life_event' | 'other';

export type Mood = 'happy' | 'sad' | 'excited' | 'quiet' | 'celebration' | 'neutral';

export interface Memory {
  id: string;
  date: string;
  year: number;
  month: number;
  day: number;
  type: MemoryType;
  title?: string;
  text?: string;
  location?: string;
  people?: string[];
  /** Primary media URL (first item of mediaUrls). */
  mediaUrl?: string;
  /** All resolved media URLs for this memory (photos/videos). */
  mediaUrls?: string[];
  mood?: Mood;
  tags?: string[];
}

export type ViewMode = 'explorer' | 'heatmap' | 'search' | 'collections' | 'compare' | 'import';

/** Open media viewer at a specific memory + index within its gallery. */
export type MediaViewerState = {
  memoryId: string;
  index: number;
} | null;
