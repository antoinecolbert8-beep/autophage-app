import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * 🔗 LINKEDIN IMAGE UPLOAD SERVICE
 * LinkedIn v2 exigences : Initialize -> Binary Upload -> Register
 * Ce flow transforme une URL publique en un 'Asset URN' publiable.
 */
export class LinkedInImageService {
    /**
     * Flow complet : Téléchargement -> Initialisation -> Upload -> Retour URN
     */
    static async uploadImage(imageUrl: string, authorUrn: string, accessToken: string): Promise<string> {
        console.log(`📸 Starting LinkedIn image upload for: ${imageUrl}`);

        try {
            // 1. Download image to buffer
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data);
            const contentType = imageResponse.headers['content-type'] || 'image/jpeg';

            // 2. Initialize Upload (registerUpload)
            const registerUrl = 'https://api.linkedin.com/v2/assets?action=registerUpload';
            const registerPayload = {
                recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                servicelocation: 'MAIN',
                relationship: 'RELATED',
                registerUploadRequest: {
                    owner: authorUrn,
                    recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                    servicelocation: 'MAIN',
                    relationship: 'RELATED',
                }
            };

            const registerResponse = await axios.post(registerUrl, registerPayload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                    'Content-Type': 'application/json'
                }
            });

            const { uploadUrl, asset } = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'];
            const assetUrn = registerResponse.data.value.asset;

            console.log(`📤 Initialized LinkedIn upload. Asset: ${assetUrn}`);

            // 3. Binary Upload (PUT to the provided AWS S3 URL)
            await axios.put(uploadUrl, imageBuffer, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': contentType
                }
            });

            console.log(`✅ LinkedIn image upload complete: ${assetUrn}`);
            return assetUrn;

        } catch (error: any) {
            console.error("❌ LinkedIn Image Upload failed:", error.response?.data || error.message);
            throw new Error(`LinkedIn Image Upload Error: ${error.message}`);
        }
    }
}
