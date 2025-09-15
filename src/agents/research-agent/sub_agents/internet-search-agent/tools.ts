import { createTool } from "@iqai/adk";
import * as z from "zod";

// Tool for general internet search (news, tweets, reddit, etc.)
export const internetSearchTool = createTool({
	name: "internet_search",
	description:
		"Search the internet for latest news, tweets, Reddit posts, and more about a crypto token. Accepts an array of queries and returns results for each.",
	schema: z.object({
		queries: z
			.array(z.string())
			.describe(
				"Array of search queries, e.g. ['bitcoin latest news', 'ethereum reddit', 'solana tweets']",
			),
	}),
	fn: async ({ queries }) => {
		try {
			const apiKey = process.env.WEB_SEARCH_API_KEY;
			const results: string[] = [];
			for (const query of queries) {
				const url = `https://api.websearch.com/v1/search?q=${encodeURIComponent(query)}&apikey=${apiKey}`;
				const res = await fetch(url);
				if (!res.ok) {
					results.push(`Error for '${query}': Web Search API error`);
					continue;
				}
				const data = (await res.json()) as {
					results?: Array<{ title: string; description: string }>;
				};
				if (data?.results?.length) {
					results.push(
						`Query: '${query}'\nTop result: ${data.results[0].title} - ${data.results[0].description}`,
					);
				} else {
					results.push(`Query: '${query}'\nNo search results found.`);
				}
			}
			return results.join("\n\n");
		} catch (e) {
			const msg =
				typeof e === "object" && e && "message" in e
					? (e as unknown as { message: string }).message
					: String(e);
			return `Internet search unavailable: ${msg}`;
		}
	},
});
