import axios from 'axios';

/**
 * LINKEDIN MEDIA UPLOADER
 * Implements 3-step upload flow for native images
 */

export class LinkedInMediaUploader {

    /**
     * Upload image to LinkedIn and return Asset URN
     */
    static async uploadImage(imageUrl: string, authorUrn: string): Promise<string> {
        const token = process.env.LINKEDIN_ACCESS_TOKEN;

        if (!token) {
            throw new Error('LINKEDIN_ACCESS_TOKEN missing');
        }

        try {
            // Step 1: Register Upload
            const registerUrl = 'https://api.linkedin.com/v2/assets?action=registerUpload';
            const registerPayload = {
                registerUploadRequest: {
                    recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                    owner: authorUrn,
                    serviceRelationships: [{
                        relationshipType: 'OWNER',
                        identifier: 'urn:li:userGeneratedContent'
                    }]
                }
            };

            const registerResponse = await axios.post(registerUrl, registerPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
            const asset = registerResponse.data.value.asset;

            // Step 2: Upload Binary
            const imageBuffer = await this.downloadImage(imageUrl);

            await axios.put(uploadUrl, imageBuffer, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/octet-stream'
                }
            });

            console.log(`[LinkedIn] Image uploaded: ${asset}`);

            // Step 3: Return Asset URN
            return asset;

        } catch (error: any) {
            console.error('[LinkedIn] Media upload failed:', error.response?.data || error.message);
            throw error;
        }
    }

    private static async downloadImage(url: string): Promise<Buffer> {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    }

    /**
     * Post with uploaded media
     */
    static async postWithMedia(content: string, imageUrl: string, authorUrn: string): Promise<string> {
        const token = process.env.LINKEDIN_ACCESS_TOKEN;

        if (!token) {
            throw new Error('LINKEDIN_ACCESS_TOKEN missing');
        }

        // Upload image first
        const assetUrn = await this.uploadImage(imageUrl, authorUrn);

        // Post with media
        const postUrl = 'https://api.linkedin.com/v2/ugcPosts';
        const payload = {
            author: authorUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: { text: content },
                    shareMediaCategory: 'IMAGE',
                    media: [{
                        status: 'READY',
                        description: { text: 'ELA Genesis' },
                        media: assetUrn,
                        title: { text: 'Auto-Promotion' }
                    }]
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await axios.post(postUrl, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const postId = response.data.id;
        console.log(`[LinkedIn] Posted with media: ${postId}`);

        return postId;
    }
}

/**
 * INSTAGRAM MEDIA UPLOADER  
 * Supports single images and carrousels
 */
export class InstagramMediaUploader {

    static async postWithMedia(
        caption: string,
        imageUrls: string[],
        igAccountId: string
    ): Promise<string> {
        const token = process.env.FB_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN;

        if (!token) {
            throw new Error('FB_ACCESS_TOKEN or INSTAGRAM_ACCESS_TOKEN missing');
        }

        try {
            if (imageUrls.length === 1) {
                // Single image post
                return await this.postSingleImage(caption, imageUrls[0], igAccountId, token);
            } else {
                // Carousel post
                return await this.postCarousel(caption, imageUrls, igAccountId, token);
            }
        } catch (error: any) {
            console.error('[Instagram] Media upload failed:', error.response?.data || error.message);
            throw error;
        }
    }

    private static async postSingleImage(
        caption: string,
        imageUrl: string,
        igAccountId: string,
        token: string
    ): Promise<string> {
        // Step 1: Create media container
        const containerUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media`;
        const containerResponse = await axios.post(containerUrl, null, {
            params: {
                image_url: imageUrl,
                caption: caption,
                access_token: token
            }
        });

        const containerId = containerResponse.data.id;

        // Step 2: Publish container
        const publishUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`;
        const publishResponse = await axios.post(publishUrl, null, {
            params: {
                creation_id: containerId,
                access_token: token
            }
        });

        const postId = publishResponse.data.id;
        console.log(`[Instagram] Posted single image: ${postId}`);

        return postId;
    }

    private static async postCarousel(
        caption: string,
        imageUrls: string[],
        igAccountId: string,
        token: string
    ): Promise<string> {
        // Step 1: Create container for each image
        const containerIds = [];

        for (const imageUrl of imageUrls) {
            const containerUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media`;
            const response = await axios.post(containerUrl, null, {
                params: {
                    image_url: imageUrl,
                    is_carousel_item: true,
                    access_token: token
                }
            });
            containerIds.push(response.data.id);
        }

        // Step 2: Create carousel container
        const carouselUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media`;
        const carouselResponse = await axios.post(carouselUrl, null, {
            params: {
                caption: caption,
                media_type: 'CAROUSEL',
                children: containerIds.join(','),
                access_token: token
            }
        });

        const carouselId = carouselResponse.data.id;

        // Step 3: Publish carousel
        const publishUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`;
        const publishResponse = await axios.post(publishUrl, null, {
            params: {
                creation_id: carouselId,
                access_token: token
            }
        });

        const postId = publishResponse.data.id;
        console.log(`[Instagram] Posted carousel: ${postId}`);

        return postId;
    }
}

/**
 * TWITTER MEDIA UPLOADER
 */
export class TwitterMediaUploader {

    static async postWithMedia(content: string, imageUrl: string): Promise<string> {
        const token = process.env.TWITTER_BEARER_TOKEN;

        if (!token) {
            throw new Error('TWITTER_BEARER_TOKEN missing');
        }

        try {
            // Step 1: Upload media
            const imageBuffer = await this.downloadImage(imageUrl);

            const mediaUploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';

            const FormData = require('form-data');
            const form = new FormData();
            form.append('media', imageBuffer, 'image.jpg');

            const mediaResponse = await axios.post(mediaUploadUrl, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${token}`
                }
            });

            const mediaId = mediaResponse.data.media_id_string;

            // Step 2: Create tweet with media
            const tweetUrl = 'https://api.twitter.com/2/tweets';
            const tweetPayload = {
                text: content,
                media: {
                    media_ids: [mediaId]
                }
            };

            const tweetResponse = await axios.post(tweetUrl, tweetPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const tweetId = tweetResponse.data.data.id;
            console.log(`[Twitter] Posted with media: ${tweetId}`);

            return tweetId;

        } catch (error: any) {
            console.error('[Twitter] Media upload failed:', error.response?.data || error.message);
            throw error;
        }
    }

    private static async downloadImage(url: string): Promise<Buffer> {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    }
}
