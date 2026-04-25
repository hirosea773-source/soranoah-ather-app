import { supabase } from "@/lib/supabase";

// 投稿作成（user_id付き）
export const createPost = async (title: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("ログインしてください");

  const { error } = await supabase
    .from("posts")
    .insert([{ title, user_id: user.id }]);

  if (error) throw new Error(error.message);
};

// 投稿取得（自分だけ）
export const getPosts = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};
