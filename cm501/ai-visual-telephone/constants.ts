import { GameState, PromptRecipeCategory, Role } from './types';

export const GROUP_ORDER: Role[] = ['GROUP_1', 'GROUP_2', 'GROUP_3', 'GROUP_4', 'GROUP_5'];

export const INITIATOR_THEMES: Record<Role, string> = {
  'GROUP_1': "What would your classroom look like if it became a magical world on the last day?",
  'GROUP_2': "Create a scene where everything goes hilariously wrong on the last day of class.",
  'GROUP_3': "How would the last day of class look in a school of the distant future?",
  'GROUP_4': "Illustrate the abstract concept of 'finishing something important' as a visual story.",
  'GROUP_5': "Show the bittersweet feeling of walking out of the classroom for the very last time.",
  'TEACHER': ""
};

export const PROMPT_RECIPE: PromptRecipeCategory[] = [
  {
    name: "The Subject",
    description: "What is it?",
    examples: ["A chair", "A futuristic sneaker", "A perfume bottle", "A bus stop", "A tiny house", "A geometric explosion", "Letter 'A'"]
  },
  {
    name: "The Style",
    description: "History & Movement",
    examples: ["Art Deco", "Bauhaus", "Art Nouveau", "Cyberpunk", "Minimalist", "Memphis Design", "In the style of Wes Anderson"]
  },
  {
    name: "The Material",
    description: "What is it made of?",
    examples: ["Polished chrome", "Raw concrete", "Rusted iron", "Blue velvet", "Fluffy cotton candy", "Translucent plastic", "Glowing neon tubing"]
  },
  {
    name: "The Vibe",
    description: "Camera & Lighting",
    examples: ["Cinematic lighting", "Golden hour", "Neon noir", "Studio softbox", "Isometric view", "Macro close-up", "Fish-eye lens"]
  }
];

export const INITIAL_GAME_STATE: GameState = {
  projects: GROUP_ORDER.map((role, index) => ({
    id: `project-${index + 1}`,
    initiator: role,
    turns: [],
    isComplete: false
  }))
};