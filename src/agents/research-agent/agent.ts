import { ParallelAgent } from "@iqai/adk";
import { getIndicatorsVolumeAgent } from "./sub_agents/indicators-volume-agent/agent";
import { getInternetSearchAgent } from "./sub_agents/internet-search-agent/agent";
import { getPricePatternAgent } from "./sub_agents/price-pattern-agent/agent";
import { getSentimentAgent } from "./sub_agents/sentiment-agent/agent";

/**
 * Creates and configures a joke agent specialized in providing humor.
 *
 * This agent is equipped with tools to fetch and deliver jokes to users.
 * It uses the Gemini 2.5 Flash model for natural conversation flow and
 * can access joke-related tools for entertainment purposes.
 *
 * @returns A configured LlmAgent instance specialized for joke delivery
 */
export const getResearchAgent = () => {
	return new ParallelAgent({
		name: "research_agent",
		description: "Gathers cryptocurrency research data with help of sub agents",
		subAgents: [
			getPricePatternAgent(),
			getIndicatorsVolumeAgent(),
			getSentimentAgent(),
			getInternetSearchAgent(),
		],
	});
};
