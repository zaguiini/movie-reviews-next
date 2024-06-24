export function getBaseUrl() {
  return process.env.PRODUCTION_URL ?? `http://localhost:${process.env.PORT}`;
}
