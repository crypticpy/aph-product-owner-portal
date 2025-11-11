import { UserProfile, UserProgress } from '../types';

const USER_PROFILE_KEY = 'aph_user_profile';
const USER_PROGRESS_KEY = 'aph_user_progress';

// User Profile Storage
export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

export function getUserProfile(): UserProfile | null {
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error('Error clearing user profile:', error);
  }
}

// User Progress Storage
export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

export function getUserProgress(): UserProgress | null {
  try {
    const data = localStorage.getItem(USER_PROGRESS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user progress:', error);
    return null;
  }
}

export function clearUserProgress(): void {
  try {
    localStorage.removeItem(USER_PROGRESS_KEY);
  } catch (error) {
    console.error('Error clearing user progress:', error);
  }
}

// Initialize progress if it doesn't exist
export function initializeUserProgress(): UserProgress {
  return {
    completedModules: [],
    bookmarkedModules: [],
    currentModule: null,
    lastVisited: new Date().toISOString(),
    totalTimeSpent: 0
  };
}

// Update specific progress fields
export function updateCompletedModule(moduleId: string): void {
  const progress = getUserProgress() || initializeUserProgress();

  if (!progress.completedModules.includes(moduleId)) {
    progress.completedModules.push(moduleId);
    progress.lastVisited = new Date().toISOString();
    saveUserProgress(progress);
  }
}

export function toggleBookmark(moduleId: string): void {
  const progress = getUserProgress() || initializeUserProgress();

  if (progress.bookmarkedModules.includes(moduleId)) {
    progress.bookmarkedModules = progress.bookmarkedModules.filter(id => id !== moduleId);
  } else {
    progress.bookmarkedModules.push(moduleId);
  }

  progress.lastVisited = new Date().toISOString();
  saveUserProgress(progress);
}

export function updateCurrentModule(moduleId: string | null): void {
  const progress = getUserProgress() || initializeUserProgress();
  progress.currentModule = moduleId;
  progress.lastVisited = new Date().toISOString();
  saveUserProgress(progress);
}

export function clearAllData(): void {
  clearUserProfile();
  clearUserProgress();
}
