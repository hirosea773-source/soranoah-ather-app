"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PostForm from "@/features/posts/components/PostForm";

export default function Page() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOtp({
      email: "hirosea773@gmail.com",
    });
    alert("メール確認してください");
  };

  if (!user) {
    return <button onClick={login}>ログイン</button>;
  }

  return (
    <div>
      <h1>ログイン中</h1>
      <PostForm />
    </div>
  );
}
