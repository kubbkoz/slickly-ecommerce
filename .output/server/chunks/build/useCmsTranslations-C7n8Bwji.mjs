import { inject } from 'vue';

function useCmsTranslations() {
  return inject("cmsTranslations", {});
}

export { useCmsTranslations as u };
