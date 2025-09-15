import { createTool } from "@iqai/adk";
import * as z from "zod";

// 1. Trend Analysis Tool
export const trendAnalysisTool = createTool({
	name: "trend_analysis",
	description:
		"Identify current price trend for a crypto asset (bullish, bearish, sideways)",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id, e.g. 'bitcoin'"),
		days: z.number().default(30).describe("Number of days for trend analysis"),
	}),
	fn: async ({ coinId, days }) => {
		try {
			const data = (await coingeckoFetch(
				`coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
			)) as { prices: [number, number][] };
			const prices = data.prices.map((pair) => pair[1]);
			const start = prices[0],
				end = prices[prices.length - 1];
			const pct = ((end - start) / start) * 100;
			if (pct > 5) return `Bullish (+${pct.toFixed(2)}%)`;
			if (pct < -5) return `Bearish (${pct.toFixed(2)}%)`;
			return `Sideways (${pct.toFixed(2)}%)`;
		} catch {
			return "Trend analysis unavailable.";
		}
	},
});

// 2. Support/Resistance Tool (simple: recent high/low)
export const supportResistanceTool = createTool({
	name: "support_resistance",
	description: "Get key support and resistance levels for a crypto asset",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id"),
		days: z.number().default(30).describe("Number of days to analyze"),
	}),
	fn: async ({ coinId, days }) => {
		try {
			const data = (await coingeckoFetch(
				`coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
			)) as { prices: [number, number][] };
			const prices = data.prices.map((pair) => pair[1]);
			const support = Math.min(...prices);
			const resistance = Math.max(...prices);
			return `Support: $${support.toFixed(2)}, Resistance: $${resistance.toFixed(2)}`;
		} catch {
			return "Support/resistance unavailable.";
		}
	},
});

// 3. Chart Patterns Tool (simple: detect double top/bottom)
export const chartPatternsTool = createTool({
	name: "chart_patterns",
	description:
		"Detect simple chart patterns (double top/bottom) for a crypto asset",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id"),
		days: z.number().default(30).describe("Number of days to analyze"),
	}),
	fn: async ({ coinId, days }) => {
		try {
			const data = (await coingeckoFetch(
				`coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
			)) as { prices: [number, number][] };
			const prices = data.prices.map((pair) => pair[1]);
			// Naive double top/bottom detection
			const mid = Math.floor(prices.length / 2);
			const firstPeak = Math.max(...prices.slice(0, mid));
			const secondPeak = Math.max(...prices.slice(mid));
			const firstTrough = Math.min(...prices.slice(0, mid));
			const secondTrough = Math.min(...prices.slice(mid));
			let pattern = "No clear pattern detected.";
			if (Math.abs(firstPeak - secondPeak) / firstPeak < 0.03)
				pattern = "Double Top pattern detected.";
			if (Math.abs(firstTrough - secondTrough) / firstTrough < 0.03)
				pattern = "Double Bottom pattern detected.";
			return pattern;
		} catch {
			return "Chart pattern analysis unavailable.";
		}
	},
});

// 4. Indicators Tool (RSI, simple MA)
export const indicatorsTool = createTool({
	name: "indicators",
	description: "Get technical indicators (RSI, MA) for a crypto asset",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id"),
		days: z.number().default(14).describe("Number of days for RSI/MA"),
	}),
	fn: async ({ coinId, days }) => {
		try {
			const data = (await coingeckoFetch(
				`coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
			)) as { prices: [number, number][] };
			const prices = data.prices.map((pair) => pair[1]);
			// Simple MA
			const ma =
				prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
			// RSI (naive)
			let gains = 0,
				losses = 0;
			for (let i = 1; i < prices.length; i++) {
				const diff = prices[i] - prices[i - 1];
				if (diff > 0) gains += diff;
				else losses -= diff;
			}
			const avgGain = gains / days;
			const avgLoss = losses / days;
			const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
			const rsi = 100 - 100 / (1 + rs);
			return `MA: $${ma.toFixed(2)}, RSI: ${rsi.toFixed(2)}`;
		} catch {
			return "Indicator analysis unavailable.";
		}
	},
});

// 5. Volume Analysis Tool
export const volumeAnalysisTool = createTool({
	name: "volume_analysis",
	description: "Analyze trading volume patterns for a crypto asset",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id"),
		days: z.number().default(30).describe("Number of days to analyze"),
	}),
	fn: async ({ coinId, days }) => {
		try {
			const data = (await coingeckoFetch(
				`coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
			)) as { total_volumes: [number, number][] };
			const volumes = data.total_volumes.map((pair) => pair[1]);
			const avgVol =
				volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length;
			const maxVol = Math.max(...volumes);
			const minVol = Math.min(...volumes);
			return `Avg Vol: ${avgVol.toFixed(0)}, Max Vol: ${maxVol.toFixed(0)}, Min Vol: ${minVol.toFixed(0)}`;
		} catch {
			return "Volume analysis unavailable.";
		}
	},
});

// 6. Market Sentiment Tool (uses Coingecko's sentiment data)
export const marketSentimentTool = createTool({
	name: "market_sentiment",
	description:
		"Get market sentiment for a crypto asset (Coingecko up/down votes)",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id"),
	}),
	fn: async ({ coinId }) => {
		try {
			const data = (await coingeckoFetch(`coins/${coinId}`)) as {
				sentiment_votes_up_percentage: number;
				sentiment_votes_down_percentage: number;
			};
			const up = data.sentiment_votes_up_percentage;
			const down = data.sentiment_votes_down_percentage;
			return `Up votes: ${up}%, Down votes: ${down}%`;
		} catch {
			return "Market sentiment unavailable.";
		}
	},
});

// Helper: Fetch from Coingecko with simple in-memory cache
const coingeckoCache = new Map<string, unknown>();
async function coingeckoFetch(endpoint: string) {
	const url = `https://api.coingecko.com/api/v3/${endpoint}`;
	if (coingeckoCache.has(url)) {
		return coingeckoCache.get(url);
	}
	const res = await fetch(url);
	if (!res.ok) throw new Error("Coingecko API error");
	const json = await res.json();
	coingeckoCache.set(url, json);
	return json;
}
