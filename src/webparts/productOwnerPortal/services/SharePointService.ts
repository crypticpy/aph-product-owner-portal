import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { UserProfile, UserProgress } from '../types';

/**
 * SharePoint REST API Service for APH Product Owner Portal
 * Replaces localStorage with SharePoint Lists integration
 */
export class SharePointService {
  private context: WebPartContext;
  private siteUrl: string;
  private userEmail: string;

  constructor(context: WebPartContext) {
    this.context = context;
    this.siteUrl = context.pageContext.web.absoluteUrl;
    this.userEmail = context.pageContext.user.email;
  }

  /**
   * Initialize empty user progress object
   */
  public initializeUserProgress(): UserProgress {
    return {
      completedModules: [],
      bookmarkedModules: [],
      currentModule: null,
      lastVisited: new Date().toISOString(),
      totalTimeSpent: 0
    };
  }

  /**
   * Get user profile from SharePoint "User Profiles" list
   */
  public async getUserProfile(): Promise<UserProfile | null> {
    try {
      const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Profiles')/items?$filter=Title eq '${encodeURIComponent(this.userEmail)}'`;

      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        endpoint,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        console.error('Failed to fetch user profile:', response.statusText);
        return null;
      }

      const data = await response.json();

      if (data.value && data.value.length > 0) {
        const item = data.value[0];
        return {
          experienceLevel: item.ExperienceLevel,
          governanceTier: item.GovernanceTier,
          timeCommitment: item.TimeCommitment,
          learningPath: item.LearningPath,
          completedAt: item.CompletedAt
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Save user profile to SharePoint "User Profiles" list
   */
  public async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      // Check if profile exists
      const existingItemId = await this.getListItemId('User Profiles');

      const body = JSON.stringify({
        Title: this.userEmail,
        ExperienceLevel: profile.experienceLevel,
        GovernanceTier: profile.governanceTier,
        TimeCommitment: profile.timeCommitment,
        LearningPath: profile.learningPath,
        CompletedAt: profile.completedAt || new Date().toISOString()
      });

      if (existingItemId) {
        // Update existing item
        const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Profiles')/items(${existingItemId})`;

        await this.context.spHttpClient.post(
          endpoint,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-type': 'application/json;odata=nometadata',
              'IF-MATCH': '*',
              'X-HTTP-Method': 'MERGE'
            },
            body
          }
        );
      } else {
        // Create new item
        const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Profiles')/items`;

        await this.context.spHttpClient.post(
          endpoint,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-type': 'application/json;odata=nometadata'
            },
            body
          }
        );
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  /**
   * Clear user profile from SharePoint
   */
  public async clearUserProfile(): Promise<void> {
    try {
      const itemId = await this.getListItemId('User Profiles');

      if (itemId) {
        const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Profiles')/items(${itemId})`;

        await this.context.spHttpClient.post(
          endpoint,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'IF-MATCH': '*',
              'X-HTTP-Method': 'DELETE'
            }
          }
        );
      }
    } catch (error) {
      console.error('Error clearing user profile:', error);
      throw error;
    }
  }

  /**
   * Get user progress from SharePoint "User Progress" list
   */
  public async getUserProgress(): Promise<UserProgress> {
    try {
      const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Progress')/items?$filter=Title eq '${encodeURIComponent(this.userEmail)}'`;

      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        endpoint,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        console.error('Failed to fetch user progress:', response.statusText);
        return this.initializeUserProgress();
      }

      const data = await response.json();

      if (data.value && data.value.length > 0) {
        const item = data.value[0];
        return {
          completedModules: item.CompletedModules ? JSON.parse(item.CompletedModules) : [],
          bookmarkedModules: item.BookmarkedModules ? JSON.parse(item.BookmarkedModules) : [],
          currentModule: item.CurrentModule || null,
          lastVisited: item.LastVisited || new Date().toISOString(),
          totalTimeSpent: item.TotalTimeSpent || 0
        };
      }

      return this.initializeUserProgress();
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return this.initializeUserProgress();
    }
  }

  /**
   * Save user progress to SharePoint "User Progress" list
   */
  public async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      const existingItemId = await this.getListItemId('User Progress');

      const body = JSON.stringify({
        Title: this.userEmail,
        CompletedModules: JSON.stringify(progress.completedModules),
        BookmarkedModules: JSON.stringify(progress.bookmarkedModules),
        CurrentModule: progress.currentModule,
        LastVisited: progress.lastVisited || new Date().toISOString(),
        TotalTimeSpent: progress.totalTimeSpent || 0
      });

      if (existingItemId) {
        // Update existing item
        const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Progress')/items(${existingItemId})`;

        await this.context.spHttpClient.post(
          endpoint,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-type': 'application/json;odata=nometadata',
              'IF-MATCH': '*',
              'X-HTTP-Method': 'MERGE'
            },
            body
          }
        );
      } else {
        // Create new item
        const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Progress')/items`;

        await this.context.spHttpClient.post(
          endpoint,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-type': 'application/json;odata=nometadata'
            },
            body
          }
        );
      }
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  /**
   * Update completed modules list
   */
  public async updateCompletedModule(moduleId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();

      if (!progress.completedModules.includes(moduleId)) {
        progress.completedModules.push(moduleId);
        progress.lastVisited = new Date().toISOString();
        await this.saveUserProgress(progress);
      }
    } catch (error) {
      console.error('Error updating completed module:', error);
      throw error;
    }
  }

  /**
   * Toggle bookmark for a module
   */
  public async toggleBookmark(moduleId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();

      const index = progress.bookmarkedModules.indexOf(moduleId);
      if (index > -1) {
        progress.bookmarkedModules.splice(index, 1);
      } else {
        progress.bookmarkedModules.push(moduleId);
      }

      progress.lastVisited = new Date().toISOString();
      await this.saveUserProgress(progress);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }

  /**
   * Update current module ID
   */
  public async updateCurrentModule(moduleId: string | null): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      progress.currentModule = moduleId;
      progress.lastVisited = new Date().toISOString();
      await this.saveUserProgress(progress);
    } catch (error) {
      console.error('Error updating current module:', error);
      throw error;
    }
  }

  /**
   * Clear all user data (profile and progress)
   */
  public async clearAllData(): Promise<void> {
    try {
      await this.clearUserProfile();
      await this.clearUserProgress();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  /**
   * Clear user progress from SharePoint
   */
  private async clearUserProgress(): Promise<void> {
    try {
      const itemId = await this.getListItemId('User Progress');

      if (itemId) {
        const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('User Progress')/items(${itemId})`;

        await this.context.spHttpClient.post(
          endpoint,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'IF-MATCH': '*',
              'X-HTTP-Method': 'DELETE'
            }
          }
        );
      }
    } catch (error) {
      console.error('Error clearing user progress:', error);
      throw error;
    }
  }

  /**
   * Helper method to get SharePoint list item ID for current user
   */
  private async getListItemId(listTitle: string): Promise<number | null> {
    try {
      const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${listTitle}')/items?$filter=Title eq '${encodeURIComponent(this.userEmail)}'&$select=Id`;

      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        endpoint,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.value && data.value.length > 0) {
        return data.value[0].Id;
      }

      return null;
    } catch (error) {
      console.error(`Error getting list item ID for ${listTitle}:`, error);
      return null;
    }
  }
}
