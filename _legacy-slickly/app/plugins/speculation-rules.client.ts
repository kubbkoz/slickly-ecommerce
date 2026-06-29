export default defineNuxtPlugin(() => {
  if (
    !('HTMLScriptElement' in window)
    || !('supports' in HTMLScriptElement)
    || !(HTMLScriptElement as unknown as { supports: (type: string) => boolean }).supports('speculationrules')
  ) return

  const rules = {
    prerender: [{ where: { href_matches: '/produkty/*' }, eagerness: 'moderate' }],
    prefetch: [{ where: { href_matches: '/blog/*' }, eagerness: 'moderate' }],
  }

  const script = document.createElement('script')
  script.type = 'speculationrules'
  script.textContent = JSON.stringify(rules)
  document.head.appendChild(script)
})
