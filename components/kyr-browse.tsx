"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, Users, Shield, Home, Briefcase, Heart, Scale } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"

interface RightsCategory {
  id: string
  title: string
  description: string
  icon: string
  color: string
  articleCount: number
  slug: string
}

const defaultCategories: RightsCategory[] = [
  {
    id: "1",
    title: "Constitutional Rights",
    description: "Fundamental rights guaranteed by the Indian Constitution",
    icon: "Scale",
    color: "bg-blue-500",
    articleCount: 12,
    slug: "constitutional-rights",
  },
  {
    id: "2",
    title: "Consumer Rights",
    description: "Protection against unfair trade practices and defective goods",
    icon: "Shield",
    color: "bg-green-500",
    articleCount: 8,
    slug: "consumer-rights",
  },
  {
    id: "3",
    title: "Labor Rights",
    description: "Workplace rights, wages, and employment protection",
    icon: "Briefcase",
    color: "bg-orange-500",
    articleCount: 15,
    slug: "labor-rights",
  },
  {
    id: "4",
    title: "Women's Rights",
    description: "Legal protections and rights specific to women",
    icon: "Users",
    color: "bg-purple-500",
    articleCount: 10,
    slug: "womens-rights",
  },
  {
    id: "5",
    title: "Property Rights",
    description: "Land ownership, tenancy, and property disputes",
    icon: "Home",
    color: "bg-red-500",
    articleCount: 9,
    slug: "property-rights",
  },
  {
    id: "6",
    title: "Healthcare Rights",
    description: "Right to healthcare, medical negligence, and patient rights",
    icon: "Heart",
    color: "bg-pink-500",
    articleCount: 7,
    slug: "healthcare-rights",
  },
]

const iconMap = {
  Scale,
  Shield,
  Briefcase,
  Users,
  Home,
  Heart,
  BookOpen,
}

export default function KYRBrowse() {
  const [categories, setCategories] = useState<RightsCategory[]>(defaultCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCategories, setFilteredCategories] = useState<RightsCategory[]>(defaultCategories)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Load categories from database
    loadCategories()
  }, [])

  useEffect(() => {
    // Filter categories based on search term
    const filtered = categories.filter(
      (category) =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCategories(filtered)
  }, [searchTerm, categories])

  const loadCategories = async () => {
    try {
      // Get unique categories from kyr_articles table
      const { data: articles, error } = await supabase
        .from("kyr_articles")
        .select("category")

      if (error) {
        console.error("Error loading categories:", error)
        return
      }

      // Group articles by category and count them
      const categoryCounts = articles.reduce((acc: any, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1
        return acc
      }, {})

      // Create category objects with counts
      const dbCategories = Object.keys(categoryCounts).map((category, index) => ({
        id: (index + 1).toString(),
        title: category,
        description: getCategoryDescription(category),
        icon: getCategoryIcon(category),
        color: getCategoryColor(category),
        articleCount: categoryCounts[category],
        slug: category.toLowerCase().replace(/\s+/g, '-'),
      }))

      setCategories(dbCategories)
      setFilteredCategories(dbCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      "Constitutional Rights": "Fundamental rights guaranteed by the Indian Constitution",
      "Consumer Rights": "Protection against unfair trade practices and defective goods",
      "Education Rights": "Right to education and educational institutions",
      "Transparency Laws": "Laws promoting government transparency and accountability",
    }
    return descriptions[category] || "Legal rights and protections in this category"
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      "Constitutional Rights": "Scale",
      "Consumer Rights": "Shield",
      "Education Rights": "BookOpen",
      "Transparency Laws": "Shield",
    }
    return icons[category] || "BookOpen"
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Constitutional Rights": "bg-blue-500",
      "Consumer Rights": "bg-green-500",
      "Education Rights": "bg-purple-500",
      "Transparency Laws": "bg-orange-500",
    }
    return colors[category] || "bg-gray-500"
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || BookOpen
    return IconComponent
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search rights categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const IconComponent = getIcon(category.icon)

          return (
            <Card key={category.id} className="hover:shadow-lg transition-shadow duration-200 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${category.color} text-white group-hover:scale-110 transition-transform duration-200`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.articleCount} articles
                  </Badge>
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription className="text-sm">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/kyr/${category.slug}`}>
                  <Button className="w-full bg-green-500 hover:bg-green-600">Explore Rights</Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}
