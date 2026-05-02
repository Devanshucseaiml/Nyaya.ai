import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ConsultationBooking from "@/components/consultation-booking"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ConsultationPage({ params }: PageProps) {
  const { id } = await params
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

  // Fetch lawyer
  const { data: lawyer } = await supabase
    .from("lawyers")
    .select(`
      *,
      lawyer_specialization_mapping (
        lawyer_specializations (
          name
        )
      )
    `)
    .eq("id", id)
    .single()

  if (!lawyer) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <ConsultationBooking lawyer={lawyer} user={user} />
    </div>
  )
}
