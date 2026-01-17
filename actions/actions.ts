'use server'
import { revalidatePath } from 'next/cache'
import { generateLandingCopy } from '@/lib/ai-brain'

export async function refreshWithStyle(formData: FormData) {
  const style = formData.get('style') as string || 'agressif';
  await generateLandingCopy(style);
  revalidatePath('/'); // Rafraîchit la page pour voir le nouveau texte
}

export async function triggerManualCycle() {
  console.log("🔄 Manual cycle triggered");
  // TODO: Implement actual campaign logic restoration
  // PREVIOUSLY: await CampaignCommander.runCycle();

  return { success: true, message: "Cycle simulation executed (Logic pending restoration)", error: undefined };
}

/**
 * Example Server Action: Request LinkedIn Post Generation
 * Demonstrates the "Conductor Pattern" where valid requests are delegated to Make.com
 */
import { triggerAutomation } from '@/lib/automations';

export async function generateLinkedInPost(formData: FormData) {
  const topic = formData.get('topic') as string;
  const tone = formData.get('tone') as string || 'professional';

  // Basic validation
  if (!topic || topic.length < 5) {
    return { success: false, message: "Topic is too short or missing" };
  }

  // Delegate to Make.com
  const result = await triggerAutomation(
    "GENERATE_POST",
    {
      platform: "linkedin",
      topic,
      tone,
      preferences: {
        includeEmojis: true,
        length: "medium"
      }
    },
    // In a real app, you would retrieve the actual user ID from the session here
    // e.g., const session = await auth(); userId = session.user.id;
    "user_123_demo"
  );

  if (result.success) {
    return { success: true, message: "Post generation request sent successfully!" };
  } else {
    return { success: false, message: "Failed to request post generation. Please try again." };
  }
}
