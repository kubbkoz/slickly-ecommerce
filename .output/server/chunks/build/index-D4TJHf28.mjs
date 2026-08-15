import { ax as pascalCase } from '../nitro/nitro.mjs';
import { resolveComponent } from 'vue';

function resolveCmsComponent(content) {
  const componentName = content.type;
  const type = content.apiAlias === "cms_block" ? "Block" : content.apiAlias === "cms_section" ? "Section" : "Element";
  const componentNameToResolve = pascalCase(`Cms-${type}-${componentName}`);
  try {
    const resolvedComponent = resolveComponent(componentNameToResolve);
    return {
      componentName,
      componentNameToResolve,
      isResolved: resolvedComponent !== componentName,
      resolvedComponent: typeof resolvedComponent !== "string" ? resolvedComponent : void 0
    };
  } catch (e) {
    return {
      componentName,
      componentNameToResolve,
      resolvedComponent: void 0,
      resolved: false,
      isResolved: false,
      error: e.message
    };
  }
}

export { resolveCmsComponent as r };
