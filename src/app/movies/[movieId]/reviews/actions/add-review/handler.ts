'use server';

import { getUser } from 'src/app/lib/auth';
import { ReviewFormData, reviewForm } from './validation';

export async function addReview(formData: ReviewFormData) {
  const data = reviewForm.parse(formData);
  const user = await getUser();

  console.log({ user, data });
}
