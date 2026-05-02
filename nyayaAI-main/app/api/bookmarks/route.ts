import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()
    
    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    const supabase = await createServerClient()
    
    // Get user from request
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if bookmark already exists
    const { data: existingBookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('article_id', articleId)
      .single()

    if (existingBookmark) {
      // Remove bookmark if it exists
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId)

      if (deleteError) {
        console.error('Error removing bookmark:', deleteError)
        return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        action: 'removed',
        message: 'Bookmark removed successfully' 
      })
    } else {
      // Add bookmark if it doesn't exist
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          article_id: articleId
        })

      if (insertError) {
        console.error('Error adding bookmark:', insertError)
        return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        action: 'added',
        message: 'Bookmark added successfully' 
      })
    }

  } catch (error) {
    console.error('Error handling bookmark:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get user from request
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's bookmarks with article details
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        kyr_articles (
          id,
          title,
          slug,
          category,
          summary,
          content
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
      return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
    }

    return NextResponse.json({ bookmarks: bookmarks || [] })

  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



