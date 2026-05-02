import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import LawyerProfile from "@/components/lawyer-profile"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LawyerProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  // Get user for personalized features
  let user = null
  try {
    const { data: { user: userData } } = await supabase.auth.getUser()
    user = userData
  } catch (error) {
    console.error("Error getting user:", error)
    // Continue without user data
  }

  // Fetch lawyer with specializations
  const { data: lawyer } = await supabase
    .from("lawyers")
    .select(`
      *,
      lawyer_specialization_mapping (
        lawyer_specializations (
          name,
          description,
          icon
        )
      )
    `)
    .eq("id", id)
    .single()

  if (!lawyer) {
    notFound()
  }

  // Fetch lawyer reviews
  const { data: reviews } = await supabase
    .from("lawyer_reviews")
    .select(`
      *,
      user_profiles (
        full_name
      )
    `)
    .eq("lawyer_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-background pt-20">
      <LawyerProfile lawyer={lawyer} reviews={reviews || []} user={user} />
    </div>
  )
}
