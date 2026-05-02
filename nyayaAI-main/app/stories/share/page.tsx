import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import StoryShareForm from "@/components/story-share-form"

export default async function ShareStoryPage() {
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

  // Fetch categories for the form
  let categories = []
  let categoriesError = null
  
  try {
    // First check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from("story_categories")
      .select("count")
      .limit(1)
    
    if (tableError) {
      console.error("Table check error:", tableError)
      // Table might not exist, use fallback categories
      categories = []
    } else {
      // Table exists, fetch categories
      const { data: categoriesData, error: categoriesQueryError } = await supabase
        .from("story_categories")
        .select("*")
        .order("name")
      
      if (categoriesQueryError) {
        console.error("Error fetching categories:", categoriesQueryError)
        categoriesError = categoriesQueryError
      } else {
        categories = categoriesData || []
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    categoriesError = error
  }

  // Debug logging
  console.log("ShareStoryPage - categories data:", categories)
  console.log("ShareStoryPage - categories error:", categoriesError)
  console.log("ShareStoryPage - categories count:", categories?.length)

  return (
    <div className="min-h-screen bg-background pt-20">
      <StoryShareForm categories={categories} user={user} />
    </div>
  )
}
