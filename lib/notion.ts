// =========================
// Notion連携（完全版）
// =========================

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// 投稿一覧
export const getPosts = async () => {
  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATABASE_ID!,
  });

  return response.results;
};

// ブロック取得
export const getBlocks = async (blockId: string) => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
  });

  return response.results;
};

// MD変換
export const getPostContent = async (pageId: string) => {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdBlocks);

  return mdString.parent;
};
