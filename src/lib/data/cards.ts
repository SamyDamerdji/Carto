
import { piqueAsCard } from './definitions/pique-as';
import { piqueValetCard } from './definitions/pique-valet';
import { trefleAsCard } from './definitions/trefle-as';
import { coeurAsCard } from './definitions/coeur-as';
import { carreauAsCard } from './definitions/carreau-as';
import { carreau10Card } from './definitions/carreau-10';
import { piqueRoiCard } from './definitions/pique-roi';
import { coeurRoiCard } from './definitions/coeur-roi';
import { carreauRoiCard } from './definitions/carreau-roi';
import { trefleRoiCard } from './definitions/trefle-roi';
import { piqueDameCard } from './definitions/pique-dame';
import { coeurDameCard } from './definitions/coeur-dame';
import { carreauDameCard } from './definitions/carreau-dame';
import { trefleDameCard } from './definitions/trefle-dame';
import { coeurValetCard } from './definitions/coeur-valet';
import { carreauValetCard } from './definitions/carreau-valet';
import { trefleValetCard } from './definitions/trefle-valet';
import { pique10Card } from './definitions/pique-10';
import { coeur10Card } from './definitions/coeur-10';
import { trefle10Card } from './definitions/trefle-10';
import { pique9Card } from './definitions/pique-9';
import { coeur9Card } from './definitions/coeur-9';
import { carreau9Card } from './definitions/carreau-9';
import { trefle9Card } from './definitions/trefle-9';
import { pique8Card } from './definitions/pique-8';
import { coeur8Card } from './definitions/coeur-8';
import { carreau8Card } from './definitions/carreau-8';
import { trefle8Card } from './definitions/trefle-8';
import { pique7Card } from './definitions/pique-7';
import { coeur7Card } from './definitions/coeur-7';
import { carreau7Card } from './definitions/carreau-7';
import { trefle7Card } from './definitions/trefle-7';
import { pique6Card } from './definitions/pique-6';
import { coeur6Card } from './definitions/coeur-6';
import { carreau6Card } from './definitions/carreau-6';
import { trefle6Card } from './definitions/trefle-6';
import { pique5Card } from './definitions/pique-5';
import { coeur5Card } from './definitions/coeur-5';
import { carreau5Card } from './definitions/carreau-5';
import { trefle5Card } from './definitions/trefle-5';
import { pique4Card } from './definitions/pique-4';
import { coeur4Card } from './definitions/coeur-4';
import { carreau4Card } from './definitions/carreau-4';
import { trefle4Card } from './definitions/trefle-4';
import { pique3Card } from './definitions/pique-3';
import { coeur3Card } from './definitions/coeur-3';
import { carreau3Card } from './definitions/carreau-3';
import { trefle3Card } from './definitions/trefle-3';
import { pique2Card } from './definitions/pique-2';
import { coeur2Card } from './definitions/coeur-2';
import { carreau2Card } from './definitions/carreau-2';
import { trefle2Card } from './definitions/trefle-2';


export type CardColor = 'Trèfle' | 'Cœur' | 'Carreau' | 'Pique';

export interface CardCombination {
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

export interface CardInterpretations {
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

export interface CardDomains {
    amour: StructuredDomain;
    travail: StructuredDomain;
    finances: StructuredDomain;
    spirituel: StructuredDomain;
    sante?: StructuredDomain;
}

export interface Card {
  id: string;
  nom_carte: string;
  valeur: number | string;
  couleur: CardColor;
  image_url: string;
  symbolique_image?: string;
  narration_base?: {
    texte: string;
    ton: string;
    perspective: string;
  };
  phrase_cle: {
    texte: string;
    usage: string;
  };
  mots_cles: {
    positifs: string[];
    negatifs: string[];
    neutres: string[];
    priorite?: string[];
  };
  interpretations: CardInterpretations;
  domaines: CardDomains;
  prompts_visuels?: Array<{
    scene: string;
    symbolique: string;
    usage: string;
  }>;
  modules_interactifs?: Array<{
    id_module: string;
    etapes: Array<{
      type: string;
      contenu: string;
      ton: string;
      reponse_attendue: string;
    }>;
  }>;
  combinaisons?: Array<CardCombination>;
}


export interface CardSummary {
  id: string;
  nom_carte: string;
  image_url: string;
  couleur: CardColor;
}

const allCardsData: Card[] = [
  // Trèfle
  trefleAsCard,
  trefleRoiCard,
  trefleDameCard,
  trefleValetCard,
  trefle10Card,
  trefle9Card,
  trefle8Card,
  trefle7Card,
  trefle6Card,
  trefle5Card,
  trefle4Card,
  trefle3Card,
  trefle2Card,
  // Cœur
  coeurAsCard,
  coeurRoiCard,
  coeurDameCard,
  coeurValetCard,
  coeur10Card,
  coeur9Card,
  coeur8Card,
  coeur7Card,
  coeur6Card,
  coeur5Card,
  coeur4Card,
  coeur3Card,
  coeur2Card,
  // Pique
  piqueAsCard,
  piqueRoiCard,
  piqueDameCard,
  piqueValetCard,
  pique10Card,
  pique9Card,
  pique8Card,
  pique7Card,
  pique6Card,
  pique5Card,
  pique4Card,
  pique3Card,
  pique2Card,
  // Carreau
  carreauAsCard,
  carreauRoiCard,
  carreauDameCard,
  carreauValetCard,
  carreau10Card,
  carreau9Card,
  carreau8Card,
  carreau7Card,
  carreau6Card,
  carreau5Card,
  carreau4Card,
  carreau3Card,
  carreau2Card,
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
