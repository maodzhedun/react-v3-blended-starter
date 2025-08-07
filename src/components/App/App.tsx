import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EditPostForm from "../EditPostForm/EditPostForm";

import { fetchPosts } from "../../services/postService";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Post } from "../../types/post";

import css from "./App.module.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreatePost(false);
    setIsEditPost(false);
    setEditPost(null);
  };

  const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["posts", debouncedSearchQuery, currentPage],
    queryFn: () => fetchPosts(debouncedSearchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  
  const posts = Array.isArray(data?.posts) ? data.posts : [];
  const totalPages = data ? Math.ceil(data.totalCount / 10) : 0;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCreatePost = () => {
    setIsCreatePost(true);
    openModal();
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} value={searchQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={handleCreatePost}>
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {isCreatePost ? <CreatePostForm onClose={closeModal} /> : isEditPost ? <EditPostForm post={editedPost} onClose={closeModal} /> : null}
          {/* {isCreatePost && <CreatePostForm onClose={closeModal} />} */}
          {/* {isCreatePost ? <CreatePostForm /> : isEditPost ? <EditPostForm post={editedPost} /> : null} */}
        </Modal>
      )}
      {posts.length > 0 && (
        <PostList posts={posts} toggleModal={openModal} toggleEditPost={setEditPost} />
      )}
      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}
    </div>
  );
}
