export function getBaseUrl() {
  return process.env.VERCEL_ENV === 'production'
    ? process.env.PRODUCTION_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT}`;
}
