import { AppState, Vote } from '../types';
import { APP_STORAGE_KEY, DEFAULT_CATEGORIES } from '../constants';
import { appendVote, clearVotes as clearSheetsVotes } from './sheetsService';

const initialState: AppState = {
  categories: DEFAULT_CATEGORIES,
  votes: [],
  adminPassword: 'admin'
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(APP_STORAGE_KEY);
    if (!serialized) return initialState;
    return JSON.parse(serialized);
  } catch {
    return initialState;
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

export const hasStudentVoted = (studentName: string): boolean => {
  const state = loadState();
  return state.votes.some(v => v.studentName.toLowerCase() === studentName.toLowerCase().trim());
};

export const submitVotes = async (studentName: string, newVotes: Vote[]) => {
  const state = loadState();
  const updatedVotes = [...state.votes, ...newVotes];
  const newState = { ...state, votes: updatedVotes };
  saveState(newState);

  for (const vote of newVotes) {
    const category = state.categories.find(c => c.id === vote.categoryId);
    const nominee = category?.nominees.find(n => n.id === vote.nomineeId);
    
    await appendVote(
      vote,
      category?.title || vote.categoryId,
      nominee?.name || vote.nomineeId
    );
  }
};

export const clearVotes = async () => {
  const state = loadState();
  const newState = { ...state, votes: [] };
  saveState(newState);
  
  await clearSheetsVotes();
  return newState;
};