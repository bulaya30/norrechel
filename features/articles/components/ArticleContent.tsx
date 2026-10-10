import DOMPurify from "isomorphic-dompurify";
import { decode } from "html-entities";
import { getTranslations } from "next-intl/server";

interface ArticleContentProps {
  content: string;
  locale?: "en" | "fr";
}

export default async function ArticleContent({
  content,
  locale = "en",
}: ArticleContentProps) {
  const t = await getTranslations({
    locale,
    namespace: "Blogs.ArticleContent",
  });

  const decodedContent = decode(content);

  const sanitizedContent = DOMPurify.sanitize(decodedContent, {
    USE_PROFILES: {
      html: true,
    },
  });

  if (!sanitizedContent.trim()) {
    return (
      <p className="text-sm italic text-slate-500">
        {t("emptyContent")}
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