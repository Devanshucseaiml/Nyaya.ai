import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import UserSettings from "@/components/user-settings"

export default async function SettingsPage() {
  const supabase = await createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return (
    <div className="min-h-screen bg-background pt-20">
      <UserSettings user={user} profile={profile} />
    </div>
  )
}
