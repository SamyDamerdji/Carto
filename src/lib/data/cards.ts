
import { piqueCards } from './collections/pique';
import { trefleCards } from './collections/trefle';
import { coeurCards } from './collections/coeur';
import { carreauCards } from './collections/carreau';

export type CardColor = 'Trèfle' | 'Cœur' | 'Carreau' | 'Pique';

// --- Structures de données pour le format original ---

export interface OldCardCombination {
  carte_associee_id: string;
  signification: string;
}

export interface OldCardInterpretations {
  general: string;
  endroit: string;
  ombre_et_defis: string;
  conseil: string;
}

export interface OldCardDomains {
  amour: string;
  travail: string;
  finances: string;
  spirituel: string;
}

// --- Structures de données pour le nouveau format étendu ---

export interface NewCardCombination {
    carte_associee_id: string;
    signification: string;
    scenarios_associes?: string[];
    tonalite?: string;
}

export interface StructuredInterpretation {
    texte: string;
    ton: string;
    perspective: string;
}

export interface NewCardInterpretations {
    general: StructuredInterpretation;
    endroit: StructuredInterpretation;
    ombre_et_defis: StructuredInterpretation;
    conseil: StructuredInterpretation;
}

export interface StructuredDomain {
    texte: string;
    situation_type: string;
    scenarios_associes: string[];
}

export interface NewCardDomains {
    amour: StructuredDomain;
    travail: StructuredDomain;
    finances: StructuredDomain;
    spirituel: StructuredDomain;
}


// --- Interface `Card` unifiée et flexible ---

export interface Card {
  id: string;
  nom_carte: string;
  valeur: number | string;
  couleur: CardColor;
  image_url: string;

  // Champs de l'ancien format (rendus optionnels ou avec des types unis)
  resume_general?: string;
  prompts_conversationnels?: string[];

  // Champs avec structure évolutive (compatibles ancien et nouveau format)
  phrase_cle: string | { texte: string; usage: string; };
  mots_cles: string[] | {
    positifs: string[];
    negatifs: string[];
    neutres: string[];
    priorite?: string[];
  };
  interpretations: OldCardInterpretations | NewCardInterpretations;
  domaines: OldCardDomains | NewCardDomains;
  prompts_visuels?: string[] | Array<{
    scene: string;
    symbolique: string;
    usage: string;
  }>;
  combinaisons: Array<OldCardCombination | NewCardCombination>;

  // Nouveaux champs (optionnels pour la compatibilité)
  symbolique_image?: string;
  narration_base?: {
    texte: string;
    ton: string;
    perspective: string;
  };
  modules_interactifs?: Array<{
    id_module: string;
    etapes: Array<{
      type: string;
      contenu: string;
      ton: string;
      reponse_attendue: string;
    }>;
  }>;
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
