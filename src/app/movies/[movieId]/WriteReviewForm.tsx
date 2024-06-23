'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from 'src/components/ui/Textarea';
import { Button } from 'src/components/ui/Button';
import { useForm } from 'react-hook-form';
import { LoaderIcon } from 'lucide-react';
import { addReview } from './reviews/actions/add-review/handler';
import {
  ReviewFormData,
  reviewForm,
} from './reviews/actions/add-review/validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/Form';
import { Input } from 'src/components/ui/Input';

export const WriteReviewForm = ({
  movieId,
  parentReviewId,
}: {
  movieId: number;
  parentReviewId?: number;
}) => {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewForm),
    defaultValues: { movieId, parentReviewId },
  });

  async function onSubmit(review: ReviewFormData) {
    await addReview(review);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid w-full gap-4'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='What is your opinion?' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='review'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {parentReviewId !== undefined ? 'Reaction' : 'Review'}
              </FormLabel>
              <FormControl>
                <Textarea placeholder='Please elaborate.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <LoaderIcon className='mr-2 motion-safe:animate-[spin_3s_linear_infinite]' />
          )}
          Write {parentReviewId !== undefined ? 'reaction' : 'review'}
        </Button>
      </form>
    </Form>
  );
};
