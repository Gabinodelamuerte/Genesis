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
      res.json({
        price: result.regularMarketPrice,
        change: result.regularMarketChangePercent,
        name: result.shortName || result.longName,
        currency: result.currency
      });
    } catch (error) {
      console.error(`Error fetching stock ${req.params.symbol}:`, error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  // API Route for Financial Advice
  app.post("/api/advice", async (req, res) => {
    try {
      const { userContext } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Tu es Genesis, un coach financier intelligent et bienveillant pour les jeunes. 
        Voici le contexte de l'utilisateur : ${JSON.stringify(userContext)}.
        Donne-lui 3 conseils personnalisés, courts et motivants pour améliorer sa situation financière ou son apprentissage. 
        Réponds en français, avec un ton moderne et encourageant. Utilise des emojis.`,
        config: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
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
        contents: `Tu es Genesis, un coach financier expert. 
        Contexte de l'utilisateur : ${JSON.stringify(userContext)}.
        Question de l'utilisateur : ${question}
        Réponds de manière pédagogique, simple et précise en français.`,
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
