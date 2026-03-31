import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import YahooFinance from 'yahoo-finance2';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const yahooFinance = new YahooFinance();

  app.use(express.json());

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
