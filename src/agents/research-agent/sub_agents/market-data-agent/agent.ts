import { LlmAgent } from "@iqai/adk";
import { openrouter } from "@openrouter/ai-sdk-provider";
import dedent from "dedent";
import { env } from "env";
import {
	marketMetricsTool,
	marketOverviewTool,
	priceHistoryTool,
} from "./tools";

/**
 * Agent for core market data analysis (price, market cap, volume, metrics)
 */
export const getMarketDataAgent = () => {
	const instruction = dedent`
	You are a market data agent specialized in providing comprehensive market information for crypto assets. Use your tools to gather and present key market data including current prices, historical performance, market capitalization, trading volumes, and important market metrics.

	Focus on:
	- Current market overview (price, market cap, volume, price changes)
	- Historical price performance over different time periods
	- Key market metrics and ratios (ATH/ATL, volume/market cap ratio, supply metrics)
	- Market positioning and ranking information

	Present data in a clear, structured format that helps users understand the asset's market position and performance.
	`;
	return new LlmAgent({
		name: "market_data_agent",
		description:
			"Provides comprehensive market data and metrics for crypto assets",
		instruction,
		model: openrouter(env.LLM_MODEL),
		tools: [marketOverviewTool, priceHistoryTool, marketMetricsTool],
		outputKey: "market_data_results",
		disallowTransferToPeers: true,
	});
};
