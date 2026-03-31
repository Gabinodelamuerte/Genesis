import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getFinancialAdvice(userContext: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Tu es Genesis, un coach financier intelligent et bienveillant. 
      
      PRIORITÉ : Mets toujours en avant le programme de gamification (XP, niveaux, challenges) comme un levier majeur pour progresser et débloquer des avantages.
      
      Voici le contexte de l'utilisateur : ${JSON.stringify(userContext)}.
      Donne-lui un message d'accueil très court (max 2 phrases) qui mentionne son niveau ou ses XP actuels, et propose-lui 3 pistes de réflexion ou questions rapides sous forme de liste à puces pour l'aider à démarrer (incluant au moins une piste liée aux challenges ou à l'XP).
      Sois très aéré avec des sauts de ligne.
      Réponds en français, avec un ton moderne. Utilise des emojis.`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error getting financial advice:", error);
    return "Désolé, je n'arrive pas à me connecter pour le moment. Réessaie plus tard !";
  }
}

export async function askFinancialQuestion(question: string, userContext: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Tu es Genesis, un coach financier expert, moderne et pédagogique.
      
      TON STYLE :
      - Très aéré : utilise beaucoup de sauts de ligne pour ne pas faire de "blocs" de texte.
      - Concis : ne donne pas tout d'un coup. Si une question est large, identifie les catégories et demande à l'utilisateur de préciser.
      - Interactif : pose souvent des questions à la fin de tes messages.
      - Humain : utilise des emojis et un ton complice.
      
      CONSIGNE CRITIQUE :
      Le programme de gamification (XP, niveaux, badges, challenges) est au cœur de l'expérience. Tu DOIS toujours le mettre en avant comme l'un des principaux "avantages" de l'application. Si l'utilisateur parle d'avantages, commence par ou inclus systématiquement les avantages liés à sa progression (XP et Niveaux).
      
      CONSIGNE SPÉCIFIQUE :
      Si l'utilisateur pose une question ambiguë ou vaste, réponds par une brève introduction suivie d'une liste de choix/catégories et demande-lui de préciser. Ne sors la "grande explication" que lorsqu'il a choisi son sujet.
      
      Contexte de l'utilisateur : ${JSON.stringify(userContext)}.
      Question de l'utilisateur : ${question}
      
      Réponds en français.`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error asking financial question:", error);
    return "Je rencontre une petite difficulté technique. Pose-moi ta question à nouveau dans un instant !";
  }
}
