import OpenAI from 'openai';

let _openai: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
    if (_openai) return _openai;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
        throw new Error('OPENAI_API_KEY is missing in production environment.');
    }

    _openai = new OpenAI({
        apiKey: apiKey || 'dummy_key_for_build_phase',
    });

    return _openai;
}
