export type Role = 'TEACHER' | 'GROUP_1' | 'GROUP_2' | 'GROUP_3' | 'GROUP_4' | 'GROUP_5';

export interface Turn {
  groupId: Role;
  prompt: string;
  generatedImage: string | null; // Base64 string
  timestamp: number;
}

export interface Project {
  id: string;
  initiator: Role;
  turns: Turn[];
  isComplete: boolean;
}

export interface GameState {
  projects: Project[];
}

export interface PromptRecipeCategory {
  name: string;
  description: string;
  examples: string[];
}