import axios from "axios";
import { Post } from "../types/Post"; 

interface FetchPostsResponse {
    posts: Post[];
}

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async (searchText, page) => {
    const response = await axios.get<FetchPostsResponse>("/posts", {
        params: {
            q: searchText,
            _page: page,
            _limit: 10
        }
    });
    return response.data.posts;
};

export const createPost = async (newPost) => {
    const response = await axios.post<FetchPostsResponse>("/posts", newPost);
    return response.data;
};

export const editPost = async (newDataPost) => {
    const response = await axios.put<FetchPostsResponse>(`/posts/${newDataPost.id}`, newDataPost);
    return response.data;
};

export const deletePost = async (postId) => {
    const response = await axios.delete<FetchPostsResponse>(`/posts/${postId}`);
    return response.data;
};
