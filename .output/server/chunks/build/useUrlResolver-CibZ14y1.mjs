import { buildUrlPrefix } from '@shopware/helpers';
import { inject } from 'vue';

function useUrlResolver() {
  const getUrlPrefix = () => inject("urlPrefix", "");
  const resolveUrl = (url) => {
    if (url.length > 2083) {
      throw new Error("URL Input too long");
    }
    const navigationPattern = /[a-zA-Z0-9]+\/navigation\/[a-zA-Z0-9]+/;
    const urlPrefix = getUrlPrefix();
    if (navigationPattern.test(url)) {
      const newUrl = url.split("/").slice(1);
      if (newUrl.length > 0) {
        return `${buildUrlPrefix(newUrl.join("/"), urlPrefix)}`;
      }
    }
    return url;
  };
  return {
    resolveUrl,
    getUrlPrefix
  };
}

export { useUrlResolver as u };
