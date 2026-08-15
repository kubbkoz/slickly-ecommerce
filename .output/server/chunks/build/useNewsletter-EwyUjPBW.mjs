import { ref, computed } from 'vue';
import { e as useShopwareContext, M as useInternationalization } from './server.mjs';

function useNewsletter() {
  const SUBSRIBE_KEY = "subscribe";
  const UNSUBSCRIBE_KEY = "unsubscribe";
  const { apiClient } = useShopwareContext();
  const { getStorefrontUrl } = useInternationalization();
  const newsletterStatus = ref("undefined");
  async function newsletterSubscribe(params) {
    const result = await apiClient.invoke(
      "subscribeToNewsletter post /newsletter/subscribe",
      {
        body: {
          ...params,
          storefrontUrl: getStorefrontUrl()
        }
      }
    );
    return result.data;
  }
  async function newsletterUnsubscribe(email) {
    await apiClient.invoke(
      "unsubscribeToNewsletter post /newsletter/unsubscribe",
      {
        body: { email }
      }
    );
  }
  async function getNewsletterStatus() {
    const response = await apiClient.invoke(
      "readNewsletterRecipient post /account/newsletter-recipient"
    );
    newsletterStatus.value = response.data.status;
    return response.data;
  }
  const isNewsletterSubscriber = computed(
    () => !["optOut", "undefined"].includes(newsletterStatus.value)
  );
  const confirmationNeeded = computed(
    () => newsletterStatus.value === "notSet"
  );
  return {
    newsletterSubscribe,
    newsletterUnsubscribe,
    isNewsletterSubscriber,
    getNewsletterStatus,
    newsletterStatus,
    confirmationNeeded,
    SUBSRIBE_KEY,
    UNSUBSCRIBE_KEY
  };
}

export { useNewsletter as u };
