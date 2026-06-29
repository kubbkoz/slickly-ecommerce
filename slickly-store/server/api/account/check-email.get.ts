import { getAdminToken } from '../../utils/shopwareAdmin';

export default defineEventHandler(async (event) => {
    const { email } = getQuery(event);

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return { exists: false };
    }

    const config = useRuntimeConfig();
    const endpoint = config.shopwareAdminEndpoint as string;

    try {
        const token = await getAdminToken();
        const res = await $fetch<{ total: number }>(`${endpoint}/api/customer`, {
            headers: { Authorization: `Bearer ${token}` },
            query: {
                'filter[email]': email.toLowerCase().trim(),
                limit: 1,
                'fields[customer]': 'id',
            },
        });
        return { exists: (res?.total ?? 0) > 0 };
    } catch {
        return { exists: false };
    }
});
