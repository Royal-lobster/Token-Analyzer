import { createTool } from "@iqai/adk";
import { coingeckoFetch } from "@utils";
import * as z from "zod";

// Indicators Tool
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
			const ma =
				prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
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

// Volume Analysis Tool
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
