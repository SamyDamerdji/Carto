'use server';
import { promises as fs } from 'fs';
import path from 'path';
import type { LessonStepOutput } from '@/ai/schemas/lesson-schemas';

// Path to the JSON file that acts as our simple database
const cacheFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessons-cache.json');

// Type for the cache structure
type LessonCache = {
  [cardId: string]: LessonStepOutput;
};

// Function to read the entire cache from the file
async function readCache(): Promise<LessonCache> {
  try {
    // Check if the file exists
    await fs.access(cacheFilePath);
    const fileContent = await fs.readFile(cacheFilePath, 'utf-8');
    // If the file is empty or just whitespace, return an empty object
    if (!fileContent.trim()) {
      return {};
    }
    return JSON.parse(fileContent);
  } catch (error) {
    // If the file doesn't exist or there's a parsing error, return an empty cache
    return {};
  }
}

// Function to write the entire cache to the file
async function writeCache(cache: LessonCache): Promise<void> {
  try {
    await fs.writeFile(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to write to lesson cache:", error);
  }
}

/**
 * Retrieves a cached lesson step from our JSON "database".
 * @param cardId The ID of the card for which to retrieve the lesson.
 * @returns The cached lesson data, or null if not found.
 */
export async function getCachedLesson(cardId: string): Promise<LessonStepOutput | null> {
  const cache = await readCache();
  return cache[cardId] || null;
}

/**
 * Saves a newly generated lesson step to our JSON "database".
 * @param cardId The ID of the card to associate with the lesson data.
 * @param lessonData The lesson data to cache.
 */
export async function cacheLesson(cardId: string, lessonData: LessonStepOutput): Promise<void> {
  const cache = await readCache();
  cache[cardId] = lessonData;
  await writeCache(cache);
}
