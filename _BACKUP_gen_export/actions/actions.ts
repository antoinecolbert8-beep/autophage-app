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
