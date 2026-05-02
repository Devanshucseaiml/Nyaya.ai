import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import UserDashboard from "@/components/user-dashboard"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  // Check if user is authenticated
  let user = null
  try {
    const { data: { user: userData } } = await supabase.auth.getUser()
    user = userData
  } catch (error) {
    console.error("Error getting user:", error)
    // Redirect to login if we can't get user data
    redirect("/auth/login")
  }

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's consultation requests
  const { data: consultations } = await supabase
    .from("consultation_requests")
    .select(`
      *,
      lawyers (
        id,
        full_name,
        email,
        phone,
        location,
        consultation_fee,
        profile_image
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's reviews
  const { data: reviews } = await supabase
    .from("lawyer_reviews")
    .select(`
      *,
      lawyers (
        id,
        full_name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background pt-20">
      <UserDashboard 
        user={user} 
        consultations={consultations || []} 
        reviews={reviews || []} 
      />
    </div>
  )
}
