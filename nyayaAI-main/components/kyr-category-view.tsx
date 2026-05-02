"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"

interface Article {
  id: string
  title: string
  description: string
  content: string
  slug: string
  readTime: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  createdAt: string
}

interface KYRCategoryViewProps {
  category: string
}

const sampleArticles: Article[] = [
  {
    id: "1",
    title: "Right to Equality (Article 14)",
    description: "Understanding your fundamental right to equality before law and equal protection",
    content: "",
    slug: "right-to-equality",
    readTime: 5,
    difficulty: "Beginner",
    tags: ["fundamental-rights", "constitution", "equality"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Right to Freedom of Speech (Article 19)",
    description: "Your right to express opinions and the reasonable restrictions on this freedom",
    content: "",
    slug: "freedom-of-speech",
    readTime: 7,
    difficulty: "Intermediate",
    tags: ["fundamental-rights", "freedom", "expression"],
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Right Against Exploitation (Article 23-24)",
    description: "Protection against human trafficking, forced labor, and child labor",
    content: "",
    slug: "right-against-exploitation",
    readTime: 6,
    difficulty: "Beginner",
    tags: ["fundamental-rights", "exploitation", "labor"],
    createdAt: "2024-01-05",
  },
]

export default function KYRCategoryView({ category }: KYRCategoryViewProps) {
  const [articles, setArticles] = useState<Article[]>(sampleArticles)
  const [categoryTitle, setCategoryTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadCategoryData()
  }, [category])

  const loadCategoryData = async () => {
    try {
      setLoading(true)
      
      // Format category name for display
      const safeCategory = category || ""
      const formattedCategory = safeCategory
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      
      setCategoryTitle(formattedCategory)

      // Load articles for this category from kyr_articles table
      const { data: articlesData, error } = await supabase
        .from("kyr_articles")
        .select("*")
        .eq("category", formattedCategory)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading articles:", error)
        return
      }

      if (articlesData && articlesData.length > 0) {
        const formattedArticles: Article[] = articlesData.map((article: any) => ({
          id: article.id,
          title: article.title,
          description: article.summary || "",
          content: article.content,
          slug: article.slug,
          readTime: article.read_time || article.readTime || 5,
          difficulty: article.difficulty || "Beginner",
          tags: article.tags || [],
          createdAt: article.created_at,
        }))
        setArticles(formattedArticles)
      } else {
        setArticles([])
      }
    } catch (error) {
      console.error("Error loading category data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading articles...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/kyr">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{categoryTitle}</h1>
        <p className="text-lg text-gray-600">Explore articles and guides about {categoryTitle.toLowerCase()}</p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={getDifficultyColor(article.difficulty)}>{article.difficulty}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime} min read
                </div>
              </div>
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <CardDescription>{article.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link href={`/kyr/${category}/${article.slug}`}>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Article
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Articles for this category are coming soon</p>
        </div>
      )}
    </div>
  )
}
