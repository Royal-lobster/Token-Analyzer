import { ParallelAgent } from "@iqai/adk";
import { getIndicatorsVolumeAgent } from "./sub_agents/indicators-volume-agent/agent";
import { getInternetSearchAgent } from "./sub_agents/internet-search-agent/agent";
import { getMarketDataAgent } from "./sub_agents/market-data-agent/agent";
import { getPricePatternAgent } from "./sub_agents/price-pattern-agent/agent";
import { getSentimentAgent } from "./sub_agents/sentiment-agent/agent";

/**
 * Creates and configures a research agent specialized in gathering cryptocurrency research data.
 *
 * This agent is equipped with sub-agents to fetch and analyze various aspects of cryptocurrency markets,
 * including price patterns, indicators, sentiment, and internet search trends.
 *
 * @returns A configured ParallelAgent instance specialized for cryptocurrency research
 */
export const getResearchAgent = () => {
	const pricePatternAgent = getPricePatternAgent();
	const indicatorsVolumeAgent = getIndicatorsVolumeAgent();
	const sentimentAgent = getSentimentAgent();
	const internetSearchAgent = getInternetSearchAgent();
	const marketDataAgent = getMarketDataAgent();

	return new ParallelAgent({
		name: "research_agent",
		description: "Gathers cryptocurrency research data with help of sub agents",
		subAgents: [
			pricePatternAgent,
			indicatorsVolumeAgent,
			sentimentAgent,
			internetSearchAgent,
			marketDataAgent,
		],
	});
};
