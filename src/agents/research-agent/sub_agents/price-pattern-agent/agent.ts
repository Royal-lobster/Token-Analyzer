import { LlmAgent } from "@iqai/adk";
import { openrouter } from "@openrouter/ai-sdk-provider";
import dedent from "dedent";
import { env } from "env";
import {
	chartPatternsTool,
	supportResistanceTool,
	trendAnalysisTool,
} from "./tools";

/**
 * Agent for price and pattern analysis (trend, support/resistance, chart patterns)
 */
export const getPricePatternAgent = () => {
	const instruction = dedent`
	You are a technical analysis agent specialized in price trends, support/resistance, and chart pattern detection for crypto assets. Use your tools to analyze and summarize findings for given assets.
	`;
	return new LlmAgent({
		name: "price_pattern_agent",
		description:
			"Analyzes price trends, support/resistance, and chart patterns for crypto assets",
		instruction,
		model: openrouter(env.LLM_MODEL),
		tools: [trendAnalysisTool, supportResistanceTool, chartPatternsTool],
		outputKey: "price_pattern_results",
	});
};
