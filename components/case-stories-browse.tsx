"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, Clock, MapPin, Star } from "lucide-react"
import Link from "next/link"

interface CaseStory {
  id: string
  title: string
  category: string
  story_content: string
  legal_outcome: string
  lessons_learned: string
  tags: string[]
  location_state: string
  case_duration: string
  is_featured: boolean
  helpful_count: number
  created_at: string
}

const defaultStories: CaseStory[] = [
  {
    id: "1",
    title: "Landlord Refused Security Deposit Return",
    category: "Consumer Rights",
    story_content: "My landlord refused to return my security deposit of ₹50,000 after I vacated the apartment...",
    legal_outcome:
      "Filed a complaint with the consumer court. Won the case and got full deposit back plus compensation.",
    lessons_learned: "Always document the condition of rental property with photos and videos.",
    tags: ["rental", "security deposit", "consumer court"],
    location_state: "Maharashtra",
    case_duration: "8 months",
    is_featured: true,
    helpful_count: 45,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Workplace Harassment and Wrongful Termination",
    category: "Labor Rights",
    story_content:
      "I faced continuous harassment from my manager and was eventually terminated without proper notice...",
    legal_outcome:
      "Approached labor court with evidence. Company settled out of court with 6 months salary compensation.",
    lessons_learned:
      "Document all instances of harassment with dates and witnesses. Keep copies of all performance reviews.",
    tags: ["workplace harassment", "wrongful termination", "labor court"],
    location_state: "Karnataka",
    case_duration: "1 year",
    is_featured: false,
    helpful_count: 32,
    created_at: "2024-01-10T14:30:00Z",
  },
]

const categories = [
  "All Categories",
  "Consumer Rights",
  "Labor Rights",
  "Property Rights",
  "Family Law",
  "Criminal Law",
  "Constitutional Rights",
]

export function CaseStoriesBrowse() {
  const [stories, setStories] = useState<CaseStory[]>(defaultStories)
  const [filteredStories, setFilteredStories] = useState<CaseStory[]>(defaultStories)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadStories()
  }, [])

  useEffect(() => {
    filterStories()
  }, [stories, selectedCategory, searchQuery])

  const loadStories = async () => {
    try {
      console.log("[v0] Loading case stories from database...")
      const { data, error } = await supabase
        .from("case_stories")
        .select("*")
        .eq("is_approved", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        console.log("[v0] Database error, using default stories:", error.message)
        setStories(defaultStories)
      } else if (data && data.length > 0) {
        console.log("[v0] Loaded stories from database:", data.length)
        setStories(data)
      } else {
        console.log("[v0] No stories in database, using defaults")
        setStories(defaultStories)
      }
    } catch (error) {
      console.log("[v0] Error loading stories:", error)
      setStories(defaultStories)
    } finally {
      setLoading(false)
    }
  }

  const filterStories = () => {
    let filtered = stories

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((story) => story.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.story_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredStories(filtered)
  }

  const handleReaction = async (storyId: string) => {
    console.log("[v0] Adding reaction to story:", storyId)
    // This would typically update the database and refresh the story
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search stories, tags, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/stories/share">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Share Your Story</Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStories.map((story) => (
          <Card key={story.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {story.is_featured && (
                    <div className="flex items-center gap-1 text-yellow-600 mb-2">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-xs font-medium">Featured Story</span>
                    </div>
                  )}
                  <CardTitle className="text-lg leading-tight mb-2">{story.title}</CardTitle>
                  <Badge variant="secondary" className="mb-2">
                    {story.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{story.story_content}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {story.location_state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {story.case_duration}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {story.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {story.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{story.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(story.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {story.helpful_count}
                  </Button>
                  <Link href={`/stories/${story.id}`}>
                    <Button variant="outline" size="sm">
                      Read Full Story
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No stories found matching your criteria.</p>
          <Link href="/stories/share">
            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
              Be the first to share a story in this category
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
