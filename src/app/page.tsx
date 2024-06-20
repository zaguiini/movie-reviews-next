import { getSession } from '@auth0/nextjs-auth0';
import { Dashboard } from './Dashboard';

export default async function Home({ searchParams: { query = '' } }) {
  const session = await getSession();

  return (
    <div className='px-4 py-6'>
      {session ? (
        <Dashboard query={query} />
      ) : (
        <a href='/api/auth/login'>Login</a>
      )}
    </div>
  );
}
