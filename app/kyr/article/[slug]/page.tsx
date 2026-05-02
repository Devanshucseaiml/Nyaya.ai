import KYRArticleView from "@/components/kyr-article-view"
import { createServerClient } from "@/lib/supabase/server"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data: article } = await supabase.from("kyr_articles").select("category").eq("slug", slug).single()
  const category = (article?.category || "constitutional-rights").toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="min-h-screen bg-background pt-20">
      <KYRArticleView category={category} articleSlug={slug} />
    </div>
  )
}
