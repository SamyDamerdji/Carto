import type { Card } from '../cards';

export const trefleCards: Card[] = [
  {
    "id": "trefle_valet",
    "nom_carte": "Valet de Trèfle",
    "valeur": 11,
    "couleur": "Trèfle",
    "image_url": "/images/cards/trefle_valet.png",
    "resume_general": "Carte double-face qui incarne le messager loyal et l'opportuniste stratège. Il annonce souvent une nouvelle ou une occasion, mais demande de la prudence et du discernement. C'est le 'petit filou' du jeu, qui rappelle que la chance est une question d'attitude.",
    "phrase_cle": "Une occasion se présente, observe avant d'agir.",
    "mots_cles": [
      "messager", "jeune homme", "opportunité", "stratégie", "chance", "loyauté", "ingéniosité", 
      "adaptabilité", "prévoyance", "ruse", "discrétion", "nouvelle"
    ],
    "interpretations": {
      "general": "Le Valet de Trèfle est un personnage intriguant et nuancé. Il joue le rôle de messager discret, mais peut aussi cacher une ruse. C'est une carte qui murmure 'Ouvre l'œil, tout n'est pas ce qu'il semble' et invite à l'analyse avant l'action.",
      "endroit": "Représente un jeune homme brun, loyal et plein d'entrain. Il est honnête, sympathique et dévoué. Il annonce un succès dans les entreprises, de bonnes nouvelles, voire un fiancé pour une consultante.",
      "ombre_et_defis": "Incarne un jeune homme peu fiable, porteur d'obstacles, de retards ou d'imprévus. Il peut représenter des conseils rusés, des tensions ou des disputes dans un couple. Sa présence incite à la méfiance et à la vérification des informations.",
      "conseil": "Faites preuve d'intelligence et de stratégie. C'est le moment de jongler, de vous adapter et de saisir les opportunités tout en gardant les yeux ouverts. Analysez le contexte, faites confiance à votre instinct et jouez intelligemment."
    },
    "domaines": {
      "amour": "Symbolise un ami ou un prétendant fidèle, loyal et présent. Annonce souvent une union, des fiançailles ou un soutien financier d'un ami. Cependant, son côté 'double tranchant' peut aussi avertir de tensions ou de la présence d'un stratège dans les relations.",
      "travail": "Incarne l'ingéniosité et l'adaptabilité. Représente un jeune collègue ou collaborateur dynamique. Annonce une opportunité à saisir, un projet qui demande de la stratégie ou une réussite assurée par une action bien menée.",
      "finances": "Souvent de bon augure, il annonce une aide financière extérieure (avec le 7 de Trèfle), une somme d'argent inattendue (avec le 8 de Trèfle) ou une réussite financière grâce aux talents (avec l'As de Pique). Avertit d'être prudent avec la Dame de Carreau.",
      "spirituel": "C'est un rappel que 'la chance est une question d'attitude'. Il invite à garder l'esprit ouvert, à croire en l'inattendu et à voir les opportunités cachées dans les moments difficiles. C'est une invitation à être curieux et à poser des questions pour découvrir ce qui est caché."
    },
    "prompts_visuels": [
      "un jeune homme tendant un colis à quelqu'un avec un clin d'œil malicieux",
      "un chat sur le point de bondir sur une proie, les muscles tendus",
      "deux personnes jouant une partie d'échecs intense, l'une ayant un air confiant et rusé",
      "quelqu'un découvrant un trèfle à quatre feuilles dans un champ",
      "un jeune coursier agile naviguant à travers une ville animée"
    ],
    "prompts_conversationnels": [
      "Le Valet de Trèfle est un 'messager discret'. En quoi son message est-il différent de celui, plus formel, annoncé par une carte comme le 3 de Carreau ?",
      "La fiche le décrit comme un 'chat qui jauge avant de sauter'. Expliquez comment cette métaphore s'applique à une situation de négociation professionnelle.",
      "Le Valet de Trèfle incarne une dualité : il est à la fois 'loyal' et 'rusé'. Construisez un court scénario où ces deux traits sont nécessaires pour réussir.",
      "Cette carte nous apprend que 'la vie est un jeu'. Qu'est-ce que cela signifie d'un point de vue stratégique, par opposition à une approche purement hasardeuse ?",
      "Le Valet de Trèfle peut représenter soit un allié fidèle, soit un stratège rusé. Quel élément du tirage permettrait de trancher entre ces deux interprétations ?"
    ],
    "combinaisons": [
      { "carte_associee_id": "trefle_as", "signification": "Renommée, fortune, et réussite éclatante. Une combinaison très positive." },
      { "carte_associee_id": "trefle_roi", "signification": "Annonce un mariage avec une personne bien établie, une situation financièrement stable." },
      { "carte_associee_id": "coeur_as", "signification": "Une belle retrouvaille ou une réunion avec une personne aimée." },
      { "carte_associee_id": "coeur_09", "signification": "Une liaison amoureuse qui mène au mariage." },
      { "carte_associee_id": "carreau_as", "signification": "Des nouvelles concrètes et importantes venant d'un ami ou d'un proche." },
      { "carte_associee_id": "carreau_10", "signification": "Succès garanti dans une démarche importante qui était en cours." },
      { "carte_associee_id": "pique_as", "signification": "Une réussite financière obtenue grâce aux talents et à l'intelligence du consultant." },
      { "carte_associee_id": "pique_dame", "signification": "Une menace plane sur les biens. Prudence financière et matérielle requise." },
      { "carte_associee_id": "pique_10", "signification": "Avertissement contre des gains malhonnêtes ou un piège financier." }
    ]
  }
];
