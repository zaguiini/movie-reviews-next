import { getUser } from './lib/auth';

export async function Dashboard() {
  const user = await getUser();

  return (
    <div>
      <h1>Hello, {user.name}!</h1>
      <a href='/api/auth/logout'>Logout</a>
    </div>
  );
}
