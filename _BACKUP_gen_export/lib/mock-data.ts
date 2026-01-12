// Mock data for demo/simulation mode

export const mockKeywords = [
    {
        id: '1',
        keyword: 'marketing automation saas',
        volume: 12500,
        difficulty: 45,
        intent: 'commercial',
        cluster: 'Marketing Automation',
        priority: 85,
        status: 'pending'
    },
    {
        id: '2',
        keyword: 'seo tools for startups',
        volume: 8900,
        difficulty: 38,
        intent: 'commercial',
        cluster: 'SEO Tools',
        priority: 78,
        status: 'pending'
    },
    {
        id: '3',
        keyword: 'how to automate lead generation',
        volume: 15200,
        difficulty: 28,
        intent: 'informational',
        cluster: 'Lead Generation',
        priority: 92,
        status: 'pending'
    },
    {
        id: '4',
        keyword: 'best crm for small business',
        volume: 22100,
        difficulty: 62,
        intent: 'transactional',
        cluster: 'CRM Software',
        priority: 65,
        status: 'pending'
    },
    {
        id: '5',
        keyword: 'ai content generation tools',
        volume: 18700,
        difficulty: 52,
        intent: 'commercial',
        cluster: 'AI Content',
        priority: 74,
        status: 'pending'
    },
    {
        id: '6',
        keyword: 'email marketing best practices',
        volume: 9800,
        difficulty: 35,
        intent: 'informational',
        cluster: 'Email Marketing',
        priority: 68,
        status: 'pending'
    },
    {
        id: '7',
        keyword: 'social media scheduler',
        volume: 16300,
        difficulty: 48,
        intent: 'transactional',
        cluster: 'Social Media',
        priority: 71,
        status: 'pending'
    },
    {
        id: '8',
        keyword: 'conversion rate optimization',
        volume: 11200,
        difficulty: 58,
        intent: 'informational',
        cluster: 'CRO',
        priority: 62,
        status: 'pending'
    },
];

export const mockLeads = [
    {
        id: '1',
        email: 'jean.dupont@startup-tech.fr',
        name: 'Jean Dupont',
        company: 'Startup Tech',
        score: 85,
        scoreBreakdown: {
            demographic: 90,
            behavioral: 85,
            engagement: 80,
            intent: 85,
            totalScore: 85
        },
        stage: 'hot',
        createdAt: new Date('2024-01-08'),
        touchpoints: [
            { type: 'email', delivered: true, opened: true, clicked: true },
            { type: 'call', delivered: true }
        ],
        conversions: []
    },
    {
        id: '2',
        email: 'marie.martin@ecommerce-pro.com',
        name: 'Marie Martin',
        company: 'E-commerce Pro',
        score: 72,
        scoreBreakdown: {
            demographic: 75,
            behavioral: 70,
            engagement: 72,
            intent: 71,
            totalScore: 72
        },
        stage: 'hot',
        createdAt: new Date('2024-01-07'),
        touchpoints: [],
        conversions: []
    },
    {
        id: '3',
        email: 'pierre.bernard@agency-digital.fr',
        name: 'Pierre Bernard',
        company: 'Agency Digital',
        score: 58,
        scoreBreakdown: {
            demographic: 60,
            behavioral: 55,
            engagement: 58,
            intent: 59,
            totalScore: 58
        },
        stage: 'warm',
        createdAt: new Date('2024-01-06'),
        touchpoints: [],
        conversions: []
    },
    {
        id: '4',
        email: 'sophie.petit@consulting-it.com',
        name: 'Sophie Petit',
        company: 'Consulting IT',
        score: 91,
        scoreBreakdown: {
            demographic: 95,
            behavioral: 90,
            engagement: 88,
            intent: 92,
            totalScore: 91
        },
        stage: 'hot',
        createdAt: new Date('2024-01-05'),
        touchpoints: [],
        conversions: [{ type: 'signup', value: 9900 }]
    },
    {
        id: '5',
        email: 'lucas.roux@saas-innovate.io',
        name: 'Lucas Roux',
        company: 'SaaS Innovate',
        score: 35,
        scoreBreakdown: {
            demographic: 40,
            behavioral: 30,
            engagement: 35,
            intent: 35,
            totalScore: 35
        },
        stage: 'cold',
        createdAt: new Date('2024-01-04'),
        touchpoints: [],
        conversions: []
    },
];

export const mockCampaigns = [
    {
        id: '1',
        name: 'Cold Outreach - Tech Startups',
        type: 'email',
        targetPersona: 'CTO/Tech Lead',
        active: true,
        kpis: {
            sent: 1250,
            opened: 405,
            clicked: 89,
            converted: 12
        },
        createdAt: new Date('2024-01-01')
    },
    {
        id: '2',
        name: 'Nurturing Sequence - Hot Leads',
        type: 'email',
        targetPersona: 'Marketing Director',
        active: true,
        kpis: {
            sent: 320,
            opened: 245,
            clicked: 67,
            converted: 23
        },
        createdAt: new Date('2024-01-03')
    },
    {
        id: '3',
        name: 'SMS Activation Campaign',
        type: 'sms',
        targetPersona: 'All Warm Leads',
        active: true,
        kpis: {
            sent: 580,
            opened: 580,
            clicked: 124,
            converted: 18
        },
        createdAt: new Date('2024-01-05')
    },
];

export const mockMetrics = {
    mrr: 12500,
    mrrGrowth: 23.5,
    activeLeads: 342,
    leadGrowth: 12.3,
    conversions: 45,
    conversionRate: 13.2,
    activeProjects: 8,
};

export const mockActivities = [
    {
        type: 'seo' as const,
        message: 'Nouvelle analyse SEO terminée pour "Marketing SaaS"',
        time: 'Il y a 2 heures'
    },
    {
        type: 'lead' as const,
        message: '5 nouveaux leads qualifiés (score > 70)',
        time: 'Il y a 4 heures'
    },
    {
        type: 'conversion' as const,
        message: 'Nouvelle conversion : Startup Tech Corp - 299€/mois',
        time: 'Il y a 6 heures'
    },
    {
        type: 'seo' as const,
        message: 'Article "Best SEO Tools 2024" atteint la position #3',
        time: 'Il y a 8 heures'
    },
    {
        type: 'lead' as const,
        message: 'Lead "Marie Martin" passé de warm à hot',
        time: 'Il y a 10 heures'
    },
];
