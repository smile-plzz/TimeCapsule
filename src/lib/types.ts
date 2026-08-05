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
  mediaUrl?: string;
  mood?: Mood;
  tags?: string[];
}

export type ViewMode = 'explorer' | 'heatmap' | 'search' | 'collections' | 'compare' | 'import';
