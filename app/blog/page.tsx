import Link from "next/link";
import { getPosts } from "@/lib/notion";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div style={{ padding: "20px" }}>
      <h1>ブログ</h1>

      <ul>
        {posts.map((post: any) => {
          const title =
            post.properties.title.title[0]?.plain_text || "No title";

          const slug = post.properties.slug.rich_text[0]?.plain_text || "";

          return (
            <li key={post.id}>
              <Link href={`/blog/${slug}`}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
