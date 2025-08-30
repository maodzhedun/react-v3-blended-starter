import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import PostPreviewClient from './PostPreview.client';

import { fetchPostById } from '@/lib/api';

type PostDetailsProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPreview({ params }: PostDetailsProps) {
  const resolvedParams = await params;
  console.log('All params:', resolvedParams);
  console.log('PostId from params:', resolvedParams.id);
  console.log('Type of postId:', typeof resolvedParams.id);

  const postId = parseInt(resolvedParams.id, 10);
  console.log('Server postId:', postId);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({

    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostPreviewClient postId={postId} />
    </HydrationBoundary>
  );
}
