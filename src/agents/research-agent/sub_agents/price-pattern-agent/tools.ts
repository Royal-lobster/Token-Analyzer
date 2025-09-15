import { createTool } from "@iqai/adk";
import { coingeckoFetch } from "@utils";
import * as z from "zod";

// Trend Analysis Tool
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

// Support/Resistance Tool
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

// Chart Patterns Tool
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
