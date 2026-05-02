import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import StoryView from "@/components/story-view"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StoryPage({ params }: PageProps) {
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

  // Fetch the story
  let story = null
  let comments = []
  let userLiked = false

  try {
    // Fetch the story with user profile
    const { data: storyData, error: storyError } = await supabase
      .from("legal_stories")
      .select(`
        *,
        user_profiles (
          full_name,
          location,
          profession
        )
      `)
      .eq("id", id)
      .eq("is_approved", true)
      .single()

    if (storyError) {
      console.error("Error fetching story:", storyError)
      notFound()
    }

    story = storyData

    // Fetch comments for the story
    const { data: commentsData, error: commentsError } = await supabase
      .from("story_comments")
      .select(`
        *,
        user_profiles (
          full_name,
          location,
          profession
        )
      `)
      .eq("story_id", id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    if (commentsError) {
      console.error("Error fetching comments:", commentsError)
      comments = []
    } else {
      comments = commentsData || []
    }

    // Check if user liked the story (if user is logged in)
    if (user) {
      // You can implement like functionality here later
      userLiked = false
    }

  } catch (error) {
    console.error("Unexpected error in StoryPage:", error)
    notFound()
  }

  if (!story) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <StoryView 
        story={story} 
        comments={comments} 
        user={user} 
        userLiked={userLiked}
      />
    </div>
  )
}
