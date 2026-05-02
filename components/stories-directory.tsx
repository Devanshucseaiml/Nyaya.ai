"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  MessageCircle, 
  MapPin, 
  Calendar,
  Plus,
  Star,
  User,
  Shield,
  Home,
  Users,
  ShoppingCart,
  Building,
  Calculator,
  Globe,
  Lightbulb,
  Leaf,
  Monitor,
  Scale,
  Heart as HeartIcon
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface StoriesDirectoryProps {
  stories: any[]
  categories: any[]
  featuredStories: any[]
  user: any
  error?: any
}

export default function StoriesDirectory({ stories, categories, featuredStories, user, error }: StoriesDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      'Family Law': HeartIcon,
      'Criminal Law': Shield,
      'Property Law': Home,
      'Employment Law': Users,
      'Consumer Rights': ShoppingCart,
      'Corporate Law': Building,
      'Tax Law': Calculator,
      'Immigration Law': Globe,
      'Intellectual Property': Lightbulb,
      'Environmental Law': Leaf,
      'Cyber Law': Monitor,
      'Constitutional Law': Scale,
    }
    return iconMap[categoryName] || Shield
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
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

  const filteredStories = useMemo(() => {
    let filtered = stories.filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === "all" ||
        story.case_type === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort stories
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "popular":
        filtered.sort((a, b) => (b.like_count + b.comment_count) - (a.like_count + a.comment_count))
        break
      case "views":
        filtered.sort((a, b) => b.view_count - a.view_count)
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
    }

    return filtered
  }, [stories, searchQuery, selectedCategory, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Legal Stories</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Learn from real legal experiences shared by our community. These anonymous stories help you understand your rights and navigate similar situations.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 border border-red-200 bg-red-50 rounded-lg">
            <div className="text-center">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Database Error</h3>
              <p className="text-red-700 mb-4">
                There was an error loading stories: {error.message || 'Unknown error occurred'}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Database Setup Notice */}
        {!error && stories.length === 0 && (
          <div className="mb-8 p-6 border border-amber-200 bg-amber-50 rounded-lg">
            <div className="text-center">
              <Shield className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Database Setup Required</h3>
              <p className="text-amber-700 mb-4">
                No legal stories are available because the required database tables haven't been created yet.
              </p>
              <div className="space-y-2 text-sm text-amber-600">
                <p>To see legal stories, you need to:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to your Supabase project</li>
                  <li>Run the database setup scripts</li>
                  <li>Create the <code className="bg-amber-100 px-1 rounded">legal_stories</code> table</li>
                </ol>
              </div>
              <div className="mt-4">
                <Link href="/stories/share">
                  <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Your First Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="mb-2">
                          {story.case_type}
                        </Badge>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {story.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {story.view_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {story.like_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {story.comment_count}
                          </span>
                        </div>
                        <span>{formatDate(story.created_at)}</span>
                      </div>
                      <Button asChild className="w-full mt-4">
                        <Link href={`/stories/${story.id}`}>
                          Read Full Story
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-muted p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories by title, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="views">Most Viewed</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Share Story Button */}
        {user && (
          <div className="text-center mb-8">
            <Button asChild size="lg">
              <Link href="/stories/share">
                <Plus className="h-4 w-4 mr-2" />
                Share Your Legal Story
              </Link>
            </Button>
          </div>
        )}
      </motion.div>

      {/* Stories Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
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
                        <User className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(story.user_profiles?.full_name || "User")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {story.content.substring(0, 120)}...
                    </p>
                    
                    {story.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {story.location}
                      </div>
                    )}

                    {story.outcome && (
                      <div className="mb-3">
                        <Badge variant="outline" className="text-xs">
                          Outcome: {story.outcome}
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {story.view_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {story.like_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {story.comment_count}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(story.created_at)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {story.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{story.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/stories/${story.id}`}>
                        Read Full Story
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stories found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              {user && (
                <Button asChild>
                  <Link href="/stories/share">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Your Story
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
