"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  MapPin, 
  Calendar,
  User,
  ArrowLeft,
  Share2,
  CheckCircle,
  AlertCircle,
  Send,
  ThumbsUp,
  Trash2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"

interface StoryViewProps {
  story: any
  comments: any[]
  user: any
  userLiked: boolean
}

export default function StoryView({ story, comments, user, userLiked }: StoryViewProps) {
  const [isLiked, setIsLiked] = useState(userLiked)
  const [likeCount, setLikeCount] = useState(story.like_count)
  const [commentText, setCommentText] = useState("")
  const [isAnonymousComment, setIsAnonymousComment] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [newComments, setNewComments] = useState<any[]>([])
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [commentError, setCommentError] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleDeleteStory = async () => {
    if (!user) return

    if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      try {
        // Delete the story (this will cascade delete comments)
        const { error: deleteError } = await supabase
          .from('legal_stories')
          .delete()
          .eq('id', story.id)

        if (deleteError) {
          throw new Error(`Failed to delete story: ${deleteError.message}`)
        }

        // Redirect to stories page
        router.push('/stories')
      } catch (error) {
        console.error('Error deleting story:', error)
        setMessage({
          type: 'error',
          text: 'Failed to delete story. Please try again.'
        })
      }
    }
  }

  const handleLike = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      if (isLiked) {
        // Unlike - remove from story_likes table
        const { error: unlikeError } = await supabase
          .from("story_likes")
          .delete()
          .eq("story_id", story.id)
          .eq("user_id", user.id)

        if (unlikeError) throw unlikeError
        
        setLikeCount(likeCount - 1)
        setIsLiked(false)
      } else {
        // Like - add to story_likes table
        const { error: likeError } = await supabase
          .from("story_likes")
          .insert({
            story_id: story.id,
            user_id: user.id,
          })

        if (likeError) throw likeError
        
        setLikeCount(likeCount + 1)
        setIsLiked(true)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      setMessage({
        type: 'error',
        text: 'Failed to update like. Please try again.'
      })
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setIsSubmittingComment(true)
    setCommentError(null)

    try {
      let userId = null
      let commenterName = 'Anonymous Commenter'
      let isAnonymous = true

      if (user && !isAnonymousComment) {
        // User is logged in and doesn't want to be anonymous
        // Use existing user profile or create one with their name
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('id', user.id)
          .single()

        if (existingProfile) {
          userId = existingProfile.id
          commenterName = existingProfile.full_name || user.user_metadata?.full_name || 'User'
          isAnonymous = false
        } else {
          // Create profile for logged-in user
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || 'User',
              location: 'Unknown',
              profession: 'User'
            })
            .select('id, full_name')
            .single()

          if (profileError) {
            console.error('Error creating user profile:', profileError)
            throw new Error(`Failed to create user profile: ${profileError.message}`)
          }
          
          userId = profileData.id
          commenterName = profileData.full_name
          isAnonymous = false
        }
      } else {
        // Anonymous comment - create temporary profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            full_name: 'Anonymous Commenter',
            location: 'Unknown',
            profession: 'Commenter'
          })
          .select('id')
          .single()

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          throw new Error(`Failed to create user profile for comment: ${profileError.message}`)
        }
        
        userId = profileData.id
        commenterName = 'Anonymous Commenter'
        isAnonymous = true
      }

      // Insert the comment
      const { data: commentData, error: commentError } = await supabase
        .from('story_comments')
        .insert({
          story_id: story.id,
          user_id: userId,
          content: commentText.trim(),
          is_anonymous: isAnonymous,
          is_approved: true
        })
        .select('*')
        .single()

      if (commentError) {
        console.error('Error inserting comment:', commentError)
        throw new Error(`Failed to add comment: ${commentError.message}`)
      }

      // Update the comment count on the story
      await supabase
        .from('legal_stories')
        .update({ comment_count: (story.comment_count || 0) + 1 })
        .eq('id', story.id)

      // Add the new comment to the local state
      const newComment = {
        ...commentData,
        user_profiles: { full_name: commenterName }
      }
      
      setNewComments([newComment, ...newComments])
      setCommentText('')
      setCommentError(null)

      // Show success message
      setMessage({
        type: 'success',
        text: 'Comment added successfully!'
      })

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000)

    } catch (error) {
      console.error('Error adding comment:', error)
      setCommentError(error instanceof Error ? error.message : 'Failed to add comment')
      setMessage({
        type: 'error',
        text: 'Failed to add comment. Please try again.'
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return

    if (confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      try {
        // Delete the comment
        const { error: deleteError } = await supabase
          .from('story_comments')
          .delete()
          .eq('id', commentId)

        if (deleteError) {
          throw new Error(`Failed to delete comment: ${deleteError.message}`)
        }

        // Remove from local state
        setNewComments(prev => prev.filter(c => c.id !== commentId))

        // Update comment count on story
        await supabase
          .from('legal_stories')
          .update({ comment_count: (story.comment_count || 0) - 1 })
          .eq('id', story.id)

        setMessage({
          type: 'success',
          text: 'Comment deleted successfully!'
        })

        setTimeout(() => setMessage(null), 3000)
      } catch (error) {
        console.error('Error deleting comment:', error)
        setMessage({
          type: 'error',
          text: 'Failed to delete comment. Please try again.'
        })
      }
    }
  }

  const allComments = [...comments, ...newComments]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/stories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stories
            </Link>
          </Button>
        </div>

        {/* Story Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    style={{ 
                      backgroundColor: story.story_category_mapping?.[0]?.story_categories?.color + '20',
                      color: story.story_category_mapping?.[0]?.story_categories?.color
                    }}
                  >
                    {story.case_type}
                  </Badge>
                  {story.is_anonymous ? (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      Anonymous
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(story.user_profiles?.full_name || "User")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{story.user_profiles?.full_name}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-3xl font-serif mb-2">{story.title}</CardTitle>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(story.created_at)}
                  </span>
                  {story.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {story.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {story.view_count} views
                  </span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              {/* Delete Story Button - Only show if user owns the story */}
              {user && story.user_id === user.id && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteStory}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Story Content */}
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {story.content}
              </p>
            </div>

            {/* Outcome */}
            {story.outcome && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Case Outcome
                </h4>
                <p className="text-green-700">{story.outcome}</p>
              </div>
            )}

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t">
              <Button
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {likeCount} {likeCount === 1 ? "Like" : "Likes"}
              </Button>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                {allComments.length} {allComments.length === 1 ? "Comment" : "Comments"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({allComments.length})
            </CardTitle>
            <CardDescription>
              Share your thoughts and experiences related to this story
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Add Comment */}
            {user ? (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Add a Comment</h4>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="anonymous-comment"
                      checked={isAnonymousComment}
                      onCheckedChange={setIsAnonymousComment}
                    />
                    <label htmlFor="anonymous-comment" className="text-sm">
                      Post anonymously
                    </label>
                  </div>
                </div>
                
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts, experiences, or advice..."
                  rows={3}
                  className="mb-3"
                />
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {commentText.length}/500 characters
                  </p>
                  <Button
                    onClick={handleComment}
                    disabled={isSubmittingComment || !commentText.trim()}
                    size="sm"
                  >
                    {isSubmittingComment ? (
                      "Posting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/auth/login")}>sign in</Button> to add a comment.
                </AlertDescription>
              </Alert>
            )}

            {/* Message */}
            {message && (
              <Alert className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {allComments.length > 0 ? (
                allComments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      {comment.is_anonymous ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(comment.user_profiles?.full_name || "User")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.is_anonymous ? "Anonymous" : comment.user_profiles?.full_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                          
                          {/* Delete Comment Button - Only show if user owns the comment */}
                          {user && comment.user_id === user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                  <p className="text-muted-foreground">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
