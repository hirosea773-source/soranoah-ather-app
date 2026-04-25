import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// サーバー専用クライアント（セキュア）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ←重要：公開しない
);

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, message } = body;

  // バリデーション（最低限）
  if (!name || !email || !message) {
    return NextResponse.json({ error: "入力不足" }, { status: 400 });
  }

  const { error } = await supabase.from("contacts").insert([
    {
      name,
      email,
      message,
    },
  ]);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
