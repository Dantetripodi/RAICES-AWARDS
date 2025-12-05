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
  { id: 'nom_14', name: 'Bauti', avatar: '👤' },
  { id: 'nom_15', name: 'Cande', avatar: '👤' },
  { id: 'nom_16', name: 'Maia', avatar: '👤' },
  { id: 'nom_17', name: 'Selu', avatar: '👤' },
  { id: 'nom_18', name: 'China', avatar: '👤' },
  { id: 'nom_19', name: 'Dante y Martin', avatar: '👤' },
  { id: 'nom_20', name: 'Martin', avatar: '👤' },
  { id: 'nom_21', name: 'Elian', avatar: '👤' },
  { id: 'nom_22', name: 'Brune', avatar: '👤' },
  { id: 'nom_23', name: 'Fede', avatar: '👤' },
  { id: 'nom_24', name: 'Cuba', avatar: '👤' },

];

const getNomineesByName = (...names: string[]): Nominee[] => {
  return names.map(name => AWARDS_NOMINEES.find(n => n.name.toLowerCase() === name.toLowerCase())!).filter(Boolean);
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    title: 'Premio Revelación',
    description: '¿Quién ha sido la gran revelación?',
    emoji: '⭐',
    nominees: getNomineesByName('Mono','Lucas','Mateo Culon','Fede')
  },
  {
    id: 'cat_2',
    title: 'Premio Mujer/Hombre que Resuelve',
    description: '¿Quién siempre resuelve todo?',
    emoji: '🛠️',
    nominees: getNomineesByName('Carme','Luca','Mia','Cande')
  },
  {
    id: 'cat_3',
    title: 'Premio al Enano Pajero',
    description: '¿Quién es el más pajero?',
    emoji: '😏',
    nominees: getNomineesByName('Ludmi', 'Mia', 'Mora')
  },
  {
    id: 'cat_4',
    title: 'Premio al Más 🏳️‍🌈',
    description: '¿Quién es el más 🏳️‍🌈?',
    emoji: '🏳️‍🌈',
    nominees: getNomineesByName('Matias', 'Rama', 'Lucho')
  },
  {
    id: 'cat_5',
    title: 'Premio al Más Infiel',
    description: '¿Quién es el más infiel?',
    emoji: '💔',
    nominees: getNomineesByName('Luca', 'Dome','Brune','Maia')
  },
  {
    id: 'cat_6',
    title: 'Premio al que Mejor se Expresa',
    description: '¿Quién se expresa mejor?',
    emoji: '💬',
    nominees: getNomineesByName('Lucho', 'Dome','Thiago','Cuba')
  },
  {
    id: 'cat_7',
    title: 'Premio al Mejor Ingreso',
    description: '¿Quién tuvo el mejor ingreso?',
    emoji: '🎯',
    nominees: getNomineesByName('Mateo Culon', 'Thiago', 'Matias','Bauti','Elian')
  },
  {
    id: 'cat_8',
    title: 'Premio al Compromiso',
    description: '¿Quién tiene más compromiso?',
    emoji: '🤝',
    nominees: getNomineesByName('Lucas','Cande','Maia','Mateo Angeles','Joaco')
  },
  {
    id: 'cat_9',
    title: 'Premio al mas Nazi',
    description: '¿Quién es el  más NAZI?',
    emoji: '🤝',
    nominees: getNomineesByName('Fede','Carmen')
  },
  {
    id: 'cat_10',
    title: 'Guia mas zorra',
    description: '¿Quién  es la guia mas Infi...?',
    emoji: '👹',
    nominees: getNomineesByName('Selu','China')
  },
  {
    id: 'cat_11',
    title: 'Guia mas lindo',
    description: '¿Guia mas lindo.?',
    emoji: '👹',
    nominees: getNomineesByName('Dante y Martin')
  }
];