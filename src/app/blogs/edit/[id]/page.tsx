"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BlogForm } from "../../components/BlogForm";
import { Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setPost(json.data);
        } else {
          toast.error(json.error || "Failed to load blog story");
        }
      } catch {
        toast.error("Network error while loading story");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E5A60]" />
        <p className="text-xs text-slate-400 font-semibold">Loading story editor...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Story Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">
          The story you are trying to edit could not be found or may have been deleted.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E5A60] text-white text-xs font-bold rounded-full hover:bg-[#0B2A3D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stories
        </Link>
      </div>
    );
  }

  return <BlogForm initialData={post} isEdit={true} />;
}
