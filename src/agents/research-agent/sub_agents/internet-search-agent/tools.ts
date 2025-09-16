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
			const apiKey = process.env.TAVILY_API_KEY;
			if (!apiKey) {
				return "Tavily API key not found. Please set TAVILY_API_KEY environment variable.";
			}

			const results: string[] = [];
			for (const query of queries) {
				const response = await fetch("https://api.tavily.com/search", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						api_key: apiKey,
						query: query,
						search_depth: "basic",
						include_answer: true,
						include_raw_content: false,
						max_results: 5,
						include_domains: [],
						exclude_domains: [],
					}),
				});

				if (!response.ok) {
					results.push(
						`Error for '${query}': Tavily API error (${response.status})`,
					);
					continue;
				}

				const data = (await response.json()) as {
					answer?: string;
					results?: Array<{
						title: string;
						url: string;
						content: string;
						score: number;
					}>;
				};

				if (data?.results?.length) {
					let resultText = `Query: '${query}'\n`;

					// Include the AI-generated answer if available
					if (data.answer) {
						resultText += `Answer: ${data.answer}\n\n`;
					}

					// Include top search results
					resultText += "Top results:\n";
					data.results.slice(0, 3).forEach((result, index) => {
						resultText += `${index + 1}. ${result.title}\n   ${result.content.substring(0, 200)}...\n   URL: ${result.url}\n\n`;
					});

					results.push(resultText.trim());
				} else {
					results.push(`Query: '${query}'\nNo search results found.`);
				}
			}
			return results.join("\n\n---\n\n");
		} catch (e) {
			const msg =
				typeof e === "object" && e && "message" in e
					? (e as unknown as { message: string }).message
					: String(e);
			return `Internet search unavailable: ${msg}`;
		}
	},
});
