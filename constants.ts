import { Nominee, Category } from './types';

export const APP_STORAGE_KEY = 'superlativos-app-data';

export const AWARDS_NOMINEES: Nominee[] = [
  { id: 'nom_1', name: 'Mono', avatar: '🐵' },
  { id: 'nom_2', name: 'Lucas', avatar: '👤' },
  { id: 'nom_3', name: 'Carme', avatar: '👤' },
  { id: 'nom_4', name: 'Ludmi', avatar: '👤' },
  { id: 'nom_5', name: 'Mia', avatar: '👤' },
  { id: 'nom_6', name: 'Mora', avatar: '👤' },
  { id: 'nom_7', name: 'Rama', avatar: '👤' },
  { id: 'nom_8', name: 'Lucho', avatar: '👤' },
  { id: 'nom_9', name: 'Luca', avatar: '👤' },
  { id: 'nom_10', name: 'Dome', avatar: '👤' },
  { id: 'nom_11', name: 'Mateo', avatar: '👤' },
  { id: 'nom_12', name: 'Thiago', avatar: '👤' },
  { id: 'nom_13', name: 'Mati', avatar: '👤' },
];

const getNomineesByName = (...names: string[]): Nominee[] => {
  return names.map(name => AWARDS_NOMINEES.find(n => n.name.toLowerCase() === name.toLowerCase())!).filter(Boolean);
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_6',
    title: 'Premio Revelación',
    description: '¿Quién ha sido la gran revelación?',
    emoji: '⭐',
    nominees: getNomineesByName('Mono', 'Lucas')
  },
  {
    id: 'cat_7',
    title: 'Premio Mujer/Hombre que Resuelve',
    description: '¿Quién siempre resuelve todo?',
    emoji: '🛠️',
    nominees: getNomineesByName('Carme','Luca','Mia')
  },
  {
    id: 'cat_8',
    title: 'Premio al Enano Pajero',
    description: '¿Quién es el más pajero?',
    emoji: '😏',
    nominees: getNomineesByName('Ludmi', 'Mia', 'Mora','Mono')
  },
  {
    id: 'cat_9',
    title: 'Premio al Más 🏳️‍🌈',
    description: '¿Quién es el más 🏳️‍🌈?',
    emoji: '🏳️‍🌈',
    nominees: getNomineesByName('Mono', 'Rama', 'Lucho')
  },
  {
    id: 'cat_10',
    title: 'Premio al Más Infiel',
    description: '¿Quién es el más infiel?',
    emoji: '💔',
    nominees: getNomineesByName('Luca', 'Dome','Lucho')
  },
  {
    id: 'cat_11',
    title: 'Premio al que Mejor se Expresa',
    description: '¿Quién se expresa mejor?',
    emoji: '💬',
    nominees: getNomineesByName('Lucho', 'Dome','Thiago')
  },
  {
    id: 'cat_12',
    title: 'Premio al Mejor Ingreso',
    description: '¿Quién tuvo el mejor ingreso?',
    emoji: '🎯',
    nominees: getNomineesByName('Mateo', 'Thiago', 'Mati','Bauti')
  },
  {
    id: 'cat_13',
    title: 'Premio al Compromiso',
    description: '¿Quién tiene más compromiso?',
    emoji: '🤝',
    nominees: getNomineesByName('Lucas', 'Cande', 'Maya')
  }
];