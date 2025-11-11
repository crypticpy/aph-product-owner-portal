// Type definitions for the Product Owner Portal

export type ExperienceLevel = 'new' | 'experienced' | 'somewhat';
export type GovernanceTier = 'tier1-2' | 'tier3-4' | 'not-sure';
export type TimeCommitment = 'less-than-1' | '1-to-3' | 'more-than-3';
export type LearningPath = 'express' | 'standard' | 'comprehensive';

export interface UserProfile {
  experienceLevel: ExperienceLevel;
  governanceTier: GovernanceTier;
  timeCommitment: TimeCommitment;
  learningPath: LearningPath;
  completedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'day1' | 'week1' | 'week2' | 'week3-4' | 'resources';
  priority: 'high' | 'medium' | 'low';
  content: string;
  learningPaths: LearningPath[];
  checkQuestion?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export interface UserProgress {
  completedModules: string[];
  bookmarkedModules: string[];
  currentModule: string | null;
  lastVisited: string;
  totalTimeSpent: number; // in minutes
}
