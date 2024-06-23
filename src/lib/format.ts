export const formatDate = (originalDate: string) => {
  const date = new Date(originalDate);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;

  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
    date.getTime() + userTimezoneOffset
  );
};
