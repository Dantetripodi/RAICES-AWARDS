import { AppState, Vote, Category } from '../types';
import { APP_STORAGE_KEY, DEFAULT_CATEGORIES } from '../constants';

const initialState: AppState = {
  categories: DEFAULT_CATEGORIES,
  votes: [],
  adminPassword: 'admin' // In a real app, this would be secure
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(APP_STORAGE_KEY);
    if (!serialized) {
      return initialState;
    }
    const state = JSON.parse(serialized);
    // Ensure categories exist if state was cleared partially
    if (!state.categories || state.categories.length === 0) {
        state.categories = DEFAULT_CATEGORIES;
    }
    return state;
  } catch (e) {
    console.error('Error loading state', e);
    return initialState;
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state', e);
  }
};

export const hasStudentVoted = (studentName: string): boolean => {
  const state = loadState();
  // Check if this student name has voted in ALL categories (simplified: if they have any votes, block them for this simple demo, 
  // or checks if they voted in at least one. For this specific requirement "one per person", we block if name exists in votes array)
  return state.votes.some(v => v.studentName.toLowerCase() === studentName.toLowerCase().trim());
};

export const submitVotes = (studentName: string, newVotes: Vote[]) => {
    const state = loadState();
    const updatedVotes = [...state.votes, ...newVotes];
    saveState({ ...state, votes: updatedVotes });
}

export const clearVotes = () => {
    const state = loadState();
    const newState = { ...state, votes: [] };
    saveState(newState);
    return newState;
}

export const updateCategories = (newCategories: Category[]) => {
    const state = loadState();
    // Keep votes that are relevant to new categories? No, usually new categories means new vote session.
    // For safety, we keep votes but they might be orphaned. Better to clear votes or warn user.
    // Here we just update categories.
    saveState({ ...state, categories: newCategories });
}

export const getResults = () => {
    const state = loadState();
    const results: Record<string, Record<string, number>> = {};
    
    state.categories.forEach(cat => {
        results[cat.id] = {};
        cat.nominees.forEach(nom => {
            results[cat.id][nom.id] = 0;
        });
    });

    state.votes.forEach(vote => {
        if (results[vote.categoryId] && results[vote.categoryId][vote.nomineeId] !== undefined) {
            results[vote.categoryId][vote.nomineeId]++;
        }
    });

    return results;
}

export const resetAll = () => {
    localStorage.removeItem(APP_STORAGE_KEY);
    return initialState;
}
