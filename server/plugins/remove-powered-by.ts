// Strips the `x-powered-by: Nuxt` response header to avoid disclosing the
// tech stack. Must run on the `beforeResponse` hook — removing it earlier
// (e.g. in middleware) has no effect because Nitro sets the header later in
// the pipeline.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    event.node.res.removeHeader('x-powered-by')
  })
})
