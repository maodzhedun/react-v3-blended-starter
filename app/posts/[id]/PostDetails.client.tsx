'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
// import { useEffect } from 'react';

import { fetchPostById, fetchUserById } from '@/lib/api';
// import { User } from '@/types/user';

import css from './PostDetails.module.css';

interface PostDetailsClientProps {
  postId: number;
}

export default function PostDetailsClient({ postId }: PostDetailsClientProps) {
  // const { id } = useParams<{ id: number }>();
  const router = useRouter();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
    refetchOnMount: false,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', post?.userId],
    queryFn: () => fetchUserById(post!.userId),
    enabled: !!post?.userId,
  });

  if (isLoading) return <p>Loading...</p>;

  if (userLoading) return <p>Loading user...</p>;

  if (error || !post) return <p>Some error..</p>;

  const handleClickBack = () => {
    router.back();
  };

  // useEffect(() => {
  //   const fn = async () => {};
  //   fn();
  // }, []);

  return (
    <>
      <main className={css.main}>
        <div className={css.container}>
          <div className={css.item}>
            <button className={css.backBtn} onClick={handleClickBack}>
              ← Back
            </button>

            <div className={css.post}>
              <div className={css.wrapper}>
                <div className={css.header}>
                  <h2>{post.title}</h2>
                </div>

                <p className={css.content}>{post.body}</p>
              </div>
              <p className={css.user}>Author: {user?.name}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
