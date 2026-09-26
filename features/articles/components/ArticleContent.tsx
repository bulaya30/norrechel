import DOMPurify from "isomorphic-dompurify";
import { decode } from "html-entities";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({
  content,
}: ArticleContentProps) {
  const arr = [content]
  const decodedContent = decode(content);

  const sanitizedContent = DOMPurify.sanitize(decodedContent, {
    USE_PROFILES: {
      html: true,
    },
  });

  if (!sanitizedContent.trim()) {
    return (
      <p className="text-sm italic text-slate-500">
        No content is available for this article.
      </p>
    );
  }

  return (
    <article
      className="wysiwyg-content"
      dangerouslySetInnerHTML={{
        __html: sanitizedContent,
      }}
    />
  );
}