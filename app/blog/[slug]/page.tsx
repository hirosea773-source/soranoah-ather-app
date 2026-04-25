import { getPosts, getPostContent } from "@/lib/notion";
import { MDXRemote } from "next-mdx-remote/rsc";

export const revalidate = 60;

const findPostBySlug = (posts: any[], slug: string) =>
  posts.find(
    (post: any) => post.properties.slug.rich_text[0]?.plain_text === slug,
  );

const getPostTitle = (post: any) =>
  post.properties.title.title[0]?.plain_text ?? "Untitled";

const getPostDescription = (content: string) =>
  content.replace(/\s+/g, " ").trim().slice(0, 100);

// =========================
// SEO
// =========================
export async function generateMetadata({ params }: any) {
  const slug = params.slug as string;
  const posts = await getPosts();
  const post = findPostBySlug(posts, slug);

  if (!post) return {};

  const title = getPostTitle(post);
  const content = post.properties.content.rich_text[0]?.plain_text || "";

  return {
    title,
    description: getPostDescription(content),
  };
}

// =========================
// ページ本体
// =========================
export default async function PostPage({ params }: any) {
  const slug = params.slug as string;
  const posts = await getPosts();
  const post = findPostBySlug(posts, slug);

  if (!post) return <div>Not found</div>;

  const title = getPostTitle(post);
  const content = await getPostContent(post.id);

  return (
    <div style={{ padding: "20px" }}>
      <h1>{title}</h1>
      <MDXRemote source={content} />

      <div style={{ marginTop: "40px" }}>
        <hr />
        <p>お問い合わせはこちら</p>
        <a href="/contact">無料相談する</a>
      </div>
    </div>
  );
}
