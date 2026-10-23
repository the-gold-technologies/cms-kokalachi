import React from "react";
import { BlogForm } from "../components/BlogForm";

export const metadata = {
  title: "Write New Story | Kokalachi CMS",
};

export default function CreateBlogPage() {
  return <BlogForm isEdit={false} />;
}
