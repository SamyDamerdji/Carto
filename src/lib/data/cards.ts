import { piqueCards } from './collections/pique';
import { trefleCards } from './collections/trefle';
import { coeurCards } from './collections/coeur';
import { carreauCards } from './collections/carreau';

export type CardColor = 'Trèfle' | 'Coeur' | 'Carreau' | 'Pique';

export interface CardCombination {
  carte_associee_id: string;
  signification: string;
}

export interface CardInterpretations {
  general: string;
  endroit: string;
  ombre_et_defis: string;
  conseil: string;
}

export interface CardDomains {
  amour: string;
  travail: string;
  finances: string;
  spirituel: string;
}

export interface Card {
  id: string;
  nom_carte: string;
  valeur: number;
  couleur: CardColor;
  image_url: string;
  resume_general: string;
  phrase_cle: string;
  mots_cles: string[];
  interpretations: CardInterpretations;
  domaines: CardDomains;
  prompts_visuels: string[];
  prompts_conversationnels: string[];
  combinaisons: CardCombination[];
}

export interface CardSummary {
  id: string;
  nom_carte: string;
  image_url: string;
  couleur: CardColor;
}

const allCardsData: Card[] = [
  ...trefleCards,
  ...piqueCards,
  ...coeurCards,
  ...carreauCards,
];

// Create a map for efficient lookups by ID
const cardsDataMap = new Map(allCardsData.map(card => [card.id, card]));

// Create a lightweight list for summary views
export const cardsList: CardSummary[] = allCardsData.map(card => ({
  id: card.id,
  nom_carte: card.nom_carte,
  image_url: card.image_url,
  couleur: card.couleur,
}));

// Function to get full details for a single card
export function getCardDetails(id: string): Card | undefined {
  return cardsDataMap.get(id);
}
