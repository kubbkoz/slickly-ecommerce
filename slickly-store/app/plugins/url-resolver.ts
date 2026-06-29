import { defineNuxtPlugin } from '#app';
// resolveUrl is auto-imported, but explicit import ensures type safety and clarity
import { resolveUrl } from '~/utils/url';

declare module '#app' {
    interface NuxtApp {
        $url(entity: any): string;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $url(entity: any): string;
    }
}

/**
 * SLICKLY URL Resolver Plugin
 * Injects $url(entity) globally for both templates and script blocks.
 * Automatically handles locale prefixes via useLocalePath.
 */
export default defineNuxtPlugin(() => {
    // useLocalePath is an auto-imported composable from @nuxtjs/i18n
    const localePath = useLocalePath();

    return {
        provide: {
            /**
             * Resolves any entity to its correct, localized SEO URL.
             * @param entity Product | Category | String | null
             */
            url: (entity: any) => {
                if (!entity) return localePath('/');
                const rawPath = resolveUrl(entity);
                return localePath(rawPath);
            }
        }
    };
});
