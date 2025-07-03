
import type { Card } from '@/lib/data/cards';

export const pique4Card: Card = {
  "id": "pique-4",
  "nom_carte": "Quatre de Pique",
  "valeur": "4",
  "couleur": "Pique",
  "image_url": "https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/04-pique.png",
  "symbolique_image": "Le chiffre quatre représente la stabilité, les fondations, les quatre murs d'une pièce. Associé à la couleur Pique, il symbolise une stabilité subie, un enfermement. C'est l'image de la chambre du malade, de la cellule du prisonnier, ou de la tombe. Une immobilité forcée.",
  "narration_base": {
    "texte": "Voici le Quatre de Pique, une carte qui invite au calme et à la prudence. Elle est le symbole du repos forcé, de l'isolement et de la solitude. Traditionnellement, elle est associée à la maladie, à la convalescence, à un retrait nécessaire du monde. Elle n'est pas une carte d'action, mais de stase. Elle peut indiquer une période de confinement, une hospitalisation, ou simplement un besoin impérieux de se retirer pour récupérer des forces ou panser ses plaies.",
    "ton": "sérieux, apaisant, pédagogue",
    "perspective": "mentor"
  },
  "phrase_cle": {
    "texte": "Le repos forcé, l'isolement nécessaire.",
    "usage": "Pour capturer son essence de retrait et de pause obligatoire."
  },
  "mots_cles": {
    "positifs": [
      "Repos",
      "Convalescence",
      "Récupération",
      "Introspection",
      "Retraite (stratégique)",
      "Prudence"
    ],
    "negatifs": [
      "Maladie",
      "Isolement",
      "Solitude",
      "Confinement",
      "Stagnation",
      "Épuisement",
      "Mise à l'écart",
      "Projet en attente",
      "Tristesse"
    ],
    "neutres": [
      "Pause",
      "Lit",
      "Chambre",
      "Retrait",
      "Hôpital"
    ],
    "priorite": [
      "Maladie",
      "Isolement",
      "Repos forcé",
      "Stagnation"
    ]
  },
  "interpretations": {
    "general": {
      "texte": "Le Quatre de Pique annonce une période d'inactivité et de retrait. Le cours de la vie est mis sur pause, souvent en raison de problèmes de santé, d'un grand épuisement ou de la nécessité de se retirer d'une situation conflictuelle. C'est le moment de se mettre à l'abri, de se reposer et de récupérer. Toute tentative de forcer le passage se heurtera à un mur.",
      "ton": "grave, factuel",
      "perspective": "mentor"
    },
    "endroit": {
      "texte": "Vous allez devoir ralentir, que vous le vouliez ou non. Un problème de santé pourrait vous obliger à rester alité. Un projet pourrait être mis en suspens. Une période de solitude s'impose, vous coupant temporairement de vos activités sociales habituelles. Il est crucial d'accepter cette pause pour mieux rebondir plus tard.",
      "ton": "direct, préventif",
      "perspective": "mentor"
    },
    "ombre_et_defis": {
      "texte": "L'ombre de cette carte est la transformation de l'isolement en dépression. Le retrait, s'il est mal vécu, peut mener à un sentiment d'abandon et à une perte de connexion avec le monde. Le défi est de considérer cette période non comme une punition, mais comme une opportunité de guérison, de réflexion et de régénération. C'est l'art de transformer une contrainte en une retraite bénéfique.",
      "ton": "nuancé, sage",
      "perspective": "mentor"
    },
    "conseil": {
      "texte": "Le conseil est sans équivoque : reposez-vous. Prenez soin de votre santé physique et mentale. Acceptez de ne pas être productif pour le moment. Annulez les rendez-vous non essentiels. C'est en vous accordant ce temps de récupération que vous éviterez des problèmes plus graves. La patience et le soin de soi sont vos priorités.",
      "ton": "protecteur, directif",
      "perspective": "mentor"
    }
  },
  "domaines": {
    "amour": {
      "texte": "En amour, cette carte est un signe de froideur et de distance. La communication est rompue, l'un des partenaires se retire dans sa coquille. Il peut y avoir une séparation temporaire ou un sentiment de grande solitude au sein même du couple. Pour un célibataire, elle indique une période de retrait où aucune nouvelle rencontre n'est à l'horizon.",
      "situation_type": "Distance dans le couple, solitude, absence de communication.",
      "scenarios_associes": [
        "Un des partenaires est malade et a besoin de calme.",
        "Le couple ne se parle plus, chacun vit dans son coin.",
        "Une période de célibat où l'on ne cherche pas à rencontrer quelqu'un."
      ]
    },
    "travail": {
      "texte": "Annonce un arrêt de travail, souvent pour cause de maladie (congé maladie). Un projet est mis en pause, en attente. C'est une période de stagnation professionnelle. Vous pouvez vous sentir isolé de votre équipe ou mis à l'écart des décisions importantes. Aucune progression n'est possible pour le moment.",
      "situation_type": "Arrêt de travail, projet en suspens, stagnation de carrière.",
      "scenarios_associes": [
        "Prendre un congé maladie pour surmenage.",
        "Un projet est gelé par la direction.",
        "Se sentir mis au placard."
      ]
    },
    "finances": {
      "texte": "Indique une période d'inactivité financière. Pas de rentrées d'argent, mais aussi peu de dépenses. La situation est figée. Elle peut signifier des soucis financiers qui obligent à une extrême frugalité et à un retrait social. Il est conseillé de mettre de l'argent de côté et d'être très prudent.",
      "situation_type": "Stagnation financière, économies forcées, prudence budgétaire.",
      "scenarios_associes": [
        "Une période de chômage ou d'inactivité.",
        "Devoir réduire drastiquement ses dépenses.",
        "Les investissements ne rapportent rien."
      ]
    },
    "sante": {
      "texte": "C'est la carte la plus directe concernant la santé. Elle annonce une période de maladie, de fatigue intense ou de surmenage qui oblige au repos. Elle conseille vivement de s'arrêter, d'écouter son corps et de se mettre en convalescence pour éviter des complications.",
      "situation_type": "Maladie, convalescence, repos obligatoire.",
      "scenarios_associes": [
        "Attraper une grippe qui vous cloue au lit.",
        "Un médecin qui prescrit un arrêt de travail pour épuisement.",
        "La nécessité de se retirer pour se remettre d'une opération."
      ]
    },
    "spirituel": {
      "texte": "C'est la carte de la retraite spirituelle par excellence, mais souvent subie plutôt que choisie. Une maladie ou une épreuve vous force à l'introspection. C'est un moment pour méditer, pour lire, pour être seul avec ses pensées les plus profondes. C'est dans ce silence et cette immobilité que des compréhensions importantes peuvent émerger.",
      "situation_type": "Retraite spirituelle forcée, introspection profonde, solitude méditative.",
      "scenarios_associes": [
        "Profiter d'une convalescence pour lire des livres spirituels.",
        "Une période de solitude qui mène à une meilleure connaissance de soi.",
        "Apprendre à être bien avec soi-même, dans le silence."
      ]
    }
  },
  "modules_interactifs": [
    {
      "id_module": "reflexion_repos_pique_4",
      "etapes": [
        {
          "type": "question_ouverte",
          "contenu": "Le Quatre de Pique vous impose une pause. Dans quel domaine de votre vie ressentez-vous le plus ce besoin de repos ? Quelle est la première chose que vous pourriez annuler ou déléguer pour prendre soin de vous ?",
          "ton": "doux, pragmatique",
          "reponse_attendue": "Texte libre de réflexion personnelle."
        }
      ]
    }
  ],
  "combinaisons": [
    {
      "carte_associee_id": "pique-9",
      "signification": "C'est une combinaison très grave. L'isolement et la maladie (Quatre) mènent à une fin tragique ou un grand malheur (Neuf). Annonce une maladie grave, un deuil suite à une maladie, ou un isolement qui se termine par un désastre.",
      "scenarios_associes": [
        "Une hospitalisation avec un diagnostic très sérieux.",
        "Un isolement qui mène à une dépression profonde."
      ],
      "tonalite": "Extrêmement négative"
    },
    {
      "carte_associee_id": "pique-10",
      "signification": "Le repos forcé est vécu avec une grande angoisse. L'isolement (Quatre) est synonyme d'enfermement et de peur (Dix). Annonce une hospitalisation ou un confinement très mal vécu, avec beaucoup d'anxiété et de nuits blanches.",
      "scenarios_associes": [
        "Une hospitalisation qui est source de grande peur.",
        "Se sentir prisonnier de sa propre maison durant une convalescence."
      ],
      "tonalite": "Très négative"
    },
    {
      "carte_associee_id": "coeur-as",
      "signification": "Maladie ou isolement au sein du foyer. Un membre de la famille doit garder le lit, ou une tristesse ambiante contraint la famille à se replier sur elle-même. Le bonheur de la maison est suspendu.",
      "scenarios_associes": [
        "Prendre soin d'un proche malade à la maison.",
        "Une ambiance morose et de solitude à la maison."
      ],
      "tonalite": "Négative"
    },
    {
      "carte_associee_id": "carreau-valet",
      "signification": "Une nouvelle annonce la période de repos forcé. C'est la lettre du médecin prescrivant un arrêt de travail, ou un message qui vous informe qu'un projet est suspendu et que vous devez cesser de travailler dessus.",
      "scenarios_associes": [
        "Recevoir un certificat médical pour un arrêt maladie.",
        "Un email de la direction annonçant la mise en pause d'un projet."
      ],
      "tonalite": "Négative mais factuelle"
    }
  ]
};
