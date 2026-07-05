// Diagnostic: proves which commit the RUNNING process actually serves.
// HostCreators requires a manual "Spustiť aplikáciu" restart after every deploy —
// if that step is skipped, the old process keeps serving stale code with no
// visible error. Open https://slickly.sk/api/debug/version and compare `sha`
// against the latest commit on the `deploy` branch to rule this out before
// chasing a "the fix didn't work" theory.
export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  return config.public.buildInfo;
});
