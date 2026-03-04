import { DalleService } from "../lib/ai/dalle";
import * as dotenv from "dotenv";

dotenv.config();

async function testImageGen() {
    console.log("🚀 Testing ELA Visual Autonomy (DALL-E 3)...");

    const topic = "Un bureau de trader futuriste dans un style 'Empire Nocturne', avec des néons turquoise et une architecture mécanique complexe, 8k, ultra-détaillé.";

    try {
        const imageUrl = await DalleService.generateImage(topic, "1024x1024");
        console.log("✅ Image URL Generated:");
        console.log(imageUrl);
        console.log("\nCopiez cet URL dans votre navigateur pour vérifier le visuel.");
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

testImageGen();
