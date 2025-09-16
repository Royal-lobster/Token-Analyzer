<div align="center">

<img src="https://files.catbox.moe/vumztw.png" alt="ADK TypeScript Logo" width="100" />

<br/>

# Token Analyzer — Crypto Asset Research & Analysis Agent

<em>Automated, multi-agent crypto token research and analysis using the ADK TypeScript framework</em>

---

</div>

## Overview

Token Analyzer is an advanced, extensible AI agent system for automated research and analysis of cryptocurrency assets. Built with the [@iqai/adk](https://github.com/IQAIcom/adk-ts) framework, it orchestrates multiple specialized agents to gather, process, and synthesize market data, technical indicators, sentiment, and internet trends for any crypto token.

**Key Features:**
- Multi-agent architecture: research, analysis, and sub-agents for deep token insights
- Modular tools for price patterns, indicators, sentiment, volume, and web search
- Parallel and sequential agent orchestration for robust, explainable results
- TypeScript, ADK, and OpenRouter LLM integration
- Easily extensible for new data sources or analysis types

---

## 🧠 Architecture

The system is composed of the following agents:

- **Root Agent**: Orchestrates the workflow, running research agents in parallel and passing results to the analysis agent.
- **Research Agent**: Gathers raw data using sub-agents:
	- **Price Pattern Agent**: Detects trends, support/resistance, and chart patterns
	- **Indicators & Volume Agent**: Computes technical indicators (RSI, MA) and analyzes trading volume
	- **Sentiment Agent**: Fetches market sentiment (e.g., Coingecko up/down votes)
	- **Internet Search Agent**: Aggregates latest news, tweets, Reddit posts, and more
- **Analysis Agent**: Synthesizes all research outputs into a comprehensive, actionable markdown report

All agents are implemented using the ADK's `LlmAgent` and `ParallelAgent` classes, with tools defined via ADK's `createTool` API.

---

## 🚀 Getting Started

1. **Install dependencies:**
	 ```bash
	 pnpm install
	 ```
2. **Configure environment:**
	 - Copy `.env.example` to `.env` and fill in required API keys (see below)
3. **Run the agent:**
	 ```bash
	 pnpm dev
	 ```
	 This will run a sample analysis for Bitcoin and write the markdown report to `response.md`.

### Interactive Testing (Optional)

For interactive chat/testing, install the ADK CLI:
```bash
npm install -g @iqai/adk-cli
adk run   # CLI chat
adk web   # Web interface
```

---

## 📁 Folder Structure

```
src/
	index.ts                # Main entry point, demo run
	env.ts                  # Environment variable validation
	agents/
		agent.ts              # Root agent (orchestrator)
		analysis-agent/       # Synthesizes research into a report
			agent.ts
			tools.ts
		research-agent/       # Gathers data using sub-agents
			agent.ts
			tools.ts
			sub_agents/
				indicators-volume-agent/
					agent.ts
					tools.ts
				price-pattern-agent/
					agent.ts
					tools.ts
				sentiment-agent/
					agent.ts
					tools.ts
				internet-search-agent/
					agent.ts
					tools.ts
				market-data-agent/
					agent.ts
					tools.ts
```

---

## ⚙️ Environment Setup

Copy `.env.example` to `.env` and set the following variables:

- `ADK_DEBUG` (optional): Enable ADK framework logs
- `OPENROUTER_API_KEY`: API key for LLM access (required)
- `LLM_MODEL`: LLM model name (default: `google/gemini-2.5-flash`)
- `GOOGLE_API_KEY`, `TAVILY_API_KEY`: For internet search and Gemini models (if used)

---

## � Agents & Tools

### Research Agent Sub-Agents
- **Price Pattern Agent**: Trend, support/resistance, chart pattern detection
- **Indicators & Volume Agent**: RSI, moving average, volume analysis
- **Sentiment Agent**: Market sentiment (Coingecko votes)
- **Internet Search Agent**: News, tweets, Reddit aggregation

### Analysis Agent
- Synthesizes all research into a markdown report for the target crypto asset

---

## 🧪 Testing & Development

- Run `pnpm dev` to execute a sample analysis (see `src/index.ts`)
- Use `adk run` or `adk web` for interactive testing (requires ADK CLI)
- Extend by adding new tools or sub-agents in `src/agents/research-agent/sub_agents/`

---

## 📚 Resources
- [ADK Documentation](https://adk.iqai.com)
- [ADK GitHub Repository](https://github.com/IQAIcom/adk-ts)

---

## 🆘 Support
- 📝 [Create an issue](https://github.com/IQAIcom/adk-ts/issues)
- 💬 [Start a discussion](https://github.com/IQAIcom/adk-ts/discussions)