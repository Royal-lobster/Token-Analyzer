import { createTool } from "@iqai/adk";
import { coingeckoFetch } from "@utils";
import * as z from "zod";

// Market Overview Tool
export const marketOverviewTool = createTool({
	name: "market_overview",
	description:
		"Get comprehensive market data for a crypto asset including price, market cap, volume, etc.",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id, e.g. 'bitcoin'"),
	}),
	fn: async ({ coinId }) => {
		try {
			const data = (await coingeckoFetch(`coins/${coinId}`)) as {
				current_price: { usd: number };
				market_cap: { usd: number };
				total_volume: { usd: number };
				price_change_percentage_24h: number;
				price_change_percentage_7d: number;
				price_change_percentage_30d: number;
				market_cap_rank: number;
				circulating_supply: number;
				total_supply: number;
				max_supply: number;
			};

			return {
				price: `$${data.current_price.usd.toFixed(2)}`,
				market_cap: `$${(data.market_cap.usd / 1e9).toFixed(2)}B`,
				volume_24h: `$${(data.total_volume.usd / 1e6).toFixed(2)}M`,
				price_change_24h: `${data.price_change_percentage_24h?.toFixed(2)}%`,
				price_change_7d: `${data.price_change_percentage_7d?.toFixed(2)}%`,
				price_change_30d: `${data.price_change_percentage_30d?.toFixed(2)}%`,
				market_cap_rank: data.market_cap_rank,
				circulating_supply: data.circulating_supply?.toFixed(0),
				total_supply: data.total_supply?.toFixed(0),
				max_supply: data.max_supply?.toFixed(0) || "N/A",
			};
		} catch {
			return "Market overview unavailable.";
		}
	},
});

// Price History Tool
export const priceHistoryTool = createTool({
	name: "price_history",
	description:
		"Get historical price data for a crypto asset over specified time period",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id"),
		days: z
			.number()
			.default(7)
			.describe("Number of days of price history (1, 7, 30, 90, 365)"),
	}),
	fn: async ({ coinId, days }) => {
		try {
			const data = (await coingeckoFetch(
				`coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
			)) as { prices: [number, number][] };

			const prices = data.prices;
			const firstPrice = prices[0][1];
			const lastPrice = prices[prices.length - 1][1];
			const highPrice = Math.max(...prices.map((p) => p[1]));
			const lowPrice = Math.min(...prices.map((p) => p[1]));
			const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;

			return {
				period: `${days} days`,
				starting_price: `$${firstPrice.toFixed(2)}`,
				current_price: `$${lastPrice.toFixed(2)}`,
				high: `$${highPrice.toFixed(2)}`,
				low: `$${lowPrice.toFixed(2)}`,
				price_change: `${priceChange.toFixed(2)}%`,
				data_points: prices.length,
			};
		} catch {
			return "Price history unavailable.";
		}
	},
});

// Market Metrics Tool
export const marketMetricsTool = createTool({
	name: "market_metrics",
	description: "Get detailed market metrics and ratios for a crypto asset",
	schema: z.object({
		coinId: z.string().describe("Coingecko coin id"),
	}),
	fn: async ({ coinId }) => {
		try {
			const data = (await coingeckoFetch(`coins/${coinId}`)) as {
				market_data: {
					current_price: { usd: number };
					market_cap: { usd: number };
					total_volume: { usd: number };
					fully_diluted_valuation: { usd: number };
					circulating_supply: number;
					total_supply: number;
					max_supply: number;
					ath: { usd: number };
					ath_change_percentage: { usd: number };
					atl: { usd: number };
					atl_change_percentage: { usd: number };
				};
			};

			const marketData = data.market_data;
			const volumeToMcapRatio =
				(marketData.total_volume.usd / marketData.market_cap.usd) * 100;

			return {
				current_price: `$${marketData.current_price.usd.toFixed(2)}`,
				market_cap: `$${(marketData.market_cap.usd / 1e9).toFixed(2)}B`,
				fdv: marketData.fully_diluted_valuation?.usd
					? `$${(marketData.fully_diluted_valuation.usd / 1e9).toFixed(2)}B`
					: "N/A",
				volume_mcap_ratio: `${volumeToMcapRatio.toFixed(2)}%`,
				ath: `$${marketData.ath.usd.toFixed(2)}`,
				ath_change: `${marketData.ath_change_percentage.usd.toFixed(2)}%`,
				atl: `$${marketData.atl.usd.toFixed(2)}`,
				atl_change: `${marketData.atl_change_percentage.usd.toFixed(2)}%`,
				supply_ratio: marketData.max_supply
					? `${((marketData.circulating_supply / marketData.max_supply) * 100).toFixed(2)}%`
					: "N/A",
			};
		} catch {
			return "Market metrics unavailable.";
		}
	},
});
