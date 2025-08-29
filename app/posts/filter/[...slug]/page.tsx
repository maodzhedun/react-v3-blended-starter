import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchPosts } from '@/lib/api';
import PostsClient from './Posts.client';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const userId = slug[0] === 'All' ? undefined : slug[0];
  
  if (userId) {
    return {
      title: `Posts - User ${userId}`,
      description: `Posts by user ${userId}`,
    };
  }
  
  return {
    title: 'Posts - All Users',
    description: 'All posts from all users',
  };
}

export default async function PostsPage({ params }: Props) {
  const { slug } = await params;

  const userId = slug[0] === 'All' ? undefined : slug[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['posts', '', 1, userId],
    queryFn: () => fetchPosts({ searchText: '', page: 1, ...(userId && { userId }) }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsClient
        initialData={queryClient.getQueryData(['posts', '', 1, userId])!}
        userId={slug[0]}
      />
    </HydrationBoundary>
  );
}
