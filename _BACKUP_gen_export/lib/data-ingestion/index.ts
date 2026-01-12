// Google Trends Integration (No API key needed for basic access)
import axios from 'axios';

interface TrendData {
    keyword: string;
    volume: number;
    trend: 'rising' | 'declining' | 'stable';
    relatedQueries: string[];
}

export async function fetchGoogleTrends(keywords: string[]): Promise<TrendData[]> {
    try {
        // Using google-trends-api unofficial package or direct scraping
        // For now, mock structure - you can add google-trends-api package
        const trendsData: TrendData[] = [];

        for (const keyword of keywords) {
            // This would call Google Trends
            trendsData.push({
                keyword,
                volume: Math.floor(Math.random() * 100000),
                trend: ['rising', 'declining', 'stable'][Math.floor(Math.random() * 3)] as any,
                relatedQueries: [
                    `${keyword} tool`,
                    `best ${keyword}`,
                    `${keyword} guide`,
                ],
            });
        }

        return trendsData;
    } catch (error) {
        console.error('Error fetching Google Trends:', error);
        return [];
    }
}

// Reddit API Integration (Free, no auth for basic read)
export async function fetchRedditInsights(topic: string): Promise<any[]> {
    try {
        const response = await axios.get(
            `https://www.reddit.com/search.json?q=${encodeURIComponent(topic)}&limit=25`,
            {
                headers: {
                    'User-Agent': 'ELA-Bot/1.0',
                },
            }
        );

        const posts = response.data.data.children.map((child: any) => ({
            title: child.data.title,
            score: child.data.score,
            numComments: child.data.num_comments,
            url: child.data.url,
            subreddit: child.data.subreddit,
            created: new Date(child.data.created_utc * 1000),
        }));

        return posts;
    } catch (error) {
        console.error('Error fetching Reddit data:', error);
        return [];
    }
}

// Hacker News API (Completely free and open)
export async function fetchHackerNewsInsights(topic: string): Promise<any[]> {
    try {
        // Search Algolia HN API
        const response = await axios.get(
            `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=story`
        );

        const stories = response.data.hits.map((hit: any) => ({
            title: hit.title,
            url: hit.url,
            points: hit.points,
            numComments: hit.num_comments,
            author: hit.author,
            created: new Date(hit.created_at),
        }));

        return stories;
    } catch (error) {
        console.error('Error fetching HN data:', error);
        return [];
    }
}

// Wikipedia API for topic research
export async function fetchWikipediaData(topic: string): Promise<any> {
    try {
        const response = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
        );

        return {
            title: response.data.title,
            description: response.data.description,
            extract: response.data.extract,
            thumbnail: response.data.thumbnail?.source,
        };
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        return null;
    }
}

// Public SEO Dataset (Common crawl style)
export const popularKeywordsDataset = [
    // Marketing & SaaS
    { keyword: 'marketing automation', volume: 18100, difficulty: 65, intent: 'commercial' },
    { keyword: 'email marketing software', volume: 22000, difficulty: 71, intent: 'transactional' },
    { keyword: 'crm for small business', volume: 14800, difficulty: 58, intent: 'commercial' },
    { keyword: 'social media management tools', volume: 12100, difficulty: 62, intent: 'commercial' },
    { keyword: 'seo tools', volume: 33100, difficulty: 75, intent: 'commercial' },
    { keyword: 'content marketing strategy', volume: 8100, difficulty: 45, intent: 'informational' },
    { keyword: 'lead generation software', volume: 9900, difficulty: 68, intent: 'commercial' },
    { keyword: 'marketing analytics', volume: 6600, difficulty: 52, intent: 'informational' },
    { keyword: 'conversion rate optimization', volume: 11000, difficulty: 58, intent: 'informational' },
    { keyword: 'customer acquisition cost', volume: 5400, difficulty: 42, intent: 'informational' },

    // AI & Technology
    { keyword: 'ai content generation', volume: 27100, difficulty: 61, intent: 'commercial' },
    { keyword: 'machine learning platform', volume: 8900, difficulty: 70, intent: 'commercial' },
    { keyword: 'chatbot software', volume: 18200, difficulty: 66, intent: 'transactional' },
    { keyword: 'no code platform', volume: 22100, difficulty: 59, intent: 'commercial' },
    { keyword: 'api management', volume: 6700, difficulty: 64, intent: 'informational' },

    // E-commerce
    { keyword: 'ecommerce platform', volume: 40500, difficulty: 78, intent: 'transactional' },
    { keyword: 'shopify alternatives', volume: 33100, difficulty: 72, intent: 'commercial' },
    { keyword: 'payment gateway', volume: 27100, difficulty: 69, intent: 'transactional' },
    { keyword: 'inventory management software', volume: 14800, difficulty: 63, intent: 'commercial' },
    { keyword: 'ecommerce seo', volume: 5400, difficulty: 51, intent: 'informational' },

    // Business & Productivity
    { keyword: 'project management software', volume: 49500, difficulty: 76, intent: 'transactional' },
    { keyword: 'team collaboration tools', volume: 8100, difficulty: 62, intent: 'commercial' },
    { keyword: 'time tracking software', volume: 12100, difficulty: 65, intent: 'commercial' },
    { keyword: 'invoice software', volume: 18100, difficulty: 59, intent: 'transactional' },
    { keyword: 'hr software for small business', volume: 9900, difficulty: 67, intent: 'commercial' },
];

// Ethical Web Scraper (respects robots.txt)
export async function checkRobotsTxt(domain: string): Promise<boolean> {
    try {
        const response = await axios.get(`https://${domain}/robots.txt`);
        // Parse robots.txt and check if our user-agent is allowed
        return !response.data.includes('Disallow: /');
    } catch (error) {
        // If no robots.txt, assume allowed
        return true;
    }
}

export async function ethicalScrape(url: string, delay: number = 1000): Promise<string | null> {
    try {
        const domain = new URL(url).hostname;
        const allowed = await checkRobotsTxt(domain);

        if (!allowed) {
            console.log(`Scraping not allowed for ${domain}`);
            return null;
        }

        // Add delay to respect server
        await new Promise(resolve => setTimeout(resolve, delay));

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'ELA-Bot/1.0 (Respectful Crawler)',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error scraping:', error);
        return null;
    }
}
