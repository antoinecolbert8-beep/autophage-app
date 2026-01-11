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
    
    // Google AI (Gemini)
    GOOGLE_API_KEY: z.string().optional(),
    
    // Twilio (Téléphonie)
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(),
    
    // Meta (Instagram/Facebook)
    META_PAGE_ACCESS_TOKEN: z.string().optional(),
    META_PAGE_ID: z.string().optional(),
    META_INSTAGRAM_ACCOUNT_ID: z.string().optional(),
    
    // TikTok
    TIKTOK_ACCESS_TOKEN: z.string().optional(),
    TIKTOK_USER_ID: z.string().optional(),
    TIKTOK_API_KEY: z.string().optional(),
    
    // Pinterest
    PINTEREST_API_KEY: z.string().optional(),
    PINTEREST_APP_ID: z.string().optional(),
    
    // YouTube
    YOUTUBE_API_KEY: z.string().optional(),
    YOUTUBE_CLIENT_ID: z.string().optional(),
    YOUTUBE_CLIENT_SECRET: z.string().optional(),
    
    // WhatsApp Business
    WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
    WHATSAPP_ACCESS_TOKEN: z.string().optional(),
    
    // CRM Integrations
    HUBSPOT_API_KEY: z.string().optional(),
    SALESFORCE_CLIENT_ID: z.string().optional(),
    SALESFORCE_CLIENT_SECRET: z.string().optional(),
    PIPEDRIVE_API_KEY: z.string().optional(),
  
    // Twilio Infrastructure (API Keys supplémentaires)
    TWILIO_API_KEY_SID: z.string().optional(),
    TWILIO_API_SECRET: z.string().optional(),

    // Cron Security
    CRON_SECRET: z.string().optional(),
    
    // Safety
    EMERGENCY_STOP_ADS: z.string().optional().default('false'),
    // Mistral
    MISTRAL_API_KEY: z.string().optional(),

    // OpenAI
    OPENAI_API_KEY: z.string().optional(),

    // Pinecone
    PINECONE_API_KEY: z.string().optional(),
    
    // Groq
    GROQ_API_KEY: z.string().optional(),
    
    // Runway Gen-3
    RUNWAY_API_KEY: z.string().optional(),
    
    // Tavily
    TAVILY_API_KEY: z.string().optional(),
    
    // Make.com (Integromat)
    MAKE_WEBHOOK_URL: z.string().optional(),
    
    // Hugging Face
    HUGGINGFACE_API_KEY: z.string().optional(),
    

   

});


const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.warn("⚠️ Some environment variables are invalid:", parsed.error.flatten().fieldErrors);
    // On continue malgré les erreurs pour éviter de bloquer le démarrage
    // En production, vous pouvez choisir de throw une erreur
}

export const env = parsed.success ? parsed.data : {} as z.infer<typeof envSchema>;

