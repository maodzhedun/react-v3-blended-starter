import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";
import { Post } from "../../types/post";

import css from "./EditPostForm.module.css";

interface EditPostFormProps {
  post: Post | null;
  onClose: () => void;
}

interface EditPostFormValues {
  id: number;
  title: string;
  body: string;
}



export default function EditPostForm({ post, onClose }: EditPostFormProps) {
const queryClient = useQueryClient();

const initialValues: EditPostFormValues = {
    id: post?.id ?? 0,
    title: post?.title ?? "",
    body: post?.body ?? "",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long"),
  body: Yup.string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters long"),
});

const editPostMutation = useMutation({
  mutationFn: (values: EditPostFormValues) => editPost(post?.id, values),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    alert("Post edited successfully!");
    onClose();
  },
});

const handleSubmit = (values: EditPostFormValues, actions: FormikHelpers<EditPostFormValues>) => {
  if (post) {
    editPostMutation.mutate({ ...post, ...values });
    actions.resetForm();
    actions.setSubmitting(false);
  }
}
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={editPostMutation.isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
