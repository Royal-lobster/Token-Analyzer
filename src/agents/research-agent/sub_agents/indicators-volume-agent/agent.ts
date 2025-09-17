import { LlmAgent } from "@iqai/adk";
import { openrouter } from "@openrouter/ai-sdk-provider";
import dedent from "dedent";
import { env } from "env";
import { indicatorsTool, volumeAnalysisTool } from "./tools";

/**
 * Agent for indicators and volume analysis (RSI, MA, volume)
 */
export const getIndicatorsVolumeAgent = () => {
	const instruction = dedent`
	You are a technical analysis agent specialized in indicators (RSI, moving average) and volume analysis for crypto assets. Use your tools to provide insights and summaries for given assets.
	`;
	return new LlmAgent({
		name: "indicators_volume_agent",
		description: "Analyzes technical indicators and volume for crypto assets",
		instruction,
		model: openrouter(env.LLM_MODEL),
		tools: [indicatorsTool, volumeAnalysisTool],
		outputKey: "indicators_volume_results",
		disallowTransferToPeers: true,
	});
};
