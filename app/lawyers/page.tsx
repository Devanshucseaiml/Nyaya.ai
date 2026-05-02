import { createServerClient } from "@/lib/supabase/server"
import LawyerDirectory from "@/components/lawyer-directory"

export default async function LawyersPage() {
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

  // Fetch lawyers with their specializations
  const { data: lawyers, error: lawyersError } = await supabase
    .from("lawyers")
    .select(`
      *,
      lawyer_specialization_mapping (
        lawyer_specializations (
          name,
          icon
        )
      )
    `)
    .eq("is_available", true)
    .order("rating", { ascending: false })

  if (lawyersError) {
    console.error("Error fetching lawyers:", lawyersError)
  }

  // Fetch all specializations for filtering
  const { data: specializations, error: specsError } = await supabase
    .from("lawyer_specializations")
    .select("*")
    .order("name")

  if (specsError) {
    console.error("Error fetching specializations:", specsError)
  }

  // Log the data for debugging
  console.log("Lawyers data:", lawyers)
  console.log("Specializations data:", specializations)

  return (
    <div className="min-h-screen bg-background pt-20">
      <LawyerDirectory 
        lawyers={lawyers || []} 
        specializations={specializations || []} 
        user={user} 
      />
    </div>
  )
}
