// routeRules '/**' zapína `s-maxage=3600, stale-while-revalidate=86400` a Nitro tento
// header nastaví PRED renderom stránky. Vlastný error handler (defaultHandler) ho
// následne strhne len pri 404, nie pri 500 — takže jednorazové prechodné SSR zlyhanie
// (napr. krátky výpadok siete k mtsport.store) sa môže s týmto cache headerom uložiť
// do CDN/proxy pred HostCreators a servírovať sa ako 500 ďalšiu hodinu, kým ho niekto
// nezneplatní. Toto to explicitne prebije pre KAŽDÚ chybovú odpoveď.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    const status = response.statusCode ?? event.node.res.statusCode;
    if (status && status >= 400) {
      setHeader(event, 'cache-control', 'no-store, no-cache, must-revalidate');
    }
  });
});
