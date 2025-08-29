import axios from 'axios';
import { Post } from '@/types/post';
import { User } from '@/types/user';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';


export type FetchPostsResponse = Post[];

export const fetchPosts = async ({
  searchText,
  page,
  userId,
}: {
  searchText: string;
  page: number;
  userId?: string;
}): Promise<{ posts: Post[]; totalCount: number }> => {
  const response = await axios.get<FetchPostsResponse>('/posts', {
    params: {
      userId,
      ...(searchText !== '' && { q: searchText }),
      _page: page,
      _limit: 8,
    },
  });
  const totalCount = Number(response.headers['x-total-count']);
  return { posts: response.data, totalCount };
};

interface NewPostContent {
  title: string;
  body: string;
}

interface EditedPost {
  id: number;
  title: string;
  body: string;
}

export const createPost = async (newPost: NewPostContent) => {
  const response = await axios.post<Post>('/posts', newPost);
  return response.data;
};

export const editPost = async (newDataPost: EditedPost) => {
  const response = await axios.patch<Post>(`/posts/${newDataPost.id}`, newDataPost);
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await axios.delete<Post>(`/posts/${postId}`);
  return response.data;
};

export const fetchPostById = async (postId: number) => {
  const response = await axios.get<Post>(`/posts/${postId}`);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axios.get<User>('/users');
  return response.data;
};

export const fetchUserById = async (id: number) => {
  const response = await axios.get<User>(`/users/${id}`);
  return response.data;
};



// export interface FetchPostsResponse {
//   posts: Post[];
//   totalCount: number; // Total number of posts available
// }

// export const fetchPosts = async (searchText: string, page: number) => {
//   const response = await axios.get<FetchPostsResponse>('/posts', {
//     params: {
//       q: searchText,
//       _page: page,
//       _limit: 10,
//     },
//   });

//   //GET HEADERS X_TOTAL_COUNT
//   const totalCount = response.headers['x-total-count']
//     ? parseInt(response.headers['x-total-count'], 10)
//     : 0;

//   return {
//     posts: response.data,
//     totalCount: totalCount, // Total number of posts available
//   };
// };

// export const createPost = async (newPost: Omit<Post, 'id' | 'userId'>) => {
//   const response = await axios.post<FetchPostsResponse>('/posts', newPost);
//   return response.data;
// };

// export const editPost = async (newDataPost: Post) => {
//   const response = await axios.patch<FetchPostsResponse>(`/posts/${newDataPost.id}`, newDataPost);
//   return response.data;
// };

// export const deletePost = async (postId: number) => {
//   const response = await axios.delete<FetchPostsResponse>(`/posts/${postId}`);
//   return response.data;
// };