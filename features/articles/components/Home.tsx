
import Summary from "./Summary";

import { getCachedPublishedArticles } from "@/features/articles/queries/article.queries";


export default async function Articles() {

    const articles = await getCachedPublishedArticles();

    return (
        <section className="max-w-5xlye mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <article className="md:col-span-2 accordion accordion-flush" >
                <Summary blogs={articles} />
            </article>
        </section>
    )

}

