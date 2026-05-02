import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import KYRCategoryView from "@/components/kyr-category-view"

interface KYRCategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function KYRCategoryPage({ params }: KYRCategoryPageProps) {
  const { category } = await params
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<div className="text-center">Loading category...</div>}>
            <KYRCategoryView category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
