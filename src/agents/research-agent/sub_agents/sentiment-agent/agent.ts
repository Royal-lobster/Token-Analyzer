import { LlmAgent } from "@iqai/adk";
import { openrouter } from "@openrouter/ai-sdk-provider";
import dedent from "dedent";
import { env } from "env";
import { marketSentimentTool } from "./tools";

/**
 * Agent for market sentiment analysis
 */
export const getSentimentAgent = () => {
	const instruction = dedent`
	You are a technical analysis agent specialized in market sentiment for crypto assets. Use your tools to provide sentiment insights for given assets.
	`;
	return new LlmAgent({
		name: "sentiment_agent",
		description: "Analyzes market sentiment for crypto assets",
		instruction,
		model: openrouter(env.LLM_MODEL),
		tools: [marketSentimentTool],
		outputKey: "sentiment_results",
	});
};
