/**
 * Converts a URL to a Base64 string and detects MIME type.
 * Note: This requires the server serving the image to allow CORS.
 */
export async function urlToBase64(url: string): Promise<{ data: string; mimeType: string }> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Url = reader.result as string;
                // format is "data:image/jpeg;base64,....."
                const [header, content] = base64Url.split(',');
                const mimeType = header?.split(':')?.[1]?.split(';')?.[0] || 'image/jpeg';
                resolve({ data: content || '', mimeType });
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error converting URL to Base64:", error);
        throw new Error("Failed to load image for editing. Security restrictions (CORS) may prevent editing this specific image.");
    }
}

/**
 * Analyzes an image to generate search terms.
 * NOW USES SERVER-SIDE ENDPOINT.
 */
export async function analyzeImageForSearch(image: { data: string; mimeType: string }): Promise<string> {
    try {
        const response = await $fetch<{ result: string }>('/api/gemini/analyze', {
            method: 'POST',
            body: { image }
        });
        return response.result;
    } catch (error) {
        console.error("Gemini Image Analysis Error:", error);
        return "Horský bicykel"; // Fallback
    }
}

/**
 * Edits an existing image based on a text prompt.
 * NOT IMPLEMENTED SERVER-SIDE YET.
 */
export async function editImageWithGemini(image: { data: string; mimeType: string }, prompt: string): Promise<string> {
    console.warn("Image editing is currently disabled for security reasons.");
    return "Image editing unavailable.";
}


/**
 * Recommends products based on user context.
 * NOW USES SERVER-SIDE ENDPOINT.
 */
export async function getPersonalizedRecommendations(userContext: string, products: any[]): Promise<string[]> {
    try {
        const response = await $fetch<{ recommendationIds: string[] }>('/api/gemini/recommend', {
            method: 'POST',
            body: { userContext, products }
        });
        return response.recommendationIds;
    } catch (error) {
        console.error("Gemini Recommendation Error:", error);
        return [];
    }
}
