import { db } from "@/core/db";

export class Scheduler {
    static async getBestPerformingPost(days: number = 7) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        return db.post.findFirst({
            where: {
                createdAt: {
                    gte: cutoff,
                },
            },
            orderBy: {
                performance_score: 'desc',
            },
        });
    }
}

