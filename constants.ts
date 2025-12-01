import { Nominee, Category } from './types';

export const APP_STORAGE_KEY = 'superlativos-app-data';

export const DEFAULT_NOMINEES: Nominee[] = [
  { id: '1', name: 'Ana Garcia', avatar: '👩' },
  { id: '2', name: 'Carlos Ruiz', avatar: '🧑' },
  { id: '3', name: 'Sofia Lopez', avatar: '👱‍♀️' },
  { id: '4', name: 'Miguel Angel', avatar: '🧒' },
  { id: '5', name: 'Lucia Diaz', avatar: '👧' },
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    title: 'El mas ENANO PAJERO ',
    description: '¿Quién siempre hace reír a la clase?',
    emoji: '😂',
    nominees: DEFAULT_NOMINEES
  },
  {
    id: 'cat_2',
    title: 'Futuro Presidente',
    description: '¿Quién es el más organizado y líder?',
    emoji: '👔',
    nominees: DEFAULT_NOMINEES
  }
];
