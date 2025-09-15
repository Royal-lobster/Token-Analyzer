import { createTool } from "@iqai/adk";
import { coingeckoFetch } from "@utils";
import * as z from "zod";

// Market Sentiment Tool
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
