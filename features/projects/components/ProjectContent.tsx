import DOMPurify from "isomorphic-dompurify";
import { decode } from "html-entities";

interface ProjectContentProps {
  content: string;
}

export default function ProjectContent({
  content,
}: ProjectContentProps) {
  const decodedContent = decode(content);

  const sanitizedContent = DOMPurify.sanitize(decodedContent, {
    USE_PROFILES: {
      html: true,
    },
  });

  if (!sanitizedContent.trim()) {
    return (
      <p className="text-sm italic text-slate-500">
        No content is available for this project.
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