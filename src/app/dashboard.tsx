import { getUser } from './lib/auth';

export async function Dashboard() {
  const user = await getUser();

  return (
    <div className='flex'>
      <div className='flex flex-1 items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Hello, {user.name}!
        </h2>
        <a href='/api/auth/logout'>Logout</a>
      </div>
    </div>
  );
}
