import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import PostDetailsClient from './PostDetails.client';
import { fetchPostById, fetchUserById } from '@/lib/api';


type PostDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PostDetailsProps): Promise<Metadata>  {
  const { id } = await params;
  const postId = parseInt(id);

  try {
    const post = await fetchPostById(postId);
    const user = await fetchUserById(post.userId);
    
    return {
      title: post.title,
      description: post.body.slice(0, 30),
      authors: [{ name: user.name }],
    };

  } catch {
    return {
      title: 'Post not found',
      description: 'The user for this post does not exist',
    };
  }

}

export default async function PostDetails({ params }: PostDetailsProps) {
  const { id } = await params;
  const postId = parseInt(id);
  
  const queryClient = new QueryClient();

  try {
    // Prefetch post data
    await queryClient.prefetchQuery({
      queryKey: ['post', postId],
      queryFn: () => fetchPostById(postId),
    });

    // Prefetch user data if post exists
    const post = queryClient.getQueryData<{ userId: number }>(['post', postId]);
    if (post) {
      await queryClient.prefetchQuery({
        queryKey: ['user', post.userId],
        queryFn: () => fetchUserById(post.userId),
        // enabled: !!post.userId,
      });
    }

  } catch (error) {
    console.error('Error prefetching data:', error);
  };
  



  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailsClient postId={postId} />
    </HydrationBoundary>
  );
}
