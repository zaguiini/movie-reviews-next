'use server';

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const setLocale = (locale: string) => {
  cookies().set('locale', locale);
};

const getLocale = () => {
  const locale = cookies().get('locale');

  if (locale) {
    return locale.value;
  }

  return 'en';
};

export default getRequestConfig(async () => {
  const locale = getLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
