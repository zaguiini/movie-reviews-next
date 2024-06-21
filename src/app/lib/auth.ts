import { getSession } from '@auth0/nextjs-auth0';

type User = {
  name: string;
  email: string;
  picture: string;
};

export const getUser = async () => {
  const session = await getSession();

  if (!session) {
    throw new Error('User not found.');
  }

  return session.user as User;
};

export const getPotentialUser = async () => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return session.user as User;
};
