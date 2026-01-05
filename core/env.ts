import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().optional(),
    
    // Stripe
    STRIPE_SECRET: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    
    // Meta Ads
    META_ACCESS_TOKEN: z.string().optional(),
    META_AD_ACCOUNT_ID: z.string().optional(),
    META_AD_SET_ID: z.string().optional(),
    
    // Google AI
    GOOGLE_API_KEY: z.string().optional(),
    
    // Cron Security
    CRON_SECRET: z.string().optional(),
    
    // Safety
    EMERGENCY_STOP_ADS: z.string().optional().default('false'),
    // Mistral
    MISTRAL_API_KEY: z.string().optional(),

    // OpenAI
    OPENAI_API_KEY: z.string().min(1),

    // Pinecone
    PINECONE_API_KEY: z.string().min(1),
    

   

});


const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
}

export const env = parsed.data;

