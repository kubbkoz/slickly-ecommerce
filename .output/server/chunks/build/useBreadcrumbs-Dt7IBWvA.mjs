import { computed } from 'vue';
import { R as useContext } from './server.mjs';

function useBreadcrumbs(newBreadcrumbs) {
  const _breadcrumbs = useContext("swBreadcrumb", {
    replace: newBreadcrumbs
  });
  const clearBreadcrumbs = () => {
    _breadcrumbs.value = [];
  };
  const pushBreadcrumb = (breadcrumb) => {
    if (_breadcrumbs.value) _breadcrumbs.value.push(breadcrumb);
    else _breadcrumbs.value = [breadcrumb];
  };
  const buildDynamicBreadcrumbs = async (breadcrumbs) => {
    _breadcrumbs.value = breadcrumbs.map((breadcrumb) => {
      return {
        ...breadcrumb,
        path: `/${breadcrumb.path}`
      };
    });
  };
  return {
    clearBreadcrumbs,
    breadcrumbs: computed(() => _breadcrumbs.value),
    buildDynamicBreadcrumbs,
    pushBreadcrumb
  };
}

export { useBreadcrumbs as u };
