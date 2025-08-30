'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { useRouter } from 'next/navigation';

import Modal from '@/components/Modal/Modal';
import { User } from '@/types/user';
import { Post } from '@/types/post';

import css from './PostPreview.module.css';

interface PostPreviewClientProps {
  postId: number;
}

export default function PostPreviewClient({ postId }: PostPreviewClientProps) {
  const router = useRouter();

  console.log('Post ID:', postId);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
    refetchOnMount: false,
  });

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['user', post?.userId],
    queryFn: () => fetchUserById(post!.userId),
    enabled: !!post?.userId,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return <p>Loading...</p>;

  if (userLoading) return <p>Loading...</p>;

  if (error || !post) return <p>Some error..</p>;

  return (
    <Modal onClose={handleClose}>
      <button className={css.backBtn} onClick={handleClose}>
        ← Back
      </button>
      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{post.title}</h2>
          </div>

          <p className={css.content}>{post.body}</p>
        </div>
        <p className={css.user}>{user?.name}</p>
      </div>
    </Modal>
  );
}
