import css from "./PostList.module.css";
import { Post } from "../../types/post";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
}

export default function PostList({ posts }: PostListProps) {
  // console.log(posts)

  return (
    <>
      <ul className={css.list}>
        {posts.map((post) => (
          <li key={post.id} className={css.listItem}>
            <h2 className={css.title}>{post.title}</h2>
            <p className={css.content}>{post.body}</p>
            <div className={css.footer}>
              <button className={css.edit}>Edit</button>
              <button className={css.delete}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
