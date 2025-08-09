import css from "./PostList.module.css";
import { Post } from "../../types/post";
import { deletePost } from "../../services/postService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (post: Post) => void;

}

export default function PostList({ posts, toggleModal, toggleEditPost }: PostListProps) {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      alert("Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });


  const handleDeletePost = (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(postId);
    }
  }; 
  
  const handleEditClick = (post: Post) => {
    toggleModal();
    toggleEditPost(post);
  };


  return (
    <>
      <ul className={css.list}>
        {posts.map((post) => (
          <li key={post.id} className={css.listItem}>
            <h2 className={css.title}>{post.title}</h2>
            <p className={css.content}>{post.body}</p>
            <div className={css.footer}>
            {/* <button className={css.edit} onClick={toggleModal} toggleEditPost={post}>Edit</button> */}
              <button className={css.edit} onClick={() => handleEditClick(post)}>Edit</button>
              <button className={css.delete} onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
