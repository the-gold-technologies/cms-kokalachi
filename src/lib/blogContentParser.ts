export interface BlogBlockItem {
  type: "p" | "tip" | "quote" | "image" | "postcard" | "list";
  text?: string;
  src?: string;
  alt?: string;
  caption?: string;
  signature?: string;
  style?: "check" | "cards";
  items?: { title?: string; text: string }[];
}

/**
 * Converts structured BlogBlockItem array into clean, continuous story markdown text.
 */
export function blocksToStoryText(blocks: BlogBlockItem[] = []): string {
  if (!blocks || blocks.length === 0) return "";

  const segments: string[] = [];

  for (const block of blocks) {
    if (block.type === "p") {
      if (block.text && block.text.trim()) {
        segments.push(block.text.trim());
      }
    } else if (block.type === "tip") {
      segments.push(`:::tip\n${(block.text || "").trim()}\n:::`);
    } else if (block.type === "quote") {
      segments.push(`:::quote\n${(block.text || "").trim()}\n:::`);
    } else if (block.type === "image") {
      const lines = [":::polaroid"];
      if (block.src) lines.push(`src: ${block.src.trim()}`);
      if (block.alt) lines.push(`alt: ${block.alt.trim()}`);
      if (block.caption) lines.push(`caption: ${block.caption.trim()}`);
      lines.push(":::");
      segments.push(lines.join("\n"));
    } else if (block.type === "postcard") {
      const lines = [":::postcard"];
      if (block.signature) lines.push(`signature: ${block.signature.trim()}`);
      if (block.text) lines.push(`text: ${block.text.trim()}`);
      lines.push(":::");
      segments.push(lines.join("\n"));
    } else if (block.type === "list") {
      const kind = block.style === "check" ? "checks" : "cards";
      const lines = [`:::${kind}`];
      if (block.items && block.items.length > 0) {
        for (const it of block.items) {
          if (it.title) {
            lines.push(`- **${it.title.trim()}** ${it.text.trim()}`);
          } else {
            lines.push(`- ${it.text.trim()}`);
          }
        }
      }
      lines.push(":::");
      segments.push(lines.join("\n"));
    }
  }

  return segments.join("\n\n");
}

/**
 * Parses continuous story markdown text back into structured BlogBlockItem array.
 */
export function storyTextToBlocks(content: string = ""): BlogBlockItem[] {
  if (!content || !content.trim()) return [];

  const trimmed = content.trim();
  const blocks: BlogBlockItem[] = [];

  // Match :::tag ... ::: blocks or plain text paragraphs
  const blockRegex = /:::(tip|quote|polaroid|postcard|cards|checks)\s*\n([\s\S]*?)\n:::/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(trimmed)) !== null) {
    const preText = trimmed.slice(lastIndex, match.index).trim();
    if (preText) {
      const paras = preText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      for (const p of paras) {
        blocks.push({ type: "p", text: p });
      }
    }

    const tag = match[1];
    const body = match[2].trim();

    if (tag === "tip") {
      blocks.push({ type: "tip", text: body });
    } else if (tag === "quote") {
      blocks.push({ type: "quote", text: body });
    } else if (tag === "polaroid") {
      let src = "";
      let alt = "";
      let caption = "";
      const lines = body.split("\n");
      for (const line of lines) {
        const mSrc = line.match(/^src:\s*(.+)$/i);
        const mAlt = line.match(/^alt:\s*(.+)$/i);
        const mCap = line.match(/^caption:\s*(.+)$/i);
        if (mSrc) src = mSrc[1].trim();
        else if (mAlt) alt = mAlt[1].trim();
        else if (mCap) caption = mCap[1].trim();
      }
      blocks.push({
        type: "image",
        src: src || "",
        alt: alt || "Travel photograph",
        caption: caption || "",
      });
    } else if (tag === "postcard") {
      let signature = "";
      let text = "";
      const lines = body.split("\n");
      const textLines: string[] = [];
      for (const line of lines) {
        const mSig = line.match(/^signature:\s*(.+)$/i);
        const mTxt = line.match(/^text:\s*(.+)$/i);
        if (mSig) {
          signature = mSig[1].trim();
        } else if (mTxt) {
          textLines.push(mTxt[1].trim());
        } else {
          textLines.push(line.trim());
        }
      }
      text = textLines.join("\n").trim();
      blocks.push({
        type: "postcard",
        text: text || "",
        signature: signature || "someone you met on day one",
      });
    } else if (tag === "cards" || tag === "checks") {
      const style: "cards" | "check" = tag === "cards" ? "cards" : "check";
      const items: { title?: string; text: string }[] = [];
      const lines = body.split("\n");
      for (const line of lines) {
        const cleaned = line.replace(/^[-*•\d.]+\s*/, "").trim();
        if (!cleaned) continue;
        const boldMatch = cleaned.match(/^\*\*(.+?)\*\*\s*(.*)$/);
        if (boldMatch) {
          items.push({
            title: boldMatch[1].trim(),
            text: boldMatch[2].trim(),
          });
        } else {
          items.push({ text: cleaned });
        }
      }
      blocks.push({
        type: "list",
        style,
        items: items.length > 0 ? items : [{ text: body }],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Any remaining text after the last match
  const remainingText = trimmed.slice(lastIndex).trim();
  if (remainingText) {
    const paras = remainingText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of paras) {
      blocks.push({ type: "p", text: p });
    }
  }

  return blocks;
}
