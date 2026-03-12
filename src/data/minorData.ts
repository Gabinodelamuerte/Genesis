export const THEMES = [
  { id: 'bases', title: "Les bases de l'argent", description: "Comprendre le fonctionnement de l'argent, l'inflation et l'épargne.", icon: '💰', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { id: 'assets', title: "Investir son argent", description: "Découvrir les actions, les ETF, les obligations et la crypto.", icon: '📈', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'risk', title: "Gérer les risques", description: "Apprendre à diversifier et comprendre la magie des intérêts composés.", icon: '🛡️', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { id: 'life', title: "Projets de vie & Quotidien", description: "Préparer son indépendance : budget, crédits, impôts.", icon: '🌍', color: 'text-orange-400', bg: 'bg-orange-500/20' },
];

export const MODULES = [
  // THEME: BASES
  {
    id: 'budget-101',
    themeId: 'bases',
    title: "Gérer son budget (La règle des 50/30/20)",
    desc: "Comment répartir son argent intelligemment ?",
    xpReward: 100,
    moneyReward: 50,
    content: "Gérer son budget, c'est savoir où va son argent. Une méthode très connue est la règle des 50/30/20 :\n\n- 50% pour les besoins (logement, nourriture, factures)\n- 30% pour les envies (sorties, shopping, loisirs)\n- 20% pour l'épargne et l'investissement\n\nEn appliquant cette règle dès ton premier salaire, tu t'assures de toujours mettre de l'argent de côté sans te priver de vivre !",
    quiz: {
      question: "Selon la règle des 50/30/20, quel pourcentage de tes revenus devrais-tu épargner ou investir ?",
      options: ["10%", "20%", "30%", "50%"],
      correctAnswer: 1
    }
  },
  {
    id: 'epargne-precaution',
    themeId: 'bases',
    title: "L'épargne de précaution",
    desc: "Pourquoi garder de l'argent de côté ?",
    xpReward: 100,
    moneyReward: 50,
    content: "L'épargne de précaution, c'est ton matelas de sécurité. Imagine que ton téléphone tombe en panne ou que tu aies une dépense imprévue. Au lieu de stresser ou de devoir emprunter, tu utilises cet argent mis de côté spécialement pour les coups durs.\n\nEn général, on recommande d'avoir l'équivalent de 3 à 6 mois de dépenses de côté sur un livret disponible immédiatement (comme le Livret A ou le Livret Jeune).",
    quiz: {
      question: "À quoi sert principalement l'épargne de précaution ?",
      options: [
        "À acheter le dernier iPhone dès sa sortie",
        "À faire face aux dépenses imprévues et coups durs",
        "À investir en bourse pour devenir riche",
        "À payer ses impôts"
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'inflation',
    themeId: 'bases',
    title: "L'inflation : le voleur invisible",
    desc: "Pourquoi les prix montent ?",
    xpReward: 150,
    moneyReward: 100,
    content: "L'inflation, c'est l'augmentation générale des prix au fil du temps. Si l'inflation est de 2% par an, une baguette qui coûte 1€ aujourd'hui coûtera 1,02€ l'année prochaine.\n\nLe problème ? Si tu laisses ton argent dormir sur un compte courant qui ne rapporte rien (0%), ton argent perd de sa valeur (son pouvoir d'achat diminue). C'est pour ça qu'il faut investir !",
    quiz: {
      question: "Que se passe-t-il si l'inflation est de 5% et que ton argent est sur un compte à 0% ?",
      options: [
        "Ton argent gagne de la valeur",
        "Ton pouvoir d'achat diminue de 5%",
        "La banque te donne 5%",
        "Rien ne change"
      ],
      correctAnswer: 1
    }
  },

  // THEME: ASSETS
  {
    id: 'actions-intro',
    themeId: 'assets',
    title: "Les Actions d'entreprises",
    desc: "Devenir propriétaire d'une multinationale.",
    xpReward: 200,
    moneyReward: 100,
    content: "Une action est un titre de propriété. Quand tu achètes une action Apple, tu deviens propriétaire d'une (toute petite) partie d'Apple. \n\nTu peux gagner de l'argent de deux façons : \n1. La valeur de l'action monte (plus-value).\n2. L'entreprise te reverse une partie de ses bénéfices (les dividendes).",
    quiz: {
      question: "Qu'est-ce qu'un dividende ?",
      options: [
        "Une taxe à payer à l'État",
        "Une partie des bénéfices reversée aux actionnaires",
        "Le prix d'achat de l'action",
        "Une debt de l'entreprise"
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'etf-intro',
    themeId: 'assets',
    title: "Comprendre les ETF",
    desc: "Investir dans le monde entier facilement.",
    xpReward: 200,
    moneyReward: 150,
    content: "Un ETF (Exchange Traded Fund), ou tracker, est un panier d'actions. Au lieu d'acheter une action Apple, une action Microsoft et une action Amazon séparément (ce qui coûte très cher), tu achètes une part d'un ETF qui contient un petit bout de toutes ces entreprises.\n\nC'est la méthode la plus simple et la moins risquée pour investir en bourse car tu diversifies tes investissements : si une entreprise va mal, les autres compensent.",
    quiz: {
      question: "Quel est le principal avantage d'un ETF ?",
      options: [
        "Il garantit de ne jamais perdre d'argent",
        "Il permet de diversifier ses investissements facilement",
        "Il coûte plus cher que d'acheter des actions individuelles",
        "Il est réservé aux experts financiers"
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'obligations',
    themeId: 'assets',
    title: "Les Obligations",
    desc: "Prêter de l'argent aux États ou entreprises.",
    xpReward: 150,
    moneyReward: 100,
    content: "Une obligation, c'est un prêt. Quand tu achètes une obligation de l'État français, tu prêtes de l'argent à la France. En échange, l'État s'engage à te rembourser à une date précise et à te payer des intérêts réguliers (les coupons).\n\nC'est généralement moins risqué que les actions, mais ça rapporte aussi moins.",
    quiz: {
      question: "Quand tu achètes une obligation, tu es :",
      options: [
        "Propriétaire de l'entreprise",
        "Prêteur (créancier)",
        "Endetté",
        "Actionnaire"
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'crypto-intro',
    themeId: 'assets',
    title: "Les Cryptomonnaies (Bitcoin, etc.)",
    desc: "Le Far West de la finance.",
    xpReward: 250,
    moneyReward: 150,
    content: "Les cryptomonnaies comme le Bitcoin ou l'Ethereum sont des monnaies numériques décentralisées (sans banque centrale). Elles fonctionnent grâce à la technologie de la blockchain.\n\nAttention : C'est un investissement EXTRÊMEMENT risqué et très volatil. Tu peux gagner beaucoup, mais aussi tout perdre très vite. Il ne faut investir que l'argent que tu es prêt à perdre.",
    quiz: {
      question: "Quelle est la principale caractéristique des cryptomonnaies ?",
      options: [
        "Elles sont garanties par l'État",
        "Elles ne comportent aucun risque",
        "Elles sont très volatiles et risquées",
        "Elles rapportent toujours 10% par an"
      ],
      correctAnswer: 2
    }
  },

  // THEME: RISK
  {
    id: 'interets-composes',
    themeId: 'risk',
    title: "La magie des intérêts composés",
    desc: "Faire travailler ton argent pour toi.",
    xpReward: 300,
    moneyReward: 200,
    content: "Albert Einstein aurait dit que les intérêts composés sont la 8ème merveille du monde. Le principe est simple : les intérêts que tu gagnes génèrent eux-mêmes de nouveaux intérêts l'année suivante.\n\nExemple : Tu places 100€ à 10%. \nAnnée 1 : Tu gagnes 10€ (Total = 110€).\nAnnée 2 : Tu gagnes 10% sur 110€, soit 11€ (Total = 121€).\nPlus tu commences tôt, plus l'effet boule de neige est puissant !",
    quiz: {
      question: "Quel est le secret pour profiter au maximum des intérêts composés ?",
      options: [
        "Investir une énorme somme d'un coup",
        "Commencer le plus tôt possible et être patient",
        "Retirer ses gains tous les ans",
        "Changer d'investissement tous les mois"
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'diversification',
    themeId: 'risk',
    title: "Ne pas mettre tous ses œufs dans le même panier",
    desc: "La règle d'or de l'investisseur.",
    xpReward: 200,
    moneyReward: 150,
    content: "La diversification consiste à répartir ton argent sur différents types d'investissements (actions, obligations, immobilier), dans différents secteurs (technologie, santé, énergie) et différentes zones géographiques (Europe, USA, Asie).\n\nPourquoi ? Parce que si un secteur s'effondre, les autres secteurs de ton portefeuille pourront compenser la perte. C'est la meilleure façon de réduire le risque.",
    quiz: {
      question: "Qu'est-ce que la diversification ?",
      options: [
        "Acheter uniquement des actions Apple",
        "Répartir son argent sur différents investissements pour réduire le risque",
        "Garder tout son argent en liquide sous son matelas",
        "Emprunter de l'argent pour investir plus"
      ],
      correctAnswer: 1
    }
  },

  // THEME: LIFE
  {
    id: 'credit-conso',
    themeId: 'life',
    title: "Le crédit consommation : le piège ?",
    desc: "Acheter maintenant, payer (plus cher) plus tard.",
    xpReward: 150,
    moneyReward: 100,
    content: "Un crédit à la consommation te permet d'acheter un bien (voiture, télé, voyage) avec de l'argent que tu n'as pas encore, en remboursant chaque mois avec des intérêts.\n\nAttention : Les taux d'intérêts sont souvent très élevés (parfois plus de 15% !). Au final, ton achat te coûtera beaucoup plus cher que si tu avais économisé avant. Règle d'or : on n'emprunte pas pour consommer, on emprunte seulement pour investir (comme acheter un appartement).",
    quiz: {
      question: "Pourquoi faut-il éviter les crédits à la consommation pour acheter une télé ?",
      options: [
        "Parce que la télé va casser",
        "Parce que les intérêts rendent l'achat beaucoup plus cher au final",
        "Parce que c'est illégal avant 25 ans",
        "Parce que la banque va reprendre la télé"
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'impots-intro',
    themeId: 'life',
    title: "Comprendre les impôts",
    desc: "À quoi ça sert et comment ça marche ?",
    xpReward: 200,
    moneyReward: 150,
    content: "Les impôts servent à financer les services publics : les écoles, les hôpitaux, les routes, la police, etc.\n\nIl existe plusieurs types d'impôts : \n- La TVA (Taxe sur la Valeur Ajoutée) : tu la paies chaque fois que tu achètes quelque chose dans un magasin.\n- L'impôt sur le revenu : payé par les travailleurs sur leur salaire.\n- Les impôts sur les plus-values : quand tu gagnes de l'argent en bourse, l'État en prend une partie (la 'Flat Tax' est de 30% en France).",
    quiz: {
      question: "Quel impôt paies-tu tous les jours sans t'en rendre compte en achetant une baguette ou un jeu vidéo ?",
      options: [
        "L'impôt sur la fortune",
        "L'impôt sur le revenu",
        "La TVA (Taxe sur la Valeur Ajoutée)",
        "La taxe foncière"
      ],
      correctAnswer: 2
    }
  },
  {
    id: 'premier-salaire',
    themeId: 'life',
    title: "Gérer son premier salaire",
    desc: "Brut vs Net, et comment bien démarrer.",
    xpReward: 250,
    moneyReward: 200,
    content: "Quand tu signeras ton premier contrat de travail, le salaire affiché sera le salaire 'Brut'. Mais ce que tu recevras réellement sur ton compte bancaire, c'est le salaire 'Net' (environ 22% de moins).\n\nLa différence ? Ce sont les cotisations sociales, qui servent à payer ta retraite, le chômage et la sécurité sociale (quand tu vas chez le médecin).\n\nDès ton premier salaire net reçu, n'oublie pas de te payer en premier : mets 20% de côté avant même de commencer à dépenser !",
    quiz: {
      question: "Quelle est la différence entre le salaire brut et le salaire net ?",
      options: [
        "Le brut est pour les cadres, le net pour les employés",
        "Le net est ce que tu reçois sur ton compte après déduction des cotisations sociales",
        "Le brut est payé en liquide, le net par virement",
        "Il n'y a aucune différence"
      ],
      correctAnswer: 1
    }
  }
];

export const ASSETS_CATALOG = [
  { id: 'a1', name: 'S&P 500 ETF', symbol: 'SPY', type: 'ETF', price: 450.20, risk: 'Moyen', trend: '+1.2%' },
  { id: 'a2', name: 'MSCI World ETF', symbol: 'CW8.PA', type: 'ETF', price: 420.50, risk: 'Faible', trend: '+0.8%' },
  { id: 'a3', name: 'Apple Inc.', symbol: 'AAPL', type: 'Action', price: 175.50, risk: 'Moyen', trend: '+2.4%' },
  { id: 'a4', name: 'LVMH', symbol: 'MC.PA', type: 'Action', price: 820.10, risk: 'Moyen', trend: '-0.5%' },
  { id: 'a5', name: 'Lyxor Euro Government Bond', symbol: 'LYXB.PA', type: 'Obligation', price: 145.00, risk: 'Très Faible', trend: '+0.1%' },
  { id: 'a6', name: 'Bitcoin', symbol: 'BTC-USD', type: 'Crypto', price: 65000.00, risk: 'Très Élevé', trend: '+5.6%' },
  { id: 'a7', name: 'Ethereum', symbol: 'ETH-USD', type: 'Crypto', price: 3500.00, risk: 'Très Élevé', trend: '-2.1%' },
  { id: 'a8', name: 'ETF Énergies Renouvelables', symbol: 'NRJ.PA', type: 'ETF', price: 45.30, risk: 'Élevé', trend: '+3.2%' },
];

export const REWARDS = [
  { id: 'r1', title: 'Carte Bancaire Premium (18 ans)', xpRequired: 500, icon: '💳' },
  { id: 'r2', title: 'Prime de bienvenue de 50€', xpRequired: 1000, icon: '🎁' },
  { id: 'r3', title: 'Frais de courtage offerts (6 mois)', xpRequired: 1500, icon: '📈' },
  { id: 'r4', title: 'Rendez-vous avec un conseiller VIP', xpRequired: 2000, icon: '👨‍💼' },
  { id: 'r5', title: 'Accès aux investissements exclusifs', xpRequired: 2500, icon: '🌟' },
];
