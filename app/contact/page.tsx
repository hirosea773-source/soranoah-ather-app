"use client";

import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("送信成功");
      form.reset();
    } else {
      alert("エラー");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>お問い合わせ</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="名前" required />
        <br />
        <input name="email" placeholder="メール" required />
        <br />
        <textarea name="message" placeholder="内容" required />
        <br />
        <button disabled={loading}>{loading ? "送信中..." : "送信"}</button>
      </form>
    </div>
  );
}
