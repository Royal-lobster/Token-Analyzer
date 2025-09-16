import { LlmAgent } from "@iqai/adk";
import { openrouter } from "@openrouter/ai-sdk-provider";
import dedent from "dedent";
import { env } from "env";
import { weatherTool } from "./tools";
/**
 * Creates and configures a weather agent specialized in providing weather information.
 *
 * This agent is equipped with weather-related tools to fetch current conditions,
 * forecasts, and weather data for specified cities. It uses the Gemini 2.5 Flash
 * model for natural language interaction with weather queries.
 *
 * @returns A configured LlmAgent instance specialized for weather information
 */
export const getAnalysisAgent = () => {
	const instruction = dedent`
	You are an analysis agent. You will be provided with the outputs of several research agents. Use the following data to generate a comprehensive analysis report:

	Price & Pattern Analysis:
	{price_pattern_results}

	Indicators & Volume Analysis:
	{indicators_volume_results}

	Sentiment Analysis:
	{sentiment_results}

	Internet Search Results:
	{internet_search_results}

	Use all the above information to provide a detailed, actionable analysis for the given crypto asset. provide it in markdown format
	`;
	const analysisAgent = new LlmAgent({
		name: "analysis_agent",
		description: "Provides analysis report given the research data",
		instruction,
		model: openrouter(env.LLM_MODEL),
		disallowTransferToParent: true,
		disallowTransferToPeers: true,
		tools: [weatherTool],
	});

	return analysisAgent;
};
