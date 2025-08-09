import axios from "axios";
import { Post } from "../types/post";

 export interface FetchPostsResponse {
  posts: Post[];
  totalCount: number; // Total number of posts available
}

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async (searchText: string, page: number) => {
  const response = await axios.get<FetchPostsResponse>("/posts", {
    params: {
      q: searchText,
      _page: page,
      _limit: 10,
    },
  });

  //GET HEADERS X_TOTAL_COUNT
  const totalCount = response.headers["x-total-count"]
    ? parseInt(response.headers["x-total-count"], 10)
    : 0;

  return {
    posts: response.data,
    totalCount: totalCount, // Total number of posts available
  };
};

export const createPost = async (newPost: Omit<Post, 'id'| 'userId' >) => {
  const response = await axios.post<FetchPostsResponse>("/posts", newPost);
  return response.data;
};

export const editPost = async (newDataPost: Post) => {
  const response = await axios.patch<FetchPostsResponse>(`/posts/${newDataPost.id}`, newDataPost);
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await axios.delete<FetchPostsResponse>(`/posts/${postId}`);
  return response.data;
};
