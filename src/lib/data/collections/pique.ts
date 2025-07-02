
import type { Card } from '../cards';

export const piqueCards: Card[] = [
  {
    "id": "pique_valet",
    "nom_carte": "Valet de Pique",
    "valeur": "Valet",
    "couleur": "Pique",
    "image_url": "https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/V-pique.png",
    "symbolique_image": "Le Valet est traditionnellement un serviteur, un messager ou un subalterne. Armé d'une pique, il représente une force active mais de rang inférieur, souvent celle qui exécute les ordres ou agit dans l'ombre. Son regard peut être interprété comme fuyant ou observateur, incarnant le secret, la surveillance et la duplicité.",
    "narration_base": {
      "texte": "Voici une carte qui demande toute votre vigilance : le Valet de Pique. Dans la cartomancie traditionnelle, il est souvent surnommé 'le traître' ou 'l'espion'. Il incarne la figure de la personne fausse, de l'ami qui n'en est pas un, ou de l'individu malintentionné qui agit dans l'ombre. Il n'est pas toujours une personne physique ; il peut aussi symboliser des médisances, de mauvaises nouvelles, des pensées négatives ou des obstacles sournois qui freinent vos projets. Sa présence est un appel à la prudence et à la méfiance.",
      "ton": "prudent, pédagogue",
      "perspective": "mentor"
    },
    "phrase_cle": {
      "texte": "La trahison qui rôde, la méfiance nécessaire.",
      "usage": "Pour résumer l'avertissement central de la carte."
    },
    "mots_cles": {
      "positifs": [
        "Vigilance",
        "Prudence",
        "Mise en garde",
        "Révélation (d'une trahison)"
      ],
      "negatifs": [
        "Trahison",
        "Mensonge",
        "Hypocrisie",
        "Personne fausse",
        "Mauvaise nouvelle",
        "Médisance",
        "Espionnage",
        "Obstacle",
        "Retard",
        "Malveillance",
        "Duplicité"
      ],
      "neutres": [
        "Messager",
        "Jeune personne",
        "Doute",
        "Secret",
        "Observation"
      ],
      "priorite": [
        "Trahison",
        "Personne fausse",
        "Méfiance",
        "Obstacle"
      ]
    },
    "interpretations": {
      "general": {
        "texte": "Le Valet de Pique est l'une des cartes les plus négatives du jeu. Il annonce presque toujours une forme de duplicité ou d'obstacle. Il peut représenter une personne concrète dans votre entourage (traditionnellement un jeune homme brun, mais il ne faut pas s'y limiter) qui est hypocrite ou agit contre vos intérêts. Plus largement, il symbolise les mauvaises nouvelles, les rumeurs, les retards frustrants et les situations où la confiance est ou sera brisée. Il est le signe avant-coureur d'une déception ou d'une trahison.",
        "ton": "grave, avertisseur",
        "perspective": "mentor"
      },
      "endroit": {
        "texte": "Sa présence confirme qu'une influence négative est activement à l'œuvre. Une personne de votre entourage n'est pas sincère et pourrait vous nuire par des paroles ou des actes. Attendez-vous à des contrariétés, des nouvelles décevantes ou des blocages dans vos démarches. Cette carte vous demande d'être sur vos gardes, de ne pas partager d'informations confidentielles et d'observer attentivement les comportements autour de vous.",
        "ton": "direct, préventif",
        "perspective": "mentor"
      },
      "ombre_et_defis": {
        "texte": "Le défi du Valet de Pique est de ne pas sombrer dans la paranoïa. L'ennemi est-il réellement extérieur ? Ou cette carte reflète-t-elle vos propres doutes, votre cynisme ou vos pensées auto-sabotrices ? Parfois, le 'traître' est notre propre esprit qui nous persuade que nous allons échouer ou que personne n'est digne de confiance. Il vous interroge sur votre capacité à discerner une menace réelle d'une peur infondée.",
        "ton": "introspectif, nuancé",
        "perspective": "mentor"
      },
      "conseil": {
        "texte": "Le conseil est clair : la prudence est votre meilleure alliée. Ne faites pas confiance aveuglément. Prenez le temps d'analyser les situations et les intentions des gens. Protégez vos arrières, vos projets et vos secrets. Écoutez votre intuition, elle est probablement en train de vous signaler un danger. Ne vous engagez pas dans des médisances, car elles pourraient se retourner contre vous.",
        "ton": "stratégique, protecteur",
        "perspective": "mentor"
      }
    },
    "domaines": {
      "amour": {
        "texte": "En amour, c'est un très mauvais présage. Il annonce la trahison, l'infidélité, les mensonges ou la présence d'un rival qui cherche à nuire à votre couple. Pour un célibataire, il prévient d'une rencontre avec une personne peu fiable et mal intentionnée. Une grande déception amoureuse est à craindre.",
        "situation_type": "Infidélité, mensonge dans le couple, rivalité.",
        "scenarios_associes": [
          "Découvrir une tromperie.",
          "Apprendre que son partenaire ment.",
          "Une tierce personne sème la zizanie."
        ]
      },
      "travail": {
        "texte": "Au travail, le Valet de Pique est le collègue hypocrite, celui qui rapporte les conversations ou qui s'attribue votre travail. Il symbolise la trahison professionnelle, l'espionnage industriel à petite échelle, les coups bas et les projets qui sont sapés de l'intérieur. Méfiez-vous des alliances qui semblent trop belles pour être vraies.",
        "situation_type": "Collègue déloyal, sabotage, ambiance de travail toxique.",
        "scenarios_associes": [
          "Être victime de médisance au bureau.",
          "Un projet échoue à cause d'une 'fuite'.",
          "Se sentir surveillé ou trahi par un collaborateur."
        ]
      },
      "finances": {
        "texte": "Le risque d'escroquerie, de vol ou de fraude est très élevé. Cette carte met en garde contre les mauvais conseils financiers, les propositions malhonnêtes et les personnes cherchant à abuser de votre confiance pour vous soutirer de l'argent. Soyez extrêmement vigilant avec vos biens, vos mots de passe et les contrats que vous signez.",
        "situation_type": "Risque d'arnaque, vol, conseil financier frauduleux.",
        "scenarios_associes": [
          "Recevoir un email de phishing.",
          "Se faire voler son portefeuille ou ses données bancaires.",
          "Être poussé à un investissement douteux."
        ]
      },
      "spirituel": {
        "texte": "Sur le plan spirituel, le Valet de Pique représente l'ennemi intérieur : le doute paralysant, le cynisme, la pensée négative qui sabote toute progression. Il incarne la voix du critique intérieur qui vous dit que vous n'êtes pas à la hauteur. Le travail consiste à identifier cette voix et à ne pas la laisser prendre le contrôle de votre cheminement.",
        "situation_type": "Auto-sabotage, pensées négatives, cynisme.",
        "scenarios_associes": [
          "Procrastiner sur un projet spirituel par peur de l'échec.",
          "Se sentir bloqué par ses propres doutes.",
          "Lutter contre une vision pessimiste du monde."
        ]
      }
    },
    "prompts_visuels": [
      {
        "scene": "Une personne tend une main en signe d'amitié, tandis que son ombre derrière elle tient un poignard.",
        "symbolique": "La duplicité, la fausse amitié, l'intention cachée.",
        "usage": "Illustrer le concept de trahison et d'hypocrisie."
      },
      {
        "scene": "Un visage portant un masque souriant, mais le masque est légèrement fissuré, laissant entrevoir une expression méprisante en dessous.",
        "symbolique": "Le mensonge, la façade sociale qui cache la malveillance.",
        "usage": "Représenter la personne fausse et la médisance."
      }
    ],
    "modules_interactifs": [
      {
        "id_module": "reflexion_mefiance_pique_valet",
        "etapes": [
          {
            "type": "question_fermee",
            "contenu": "Cette carte signale une menace. Pensez à votre situation actuelle. Votre intuition vous a-t-elle récemment alerté(e) au sujet d'une personne ou d'une situation, même sans preuve concrète ?",
            "ton": "introspectif, direct",
            "reponse_attendue": "Boutons 'Oui' / 'Non' / 'Je ne suis pas sûr(e)'."
          }
        ]
      }
    ],
    "combinaisons": [
      {
        "carte_associee_id": "pique_dame",
        "signification": "Association de deux personnes malveillantes, souvent un homme et une femme plus âgée. Complot, médisance organisée, trahison à grande échelle. C'est un duo extrêmement dangereux pour le consultant.",
        "scenarios_associes": [
          "Un couple ou deux collègues qui conspirent contre vous.",
          "Calomnie et rumeurs destructrices."
        ],
        "tonalite": "Extrêmement négative"
      },
      {
        "carte_associee_id": "coeur_as",
        "signification": "La trahison pénètre le sanctuaire du foyer. Annonce une infidélité, un mensonge grave qui vient briser l'harmonie familiale, ou la présence d'un faux ami au sein de la maison.",
        "scenarios_associes": [
          "Découverte d'une liaison.",
          "Un membre de la famille se révèle être un traître."
        ],
        "tonalite": "Très négative"
      },
      {
        "carte_associee_id": "trefle_07",
        "signification": "Trahison ou malhonnêteté pour une petite somme d'argent. Vol mineur, escroquerie sur un petit montant, ou mensonge concernant des finances modestes. La perte est faible, mais la déception est grande.",
        "scenarios_associes": [
          "Un ami qui ne vous rembourse pas un petit prêt.",
          "Être floué de quelques euros lors d'une transaction."
        ],
        "tonalite": "Négative"
      },
      {
        "carte_associee_id": "carreau_valet",
        "signification": "Annonce l'arrivée imminente d'une mauvaise nouvelle par un moyen de communication (lettre, email, téléphone). La nouvelle elle-même est la trahison ou la source de la contrariété.",
        "scenarios_associes": [
          "Recevoir un courrier d'avocat ou d'huissier.",
          "Apprendre une mauvaise nouvelle par un coup de fil."
        ],
        "tonalite": "Négative et imminente"
      }
    ]
  },
  {
    "id": "pique_as",
    "nom_carte": "As de Pique",
    "valeur": "As",
    "couleur": "Pique",
    "image_url": "https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/01-pique.png",
    "symbolique_image": "La pique unique et centrale représente la pointe de l'épée, le symbole de la décision tranchante, de la vérité qui perce, et de l'action finale. C'est l'essence concentrée de l'épreuve, du conflit et de la transformation radicale. Son unicité marque le caractère absolu et non négociable de l'événement qu'il annonce.",
    "narration_base": {
      "texte": "Nous abordons ici la carte la plus redoutée et la plus puissante du jeu : l'As de Pique. Ne vous laissez pas effrayer par sa réputation de 'carte de la mort'. En cartomancie, sa signification est bien plus nuancée. Elle est avant tout la carte de la finalité, de la décision tranchante et irrévocable. Elle annonce une fin, certes, mais cette fin est souvent nécessaire pour permettre un nouveau départ. Elle peut représenter un grand choc, une épreuve capitale, un acte officiel (contrat, jugement), ou une transformation profonde et inévitable.",
      "ton": "sérieux, pédagogue, rassurant",
      "perspective": "mentor"
    },
    "phrase_cle": {
      "texte": "La fin inévitable, la décision tranchante.",
      "usage": "Pour synthétiser son rôle de point de rupture et de verdict final."
    },
    "mots_cles": {
      "positifs": [
        "Libération",
        "Transformation",
        "Clarté",
        "Verdict (favorable)",
        "Décision nécessaire"
      ],
      "negatifs": [
        "Fin",
        "Rupture",
        "Deuil",
        "Crise",
        "Conflit majeur",
        "Chagrin",
        "Décision douloureuse",
        "Épreuve capitale",
        "Échec",
        "Séparation"
      ],
      "neutres": [
        "Acte officiel",
        "Contrat",
        "Jugement",
        "Finalité",
        "Verdict",
        "Changement radical"
      ],
      "priorite": [
        "Fin",
        "Décision",
        "Transformation",
        "Épreuve"
      ]
    },
    "interpretations": {
      "general": {
        "texte": "L'As de Pique annonce un événement majeur qui met un point final à une situation. C'est le climax d'une passion, d'un conflit ou d'une période de vie. Il impose une conclusion, qu'elle soit désirée ou subie. Il peut s'agir d'une grande nouvelle qui bouleverse tout, d'un choix difficile mais nécessaire, ou d'un acte légal ou administratif qui scelle un destin (divorce, contrat, testament). L'énergie de cette carte est absolue et puissante.",
        "ton": "grave, solennel",
        "perspective": "mentor"
      },
      "endroit": {
        "texte": "Sa présence annonce une période de transition intense. Une décision capitale doit être prise ou va vous être imposée. Une situation arrive à son terme, vous forçant à tourner la page. Cela peut être douloureux, comme une séparation ou la fin d'un projet, mais c'est une étape inéluctable pour votre évolution. Il peut aussi s'agir de la signature d'un document aux conséquences importantes.",
        "ton": "direct, factuel",
        "perspective": "mentor"
      },
      "ombre_et_defis": {
        "texte": "Le défi de l'As de Pique est d'accepter ce qui ne peut être changé. S'opposer à son énergie, c'est risquer de rendre la fin encore plus destructrice. Son ombre est la peur de la fin, le refus de la vérité qui mène à la stagnation. La crise qu'il annonce peut être vécue comme une destruction pure et simple si l'on ne parvient pas à voir la libération et le potentiel de renouveau qu'elle contient. La question est : comment allez-vous traverser cette épreuve finale ?",
        "ton": "profond, philosophique",
        "perspective": "mentor"
      },
      "conseil": {
        "texte": "Le conseil est d'agir avec courage et lucidité. Ne fuyez pas la décision qui s'impose. Il est temps de trancher, de couper les liens qui ne sont plus viables. Acceptez la fin pour pouvoir construire sur de nouvelles bases. Soyez honnête avec vous-même et avec les autres. C'est en faisant face à la vérité, même si elle est difficile, que vous trouverez la force de vous réinventer.",
        "ton": "encourageant, directif",
        "perspective": "mentor"
      }
    },
    "domaines": {
      "amour": {
        "texte": "En amour, il annonce souvent une rupture, une séparation définitive ou un divorce. C'est la fin d'une relation. La décision est tranchée et il y a peu de chances de retour en arrière. Dans des cas plus rares, il peut signifier une passion dévorante et exclusive, qui isole du reste du monde, mais son message premier reste celui de la conclusion.",
        "situation_type": "Rupture, divorce, fin d'un cycle amoureux.",
        "scenarios_associes": [
          "Prendre la décision de se séparer.",
          "Signer les papiers du divorce.",
          "Mettre un terme à une relation toxique."
        ]
      },
      "travail": {
        "texte": "Cette carte signale une fin de contrat, un licenciement, une démission, ou l'arrêt brutal d'un projet. C'est une coupure nette dans le parcours professionnel. Il peut aussi s'agir d'un conflit majeur qui atteint son paroxysme, forçant une décision radicale. Parfois, il représente la signature d'un contrat très engageant qui change la carrière de façon irréversible.",
        "situation_type": "Fin de contrat, licenciement, décision professionnelle majeure.",
        "scenarios_associes": [
          "Recevoir une lettre de licenciement.",
          "Décider de démissionner pour changer complètement de voie.",
          "L'échec final d'un projet important."
        ]
      },
      "finances": {
        "texte": "L'As de Pique est souvent lié à des questions légales et financières. Il peut annoncer un jugement final concernant de l'argent, la signature d'un testament, ou la conclusion d'une affaire de succession. Il peut indiquer une perte financière importante et définitive, ou au contraire, un verdict qui met fin à un long litige financier.",
        "situation_type": "Verdict légal financier, testament, perte sèche.",
        "scenarios_associes": [
          "Le jugement d'un procès est rendu.",
          "Lecture d'un testament.",
          "Clôturer un compte ou déclarer une faillite."
        ]
      },
      "spirituel": {
        "texte": "C'est l'expérience de la 'nuit noire de l'âme'. Une crise existentielle profonde qui brise les anciennes croyances et force à une réévaluation complète de sa vie et de ses valeurs. C'est une épreuve spirituelle intense, mais c'est de cette 'mort' symbolique que peut naître une conscience nouvelle, plus authentique et plus forte. C'est la vérité qui détruit l'illusion.",
        "situation_type": "Crise existentielle, perte de foi, renaissance spirituelle.",
        "scenarios_associes": [
          "Remettre en question toutes ses certitudes.",
          "Traverser une période de désespoir pour trouver un nouveau sens.",
          "Avoir une révélation qui change tout."
        ]
      }
    },
    "prompts_visuels": [
      {
        "scene": "Un marteau de juge sur le point de frapper son socle, avec un document officiel (contrat, verdict) posé à côté.",
        "symbolique": "Le jugement final, la décision irrévocable, l'acte officiel.",
        "usage": "Illustrer l'aspect légal et décisionnel de la carte."
      },
      {
        "scene": "Un pont en pierre qui s'effondre au milieu, coupant la route entre deux rives.",
        "symbolique": "La rupture, la fin d'un lien, l'impossibilité de revenir en arrière.",
        "usage": "Représenter le concept de séparation et de fin définitive."
      }
    ],
    "modules_interactifs": [
      {
        "id_module": "reflexion_decision_pique_as",
        "etapes": [
          {
            "type": "question_ouverte",
            "contenu": "L'As de Pique vous confronte à une fin nécessaire. S'il y avait une situation, une relation ou une croyance dans votre vie que vous savez devoir abandonner pour avancer, laquelle serait-ce ? Qu'est-ce qui vous empêche de prendre cette décision ?",
            "ton": "introspectif, courageux",
            "reponse_attendue": "Texte libre de réflexion personnelle."
          }
        ]
      }
    ],
    "combinaisons": [
      {
        "carte_associee_id": "pique_09",
        "signification": "C'est la combinaison la plus sombre du jeu. Elle annonce un échec cuisant, un deuil, une grande tristesse ou une fatalité. Traditionnellement, elle est associée à l'annonce d'un décès ou d'une catastrophe inévitable.",
        "scenarios_associes": [
          "Deuil, perte irréparable.",
          "Échec total d'une entreprise de vie."
        ],
        "tonalite": "Extrêmement négative"
      },
      {
        "carte_associee_id": "coeur_as",
        "signification": "Passion dévorante et potentiellement destructrice, ou une décision radicale qui bouleverse le foyer. Souvent, elle indique un divorce ou une séparation qui est vécue avec une intensité émotionnelle extrême.",
        "scenarios_associes": [
          "Divorce passionnel.",
          "Fin brutale d'une grande histoire d'amour."
        ],
        "tonalite": "Intense et décisive"
      },
      {
        "carte_associee_id": "trefle_roi",
        "signification": "Une décision finale et autoritaire est prise par un homme de pouvoir (patron, juge, médecin, père). Le consultant subit cette décision qui a des conséquences majeures sur sa vie.",
        "scenarios_associes": [
          "Un juge rend son verdict.",
          "Un patron annonce un licenciement."
        ],
        "tonalite": "Décisive et officielle"
      },
      {
        "carte_associee_id": "carreau_10",
        "signification": "Une décision finale (As de Pique) est prise concernant une grosse somme d'argent ou un grand voyage (Dix de Carreau). Cela peut être un verdict de procès avec de gros enjeux financiers, ou la décision finale de s'expatrier.",
        "scenarios_associes": [
          "Signature finale d'un acte de vente immobilière important.",
          "Décision de tout quitter pour déménager à l'étranger."
        ],
        "tonalite": "Impact majeur"
      }
    ]
  }
]

    