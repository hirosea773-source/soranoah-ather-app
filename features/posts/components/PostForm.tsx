"use client";

import { useState } from "react";
import { createPost } from "@/features/posts/api";

export default function PostForm() {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) return;

    try {
      await createPost(title);
      setTitle("");
      alert("投稿しました");

      // 再読み込み（簡易）
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
      />
      <button type="submit">投稿</button>
    </form>
  );
}
