import type { Card } from '../cards';

export const piqueCards: Card[] = [
  {
    "id": "pique_valet",
    "nom_carte": "Valet de Pique",
    "valeur": 11,
    "couleur": "Pique",
    "image_url": "/images/cards/pique_valet.png",
    "resume_general": "Personnage complexe et intrigant. C'est le messager des ombres, un stratège silencieux et un révélateur de vérités. Il incarne les secrets, la prudence, l'observation et les efforts discrets qui portent leurs fruits.",
    "phrase_cle": "Observe dans l'ombre, car la vérité est cachée.",
    "mots_cles": [
      "stratège", "secret", "prudence", "observation", "révélation", "vérité", "discrétion", 
      "allié caché", "mystère", "test de confiance", "ruse", "vigilance"
    ],
    "interpretations": {
      "general": "Contrairement aux autres valets, celui de Pique porte un poids. Il est associé à des traits sombres ou mélancoliques, mais n'est pas fondamentalement négatif. Il est un stratège qui observe avant d'agir, un révélateur qui peut changer le cours du jeu. Il représente les zones grises de la vie, où tout n'est pas noir ou blanc.",
      "endroit": "Incarne un allié discret, un 'héros de l'ombre' qui aide sans se mettre en avant. Il est le signe que des efforts discrets porteront leurs fruits. C'est un guerrier fidèle, un poète réfléchi. Il invite à avancer prudemment, à la manière d'un joueur d'échecs.",
      "ombre_et_defis": "Représente un trouble-fête, une personne qui porte un masque ou dont les intentions sont cachées. Annonce un message caché, un avertissement, un test de confiance ou une trahison en embuscade. Il demande une vigilance accrue et de ne pas se fier aux apparences.",
      "conseil": "Soyez un stratège. Observez le contexte dans son ensemble avant de prendre une décision. Fiez-vous à votre intuition pour 'gratter sous la surface' et découvrir la vérité. C'est un appel à rester vigilant et à avancer prudemment."
    },
    "domaines": {
      "amour": "Annonce des surprises. Peut représenter un 'mystérieux amoureux' qui cache ses vraies émotions. C'est souvent un test de confiance, un défi à relever pour découvrir la vérité de la relation. Avec les cartes de Coeur, il signale des émotions contrariées ou un amour caché.",
      "travail": "C'est le stratège en coulisses. Représente un 'allié discret' qui aide dans l'ombre, ou le signe que des efforts, même invisibles, seront récompensés. Invite à agir comme dans un jeu d'échecs : réfléchir avant d'agir, avancer prudemment.",
      "finances": "Demande de la prudence. Avec l'As de Trèfle, il annonce une opportunité financière qui cache des détails importants. Avec les cartes rouges, il ajoute une dose de tension ou de risque. Il faut bien analyser avant de s'engager.",
      "spirituel": "C'est un miroir de nos propres choix, entre prudence et audace. Il nous confronte aux zones grises de notre vie et nous invite à chercher les vérités cachées, à nous fier à notre intuition plus qu'aux interprétations toutes faites. Il parle des secrets que l'on se chuchote à soi-même."
    },
    "prompts_visuels": [
      "une personne regardant une scène à travers des persiennes, dans la pénombre",
      "une pièce d'échec (pion) placée de manière stratégique sur un échiquier",
      "un détective observant un indice avec une loupe",
      "deux personnes se chuchotant un secret à l'oreille dans un couloir sombre",
      "une silhouette masquée lors d'un bal vénitien"
    ],
    "prompts_conversationnels": [
      "Le Valet de Pique est un 'stratège silencieux'. Décrivez une situation hypothétique où le silence et l'observation sont plus efficaces que l'action directe.",
      "Cette carte est vue comme un 'révélateur de vérités'. Comment quelque chose de caché (une information, une intention) peut-il changer le cours d'un projet ?",
      "Le Valet de Pique est comparé à 'un jeu d'échecs'. Quelle est la différence fondamentale entre une approche 'jeu d'échecs' et une approche 'coup de poker' dans une négociation ?",
      "La fiche mentionne 'le cœur sous la carapace' pour le domaine amoureux. Expliquez ce que cette image signifie en termes de dynamique relationnelle.",
      "Si le Valet de Pique est un allié, il est un 'allié discret'. Pourquoi un soutien caché serait-il parfois plus précieux qu'un soutien public et visible ?"
    ],
    "combinaisons": [
      { "carte_associee_id": "coeur_as", "signification": "Alerte sur les émotions. Un amour caché ou une trahison potentielle est présente. L'intuition est primordiale." },
      { "carte_associee_id": "coeur_roi", "signification": "Mêmes significations qu'avec l'As de Coeur : émotions contrariées, amour caché. Prudence dans les relations." },
      { "carte_associee_id": "carreau_roi", "signification": "Un conflit potentiel avec une figure d'autorité. La stratégie et la discrétion sont nécessaires pour naviguer la situation." },
      { "carte_associee_id": "carreau_07", "signification": "Nécessité de clarifier une situation qui semble floue. Un malentendu ou un manque d'information crée un obstacle." },
      { "carte_associee_id": "trefle_as", "signification": "Une opportunité financière se présente, mais il faut être très attentif aux détails et aux conditions cachées." },
      { "carte_associee_id": "trefle_10", "signification": "Un succès est possible, mais il viendra après une lutte ou des efforts importants. Ce ne sera pas facile." },
      { "carte_associee_id": "pique_roi", "signification": "L'énergie de la stratégie devient intense et complexe. Une situation demande une analyse très fine et prudente." },
      { "carte_associee_id": "pique_reine", "signification": "Peut représenter une femme rusée ou une protectrice qui agit dans l'ombre. Chaque déplacement compte." }
    ]
  }
];
