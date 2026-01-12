'use server'

import { SporeService } from "@/modules/growth_engine/spore.service";
import { z } from "zod";

const RedeemSchema = z.object({
    code: z.string().min(1, "Referral code is required"),
});

export async function redeemReferralCode(newUserId: string, formData: FormData) {
    const rawCode = formData.get('code');

    const validatedFields = RedeemSchema.safeParse({
        code: rawCode
    });

    if (!validatedFields.success) {
        const errorMsg = validatedFields.error.flatten().fieldErrors.code?.[0] || "Invalid code";
        return {
            success: false,
            message: errorMsg
        };
    }

    try {
        const result = await SporeService.processReferral(newUserId, validatedFields.data.code);
        return result;
    } catch (error) {
        console.error("Referral Action Error:", error);
        return {
            success: false,
            message: "System Error processing referral"
        };
    }
}

