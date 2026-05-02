import { createServerClient } from "@/lib/supabase/server"
import StoriesDirectory from "@/components/stories-directory"

export default async function StoriesPage() {
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

  // Initialize variables
  let stories = []
  let categories = []
  let featuredStories = []
  let storiesError = null
  let categoriesError = null
  let featuredError = null

  try {
    // Fetch all legal stories
    const { data: storiesData, error: storiesQueryError } = await supabase
      .from("legal_stories")
      .select(`
        *,
        user_profiles (
          full_name,
          location,
          profession
        )
      `)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    if (storiesQueryError) {
      console.error("Error fetching stories:", storiesQueryError)
      storiesError = storiesQueryError
    } else {
      stories = storiesData || []
    }

    // Fetch featured stories
    const { data: featuredData, error: featuredQueryError } = await supabase
      .from("legal_stories")
      .select(`
        *,
        user_profiles (
          full_name,
          location,
          profession
        )
      `)
      .eq("is_approved", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(3)

    if (featuredQueryError) {
      console.error("Error fetching featured stories:", featuredQueryError)
      featuredError = featuredQueryError
    } else {
      featuredStories = featuredData || []
    }

    // Fetch all categories for filtering
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

  } catch (error) {
    console.error("Unexpected error in StoriesPage:", error)
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <StoriesDirectory 
        stories={stories} 
        categories={categories} 
        featuredStories={featuredStories}
        user={user}
        error={storiesError || categoriesError || featuredError}
      />
    </div>
  )
}
