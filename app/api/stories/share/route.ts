import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { createClient as createSessionClient } from "@/lib/supabase/server"

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin credentials are not configured")
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const sessionSupabase = await createSessionClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await sessionSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const content = typeof body.content === "string" ? body.content.trim() : ""
    const caseType = typeof body.case_type === "string" ? body.case_type.trim() : ""
    const location = typeof body.location === "string" ? body.location.trim() : ""
    const outcome = typeof body.outcome === "string" ? body.outcome.trim() : ""
    const isAnonymous = Boolean(body.is_anonymous)
    const tags = Array.isArray(body.tags) ? body.tags.filter((tag) => typeof tag === "string") : []

    if (!title || !content || !caseType) {
      return NextResponse.json({ error: "Title, content, and case type are required" }, { status: 400 })
    }

    const displayName = body.full_name || user.user_metadata?.full_name || user.email || "User"

    const { data: profileData, error: profileError } = await adminSupabase
      .from("user_profiles")
      .upsert(
        {
          user_id: user.id,
          full_name: displayName,
          location: location || "Unknown",
          profession: "Story Author",
        },
        { onConflict: "user_id" },
      )
      .select("user_id, full_name")
      .single()

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      return NextResponse.json({ error: `Failed to create user profile: ${profileError.message}` }, { status: 500 })
    }

    const { data: storyData, error: storyError } = await adminSupabase
      .from("legal_stories")
      .insert({
        user_id: user.id,
        title,
        content,
        case_type: caseType,
        location: location || null,
        outcome: outcome || null,
        is_anonymous: isAnonymous,
        is_approved: true,
        tags,
      })
      .select("id")
      .single()

    if (storyError) {
      console.error("Error inserting story:", storyError)
      return NextResponse.json({ error: `Failed to submit story: ${storyError.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      storyId: storyData.id,
      authorName: isAnonymous ? "Anonymous User" : profileData.full_name,
    })
  } catch (error) {
    console.error("Error submitting story:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}