import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("posts").select("*").limit(1);

  if (error) {
    return Response.json({
      status: "error",
      message: error.message,
    });
  }

  return Response.json({
    status: "ok",
    data,
  });
}
