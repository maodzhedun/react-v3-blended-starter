import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";

import { createPost } from "../../services/postService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./CreatePostForm.module.css";

interface PostFormProps {
  onClose: () => void;
}

interface PostFormValues {
  title: string;
  body: string;
}

const initialValues: PostFormValues = {
  title: "",
  body: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long"),
  body: Yup.string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters long"),
});

export default function PostForm({ onClose }: PostFormProps) {
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      alert("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
  });

  const handleSubmit = (value: PostFormValues, actions: FormikHelpers<PostFormValues>) => {
    console.log(value);
    createPostMutation.mutate(value);
    actions.resetForm();
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={createPostMutation.isPending}
          >
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
