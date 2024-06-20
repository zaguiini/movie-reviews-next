import { getSession } from '@auth0/nextjs-auth0';
import { Dashboard } from './dashboard';

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return <a href='/api/auth/login'>Login</a>;
  }

  return <Dashboard />;
}
