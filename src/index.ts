import fs from "node:fs";
import * as dotenv from "dotenv";
import { getRootAgent } from "./agents/agent";

dotenv.config();

/**
 * Main function demonstrating crypto analysis agent usage.
 *
 * Creates a root agent with research and analysis sub-agents,
 * then processes a sample crypto analysis question to showcase
 * the agent's capabilities in orchestrating research and analysis.
 */
async function main() {
	const { runner } = await getRootAgent();

	const question = "Provide analysis for Bitcoin.";

	console.log(`📝 Question: ${question}`);
	const response = await runner.ask(question);

	const analysis_response = response.filter(
		(r) => r.agent === "analysis_agent",
	)[0].response;

	console.log(`🤖 Response: ${analysis_response}`);

	fs.writeFileSync("./response.md", analysis_response, { encoding: "utf-8" });
}

main().catch(console.error);
