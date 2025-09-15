// Shared Coingecko cache and fetch helper
const coingeckoCache = new Map<string, unknown>();

export async function coingeckoFetch(endpoint: string): Promise<unknown> {
	const url = `https://api.coingecko.com/api/v3/${endpoint}`;
	if (coingeckoCache.has(url)) {
		return coingeckoCache.get(url);
	}
	const res = await fetch(url);
	if (!res.ok) throw new Error("Coingecko API error");
	const json = await res.json();
	coingeckoCache.set(url, json);
	return json;
}
