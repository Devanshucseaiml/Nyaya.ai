import KYRCategoryView from "@/components/kyr-category-view"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-background pt-20">
      <KYRCategoryView category={slug} />
    </div>
  )
}
