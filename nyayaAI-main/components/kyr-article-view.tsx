"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, BookOpen, Share2, Bookmark } from "lucide-react"
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
  category?: string
}

interface KYRArticleViewProps {
  category: string
  articleSlug: string
}

const sampleArticle: Article = {
  id: "1",
  title: "Right to Equality (Article 14)",
  description: "Understanding your fundamental right to equality before law and equal protection",
  content: `
# Right to Equality (Article 14)

## Overview
Article 14 of the Indian Constitution guarantees the right to equality before law and equal protection of laws. This fundamental right ensures that all citizens are treated equally by the state, regardless of their religion, race, caste, sex, or place of birth.

## Key Provisions

### Equality Before Law
- No person shall be denied equality before the law
- The law applies equally to all citizens
- No one is above the law, including government officials

### Equal Protection of Laws
- Similar treatment in similar circumstances
- Classification must be reasonable and based on intelligible differentia
- The classification must have a rational relation to the object sought to be achieved

## Practical Applications

### 1. Employment
- Equal opportunity in government jobs
- No discrimination in private employment based on caste, religion, or gender
- Equal pay for equal work

### 2. Education
- Equal access to educational institutions
- No discrimination in admissions
- Right to quality education regardless of background

### 3. Legal Proceedings
- Equal treatment in courts
- Same legal procedures for all
- Right to fair trial

## Exceptions and Limitations

### Reasonable Classification
The right to equality doesn't mean absolute equality. The state can make reasonable classifications such as:
- Age limits for certain jobs
- Educational qualifications for positions
- Special provisions for women, children, and marginalized communities

### Positive Discrimination
- Reservations for SC/ST/OBC communities
- Special provisions for women
- Affirmative action programs

## Landmark Cases

### 1. Maneka Gandhi v. Union of India (1978)
Established that Article 14 applies to executive actions and not just legislative actions.

### 2. E.P. Royappa v. State of Tamil Nadu (1974)
Defined equality as the absence of arbitrariness and discrimination.

## How to Exercise This Right

### If You Face Discrimination:
1. **Document the incident** - Keep records of discriminatory treatment
2. **File a complaint** - Approach relevant authorities or courts
3. **Seek legal help** - Consult with a lawyer specializing in constitutional law
4. **Use RTI** - Right to Information to get relevant documents

### Legal Remedies:
- **Writ Petition** - File directly in High Court or Supreme Court
- **Civil Suit** - For damages due to discrimination
- **Criminal Complaint** - If discrimination involves criminal acts

## Recent Developments

### Digital Rights
- Equal access to digital services
- Non-discrimination in online platforms
- Digital divide considerations

### LGBTQ+ Rights
- Recognition of transgender rights
- Decriminalization of homosexuality
- Equal treatment regardless of sexual orientation

## Conclusion

Article 14 is the cornerstone of Indian democracy, ensuring that all citizens have equal dignity and worth before the law. Understanding and exercising this right is crucial for maintaining a just and equitable society.

## Need Help?

If you believe your right to equality has been violated, consider:
- Consulting with a constitutional lawyer
- Approaching human rights organizations
- Filing a complaint with the National Human Rights Commission
- Using our AI legal assistant for initial guidance

*Remember: This information is for educational purposes and should not replace professional legal advice.*
  `,
  slug: "right-to-equality",
  readTime: 8,
  difficulty: "Beginner",
  tags: ["fundamental-rights", "constitution", "equality"],
  createdAt: "2024-01-15",
}

export default function KYRArticleView({ category, articleSlug }: KYRArticleViewProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isBookmarking, setIsBookmarking] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadArticle()
  }, [category, articleSlug])

  const loadArticle = async () => {
    try {
      setIsLoading(true)
      
      // Fetch article from database
      const { data, error } = await supabase
        .from("kyr_articles")
        .select("*")
        .eq("slug", articleSlug)
        .single()

      if (error) {
        console.error("Error loading article:", error)
        setError("Failed to load article")
        return
      }

      if (data) {
        const mappedArticle: Article = {
          id: data.id,
          title: data.title,
          description: data.summary || data.description || "",
          content: data.content || "",
          slug: data.slug,
          readTime: data.read_time || data.readTime || 5,
          difficulty: data.difficulty || "Beginner",
          tags: data.tags || [],
          createdAt: data.created_at,
          category: data.category,
        }
        setArticle(mappedArticle)
        // Check if article is bookmarked
        await checkBookmarkStatus(mappedArticle.id)
      } else {
        setError("Article not found")
      }
    } catch (error) {
      console.error("Error loading article:", error)
      setError("Failed to load article")
    } finally {
      setIsLoading(false)
    }
  }

  const checkBookmarkStatus = async (articleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: bookmark } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .single()

      setIsBookmarked(!!bookmark)
    } catch (error) {
      console.error("Error checking bookmark status:", error)
    }
  }

  const toggleBookmark = async () => {
    if (!article) return

    try {
      setIsBookmarking(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("Please log in to bookmark articles")
        return
      }

      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId: article.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle bookmark')
      }

      const result = await response.json()
      setIsBookmarked(result.action === 'added')
      
      // Show feedback
      if (result.action === 'added') {
        alert('Article bookmarked successfully!')
      } else {
        alert('Bookmark removed successfully!')
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      alert("Failed to update bookmark")
    } finally {
      setIsBookmarking(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
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

  if (isLoading) {
    return <div className="text-center py-12">Loading article...</div>
  }

  const backCategory = category || article?.category?.toLowerCase().replace(/\s+/g, "-") || "constitutional-rights"

  if (!article) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Article not found</h3>
        <Link href={`/kyr/${backCategory}`}>
          <Button variant="outline">Back to Category</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/kyr/${backCategory}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to{" "}
            {backCategory
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge className={getDifficultyColor(article.difficulty)}>{article.difficulty}</Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {article.readTime} min read
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleBookmark}
                className={isBookmarked ? "bg-green-50 text-green-600" : ""}
                disabled={isBookmarking}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <p className="text-gray-600">{article.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Article Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br>") }} />
          </div>
        </CardContent>
      </Card>

      {/* Related Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/chat">
              <Button className="w-full bg-green-500 hover:bg-green-600">Ask AI Assistant</Button>
            </Link>
            <Link href="/lawyers">
              <Button variant="outline" className="w-full bg-transparent">
                Connect with Lawyer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
