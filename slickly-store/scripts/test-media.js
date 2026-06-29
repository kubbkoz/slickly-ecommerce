import { createAPIClient } from '@shopware/api-client';
const client = createAPIClient({
    baseURL: 'http://localhost/mtsport/public/store-api', // Need correct URL?
});
async function run() {
    const mediaId = '0000439ea52dc8c506e43db40f7de81c';
    console.log('Testing Shopware media endpoint for ID:', mediaId);
    // Actually, I don't know the exact endpoint without full Nuxt context.
}
run();
