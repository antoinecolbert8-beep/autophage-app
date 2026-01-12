import * as adsSdk from 'facebook-nodejs-business-sdk';
import { env } from '@/core/env';

const AdAccount = adsSdk.AdAccount;
const AdSet = adsSdk.AdSet;
const AdCreative = adsSdk.AdCreative;
const Ad = adsSdk.Ad;

if (env.META_ACCESS_TOKEN) {
    adsSdk.FacebookAdsApi.init(env.META_ACCESS_TOKEN);
}

export class AdManager {
    static async updateAdSetBudget(adSetId: string, availableBudgetCents: number) {
        const dailyBudget = Math.floor(availableBudgetCents / 100);

        const adSet = new AdSet(adSetId);
        return await adSet.update([], {
            [AdSet.Fields.daily_budget]: availableBudgetCents,
        });
    }

    static async updateAdCreative(adSetId: string, creative: any): Promise<{ id: string }> {
        console.log(`Updating Ad Creative for AdSet ${adSetId}...`);
        // TODO: Implement real Meta API call
        return { id: `creative_${Date.now()}` };
    }

    static async createAdFromCreative(adSetId: string, creative: any, postId?: string): Promise<{ id: string }> {
        console.log(`Creating new Ad in AdSet ${adSetId}...`);
        // TODO: Real Meta API call here
        return { id: `act_${Date.now()}` };
    }

    static async pauseAd(adId: string) {
        console.log(`AdManager: Pausing Ad ${adId}...`);
        return new Ad(adId).update([], {
            [Ad.Fields.status]: 'PAUSED'
        });
    }
}

