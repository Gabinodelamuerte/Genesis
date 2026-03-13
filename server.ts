import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import YahooFinance from 'yahoo-finance2';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const yahooFinance = new YahooFinance();

  app.use(express.json());

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // API Route for Stock Prices
  app.get("/api/stock/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const result = await yahooFinance.quote(symbol) as any;
      
      if (!result) {
        return res.status(404).json({ error: "Stock not found" });
      }

      res.json({
        price: result.regularMarketPrice || result.price || 0,
        change: result.regularMarketChangePercent || 0,
        name: result.shortName || result.longName || symbol,
        currency: result.currency || 'EUR'
      });
    } catch (error) {
      console.error(`Error fetching stock ${req.params.symbol}:`, error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  // API Route for Historical Stock Data
  app.get("/api/stock/:symbol/history", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { range } = req.query; // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
      
      const rangeMap: Record<string, number> = {
        '1h': 4 * 3600 * 1000, // Show last 4 hours for '1h' filter
        '1j': 24 * 3600 * 1000,
        '1s': 7 * 24 * 3600 * 1000,
        '1m': 30 * 24 * 3600 * 1000,
        '1a': 365 * 24 * 3600 * 1000,
        'all': 10 * 365 * 24 * 3600 * 1000
      };

      const duration = rangeMap[range as string] || rangeMap['1m'];
      const period1 = new Date(Date.now() - duration);
      
      const interval = duration <= rangeMap['1j'] ? '2m' : (duration <= rangeMap['1s'] ? '15m' : '1d');

      const result = await yahooFinance.chart(symbol, {
        period1: period1,
        interval: interval as any
      });

      const history = result.quotes.map(q => ({
        date: q.date instanceof Date ? q.date.getTime() : new Date(q.date).getTime(),
        value: q.close || q.open || q.adjClose
      })).filter(q => q.value !== null && !isNaN(q.date));

      res.json(history);
    } catch (error) {
      console.error(`Error fetching history for ${req.params.symbol}:`, error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // API Route for Financial Advice
  app.post("/api/advice", async (req, res) => {
    try {
      const { userContext } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Tu es Genesis, un coach financier intelligent et bienveillant. 
        Voici le contexte de l'utilisateur : ${JSON.stringify(userContext)}.
        Donne-lui un message d'accueil très court (max 2 phrases) et propose-lui 3 pistes de réflexion ou questions rapides sous forme de liste à puces pour l'aider à démarrer.
        Sois très aéré avec des sauts de ligne.
        Réponds en français, avec un ton moderne. Utilise des emojis.`,
        config: {
          temperature: 0.7,
        },
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Error in /api/advice:", error);
      res.status(500).json({ error: "Failed to get advice" });
    }
  });

  // API Route for Financial Questions
  app.post("/api/ask", async (req, res) => {
    try {
      const { question, userContext } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Tu es Genesis, un coach financier expert, moderne et pédagogique.
        
        TON STYLE :
        - Très aéré : utilise beaucoup de sauts de ligne pour ne pas faire de "blocs" de texte.
        - Concis : ne donne pas tout d'un coup. Si une question est large (ex: "quels sont les avantages ?"), identifie les différentes catégories et demande à l'utilisateur laquelle l'intéresse avant de détailler.
        - Interactif : pose souvent des questions à la fin de tes messages pour guider l'utilisateur.
        - Humain : utilise des emojis et un ton complice.
        
        CONSIGNE SPÉCIFIQUE :
        Si l'utilisateur pose une question ambiguë ou vaste, réponds par une brève introduction suivie d'une liste de choix/catégories et demande-lui de préciser. Ne sors la "grande explication" que lorsqu'il a choisi son sujet.
        
        Contexte de l'utilisateur : ${JSON.stringify(userContext)}.
        Question de l'utilisateur : ${question}
        
        Réponds en français.`,
        config: {
          temperature: 0.7,
        },
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Error in /api/ask:", error);
      res.status(500).json({ error: "Failed to answer question" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
