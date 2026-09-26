import Hero from "@/features/home/components/Hero";
import HomeCard from "./HomeCard";
// import { getCachedPublishedArticles } from "@/features/articles/queries/article.queries";
// import { getCachedPublishedProjects } from "@/features/projects/queries/project.queries";
// import { getCachedCategories } from "@/features/categories/queries/category.queries";

export default async function Page() {
  // const articles = await getCachedPublishedArticles();
  // const projects = await getCachedPublishedProjects();
  // const categories = await getCachedCategories();

  // console.log(categories);
  return (
    <div>
        <Hero />
        <section className="bg-gray-100 px-2 py-6 shadow-sm rounded-sm jystify-center items-center mb-8">
                <h2 className='text-center text-blue-900 text-2xl font-bold my-4'> What I Do</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2">
                    <article className="">
                        <HomeCard 
                            title="Inspiring Articles" 
                            content="I share insights from personal experiences and books I read to help people stay motivated and build lasting habits for success."
                        />
                    </article>
                    <article className="">
                        <HomeCard 
                            title="Data Analysis Projects" 
                            content="I use data to uncover stories, patterns, and solutions. My projects showcase how analysis can solve real-world problems."
                        />
                    </article>
                    <article className="">
                        <HomeCard 
                            title="Technology & Solutions" 
                            content="From websites to desktop apps, I create tools that make an impact and show how technology improves life."
                        />
                    </article>
                </div>
            </section>
    </div>
  );
}
