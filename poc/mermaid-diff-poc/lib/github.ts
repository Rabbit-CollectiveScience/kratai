import { Octokit } from '@octokit/rest';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  default_branch: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
}

export class GitHubService {
  private octokit: Octokit | null = null;

  constructor() {
    // Try to load token from localStorage if in browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('github_token');
      if (token) {
        this.octokit = new Octokit({ auth: token });
      }
    }
  }

  setToken(token: string) {
    this.octokit = new Octokit({ auth: token });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('github_token', token);
    }
  }

  clearToken() {
    this.octokit = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('github_token');
    }
  }

  isAuthenticated(): boolean {
    return this.octokit !== null;
  }

  async getUser() {
    if (!this.octokit) throw new Error('Not authenticated');
    
    const { data } = await this.octokit.users.getAuthenticated();
    return data;
  }

  async listRepos(): Promise<GitHubRepo[]> {
    if (!this.octokit) throw new Error('Not authenticated');
    
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });
    
    return data as GitHubRepo[];
  }

  async getRepoContents(
    owner: string,
    repo: string,
    path: string = ''
  ): Promise<GitHubFile[]> {
    if (!this.octokit) throw new Error('Not authenticated');
    
    const { data } = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    
    return Array.isArray(data) ? (data as GitHubFile[]) : [data as GitHubFile];
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string
  ): Promise<string> {
    if (!this.octokit) throw new Error('Not authenticated');
    
    const { data } = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    
    if ('content' in data && data.encoding === 'base64') {
      return atob(data.content);
    }
    
    throw new Error('File content not available');
  }
}

// Singleton instance
let githubService: GitHubService | null = null;

export function getGitHubService(): GitHubService {
  if (!githubService) {
    githubService = new GitHubService();
  }
  return githubService;
}
