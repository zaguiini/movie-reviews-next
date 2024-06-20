import { getSession } from '@auth0/nextjs-auth0';
import { Dashboard } from './Dashboard';

export default async function Home({ searchParams: { query = '' } }) {
  const session = await getSession();

  if (!session) {
    return <a href='/api/auth/login'>Login</a>;
  }

  return <Dashboard query={query} />;
}
