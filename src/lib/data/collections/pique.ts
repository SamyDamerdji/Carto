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
  },
  {
    "id": "pique_roi",
    "nom_carte": "Roi de Pique",
    "valeur": 13,
    "couleur": "Pique",
    "image_url": "/images/cards/pique_roi.png",
    "resume_general": "Carte de l'autorité, de la loi et de la structure. Représente un homme de pouvoir, la justice, les décisions mûrement réfléchies et l'ordre. Elle incarne la sagesse, la rigueur et la responsabilité.",
    "phrase_cle": "La loi et la structure apportent la clarté.",
    "mots_cles": [
      "autorité", "loi", "justice", "structure", "décision", "rigueur", "responsabilité", 
      "ordre", "pouvoir", "sagesse", "administratif", "protocole", "homme d'âge", "intellect"
    ],
    "interpretations": {
      "general": "Le Roi de Pique est une figure emblématique qui impose le respect. Il incarne tout ce qui est protocolaire, administratif et profondément ancré dans la justice et la loi. Il représente la structure nécessaire pour avancer avec clarté, tel un joueur d'échecs planifiant ses coups.",
      "endroit": "Symbolise la prise de décision éclairée, le recours à la loi ou à un expert (avocat, juge), la mise en place d'un projet structuré. Annonce une situation qui se régularise, un contrat à signer, une nécessité de faire preuve de rigueur et d'organisation.",
      "ombre_et_defis": "Lorsqu'il représente un obstacle, le Roi de Pique devient rigide, froid et autoritaire. Il peut symboliser un blocage administratif, un procès, un jugement sévère ou un abus de pouvoir. Il incarne une logique froide dénuée de bienveillance.",
      "conseil": "Faites appel à votre logique et à votre sens de l'organisation. C'est le moment de structurer vos pensées et vos actions, de regarder les choses en face et de trancher avec clarté. Ne laissez pas l'émotionnel prendre le dessus sur le rationnel."
    },
    "domaines": {
      "amour": "Indique une relation où la logique et la sagesse priment sur la passion. Peut représenter un homme plus âgé, divorcé ou veuf. Avec la Reine de Coeur, c'est l'alliance de l'esprit et du coeur, un besoin d'équilibre entre la raison et les sentiments.",
      "travail": "Domaine de prédilection de cette carte. Elle annonce des décisions importantes, des contrats, des négociations, la nécessité de suivre un protocole strict. Symbolise un patron, un expert ou un homme de loi influent.",
      "finances": "Appelle à une gestion rigoureuse et structurée. Favorise les investissements à long terme et les décisions basées sur une analyse fine plutôt que sur l'impulsion. Peut annoncer un héritage ou des questions légales liées à l'argent.",
      "spirituel": "Représente la recherche d'une structure et d'un ordre dans sa propre vie. C'est la sagesse acquise par l'expérience, la capacité à prendre des décisions alignées avec ses propres lois intérieures. Associé aux planètes Jupiter (ordre supérieur) et Saturne (rigueur, responsabilité)."
    },
    "prompts_visuels": [
      "un juge dans un tribunal rendant son verdict",
      "un homme d'affaires âgé signant un document important dans un bureau en acajou",
      "une bibliothèque ancienne remplie de livres de loi",
      "un joueur d'échecs en pleine réflexion stratégique",
      "le sceau officiel d'un document administratif"
    ],
    "prompts_conversationnels": [
      "Le Roi de Pique est souvent lié à la 'loi'. Donnez deux exemples concrets, l'un dans le domaine professionnel et l'un dans le domaine personnel, où cette carte pourrait apparaître.",
      "Cette carte représente un 'homme d'un certain âge'. Quelles qualités spécifiques, autres que l'âge, ce personnage incarne-t-il ?",
      "En quoi la 'décision' prise sous l'influence du Roi de Pique diffère-t-elle d'une décision prise sous l'influence du Roi de Coeur ?",
      "Cette carte est associée à la fois à Jupiter (expansion, ordre supérieur) et Saturne (rigueur, responsabilité). Comment ces deux énergies, à première vue opposées, se combinent-elles dans la signification du Roi de Pique ?",
      "Le texte mentionne que cette carte 'n'est pas là pour faire rêver, mais pour structurer'. Expliquez cette phrase avec vos propres mots."
    ],
    "combinaisons": [
      { "carte_associee_id": "coeur_reine", "signification": "L'alliance de l'esprit et du cœur. Une situation où il faut concilier logique froide et bienveillance émotionnelle pour trouver l'équilibre." },
      { "carte_associee_id": "pique_as", "signification": "Stratégie pure. Annonce des décisions majeures, mûrement réfléchies qui demandent une planification experte. C'est le moment des négociations d'envergure." },
      { "carte_associee_id": "trefle_03", "signification": "Action et opportunité. Une idée va pouvoir se transformer en réalité grâce à une organisation rigoureuse. Combinaison gagnante pour la concrétisation." },
      { "carte_associee_id": "pique_valet", "signification": "Mise en garde contre des intrigues ou du double jeu. Il faut scruter les détails et ne rien prendre pour argent comptant. Une personne pourrait cacher ses intentions." },
      { "carte_associee_id": "coeur_10", "signification": "Un succès acquis par la persévérance et la discipline, menant à un bonheur partagé." },
      { "carte_associee_id": "carreau_04", "signification": "Stabilité matérielle acquise par la persévérance. Le travail acharné et la structure portent leurs fruits. Favorise les investissements solides et à long terme." },
      { "carte_associee_id": "coeur_09", "signification": "Un rêve qui devient réalité grâce à la patience et à la discipline." },
      { "carte_associee_id": "trefle_02", "signification": "Un partenariat fructueux se dessine à l'horizon, basé sur des bases solides et une stratégie claire." },
      { "carte_associee_id": "carreau_07", "signification": "Patience nécessaire avant de voir les récompenses d'un effort structuré." }
    ]
  },
  {
    "id": "pique_dame",
    "nom_carte": "Dame de Pique",
    "valeur": 12,
    "couleur": "Pique",
    "image_url": "/images/cards/pique_dame.png",
    "resume_general": "Carte de la clarté, de l'intelligence et de l'indépendance. Elle représente une femme forte qui tranche avec fermeté et voit la vérité sans illusion. Figure de dualité, elle est à la fois rigueur et protection, invitant à prendre des décisions difficiles mais justes.",
    "phrase_cle": "La vérité n'a pas besoin d'être aimée, juste d'être entendue.",
    "mots_cles": [
      "vérité", "clarté", "intelligence", "indépendance", "rigueur", "détachement", "protection",
      "décision", "fermeté", "transformation", "sagesse", "femme forte"
    ],
    "interpretations": {
      "general": "La Dame de Pique est une figure mystérieuse et fascinante. Souvent perçue comme distante ou froide, elle est en réalité une alliée qui dit la vérité, même quand c'est dur à entendre. Elle ne s'embarrasse pas de sentiments inutiles et pousse à voir la réalité sans filtres ni illusions, ce qui est une forme de protection.",
      "endroit": "Incarne une femme forte, intelligente et indépendante, qui n'a pas peur de l'adversité. Elle est un guide pour prendre des décisions difficiles avec une main ferme. Elle symbolise la sagesse, la clarté et la capacité à se libérer des chaînes invisibles. Elle est un bouclier face aux tempêtes émotionnelles.",
      "ombre_et_defis": "Représente la froideur, la distance et le détachement excessif. Elle peut être perçue comme une figure de malchance ou de trahison. Elle symbolise une période où il faut trancher de manière impopulaire, ou faire face à une vérité qui dérange. Elle peut aussi indiquer une relation qui épuise.",
      "conseil": "Soyez fidèle à vous-même. Mettez des limites, dites non, protégez-vous. Tranchez avec clarté, en faisant ce qui est juste et non ce qui est facile. Voyez les obstacles comme des opportunités de croissance et prenez le contrôle de votre destin."
    },
    "domaines": {
      "amour": "Peut sembler froide, mais cherche en réalité un amour authentique, sans faux-semblants. Indique une période où il faut réfléchir avec la tête et non avec le cœur. Invite à analyser ce qui est bon pour soi et à se protéger avant de pouvoir aimer pleinement.",
      "travail": "Représente l'intelligence stratégique, la capacité à prendre des décisions fermes et à voir la vérité d'une situation. Elle est l'alliée qui aide à couper les liens avec un projet ou un environnement de travail toxique.",
      "finances": "Demande de la clarté et de l'objectivité. Elle invite à analyser les situations financières sans illusion et à prendre des décisions courageuses pour se protéger. Elle n'est pas une carte de gain facile, mais de gestion intelligente et protectrice.",
      "spirituel": "Figure de transformation qui rappelle de ne pas avoir peur de l'inconnu. Elle est la voix intérieure qui dit de lâcher prise et de faire confiance au processus. Elle rappelle que la vérité et la clarté sont de grands actes d'amour envers soi-même et les autres."
    },
    "prompts_visuels": [
      "une femme élégante tenant une épée pointée vers le bas, avec une expression déterminée",
      "une silhouette se détachant de chaînes brisées",
      "un bouclier de cristal reflétant une tempête sans se briser",
      "un chirurgien effectuant une incision précise et nette",
      "une reine assise sur un trône de pierre dans un paysage d'hiver, l'air sage et distant"
    ],
    "prompts_conversationnels": [
      "La Dame de Pique incarne une dualité : 'rigueur' et 'protection'. Comment ces deux concepts peuvent-ils être liés ?",
      "La fiche dit qu'elle 'fait ce qui est juste, pas ce qui est facile'. Donnez un exemple de décision difficile dans un contexte de gestion de projet qui illustre ce principe.",
      "En amour, elle invite à 'réfléchir avec la tête, et non avec le cœur'. Comment cela se différencie-t-il de l'approche du Roi de Cœur qui prône 'l'équilibre entre cœur et esprit' ?",
      "Expliquez comment la capacité à 'couper les liens avec quelque chose de toxique' est une forme de force et de sagesse.",
      "Si la Dame de Pique était une conseillère, quel serait son premier conseil à quelqu'un qui hésite à prendre une décision importante ?"
    ],
    "combinaisons": [
    ]
  }
];
