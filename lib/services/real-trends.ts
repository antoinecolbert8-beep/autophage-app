
import Parser from 'rss-parser';

/**
 * 📈 Real Trends Service
 * Fetches actual Google Trends data via RSS to drive Opportunist Agent.
 */
export async function getRealTrends(geo = 'FR') {
    const parser = new Parser();
    const feedUrl = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`;

    try {
        console.log(`🌍 Fetching Real Trends from Google (${geo})...`);
        const feed = await parser.parseURL(feedUrl);

        return feed.items.map(item => ({
            keyword: item.title || 'Unknown Trend',
            volume: parseInt(item.contentSnippet?.match(/(\d+)\+/)?.[1] || "0") * 1000, // Approx volume if parseable
            traffic: item.contentSnippet, // "20 000+ recherches"
            link: item.link,
            pubDate: item.pubDate,
            urgency: "HIGH" // Real trends are always urgent
        })).slice(0, 5); // Return top 5
    } catch (error) {
        console.error("❌ Failed to fetch Real Trends:", error);
        return [];
    }
}
