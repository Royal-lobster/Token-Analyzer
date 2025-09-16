import { LlmAgent } from "@iqai/adk";
import { openrouter } from "@openrouter/ai-sdk-provider";
import dedent from "dedent";
import { env } from "env";
import { internetSearchTool } from "./tools";

/**
 * Agent for internet search of crypto token news, tweets, reddit, etc.
 */
export const getInternetSearchAgent = () => {
	const instruction = dedent`
	You are an internet search agent specialized in finding the latest news, tweets, Reddit posts, and other web results about crypto tokens. For each token, generate a set of relevant queries (e.g. 'bitcoin latest news', 'bitcoin reddit', 'bitcoin tweets') and use your tool to search for all of them at once. Summarize the results for each query.
	`;
	return new LlmAgent({
		name: "internet_search_agent",
		description:
			"Searches internet for latest news, tweets, Reddit posts about crypto tokens",
		instruction,
		model: openrouter(env.LLM_MODEL),
		tools: [internetSearchTool],
		outputKey: "internet_search_results",
		disallowTransferToParent: true,
		disallowTransferToPeers: true,
	});
};
