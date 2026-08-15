import { ApiClientError } from '@shopware/api-client';
import { j as useNuxtApp, K as useNotifications } from './server.mjs';

const contextErrors = {
  account_login: {
    "0": "login_no_matching_customer_internal"
  }
};
function useApiErrorsResolver(context) {
  const { $i18n } = useNuxtApp();
  const { t, te } = $i18n;
  const { pushError } = useNotifications();
  const resolveApiErrors = (errors) => {
    const errorsTable = errors.map(({ detail, code, meta }) => {
      if (meta?.parameters) {
        const pureMeta = {};
        for (const [key, value] of Object.entries(meta?.parameters)) {
          pureMeta[key.replace(/[^a-zA-Z0-9 ]/g, "")] = value;
        }
        meta.parameters = pureMeta;
      }
      if (code && te(`errors.${code}`)) {
        return t(`errors.${code}`, { ...meta?.parameters });
      }
      if (context && code && contextErrors[context]?.[code]) {
        return t(`errors.${contextErrors[context][code]}`);
      }
      return detail || "No details provided";
    });
    return errorsTable;
  };
  function handleApiError(error, errorResolver) {
    const localErrorResolver = errorResolver || pushError;
    if (error instanceof ApiClientError) {
      const { resolveApiErrors: resolveApiErrors2 } = useApiErrorsResolver(context);
      const errors = resolveApiErrors2(error.details.errors);
      for (const errorMessage of errors) {
        localErrorResolver(errorMessage);
      }
    } else {
      localErrorResolver(t("errors.message-default"));
    }
  }
  return {
    resolveApiErrors,
    handleApiError
  };
}

export { useApiErrorsResolver as u };
