"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Clock, Star, Briefcase, Home, Users, Shield } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"

interface DocumentTemplate {
  id: string
  title: string
  description: string
  category: string
  complexity: "Simple" | "Moderate" | "Complex"
  estimatedTime: number
  slug: string
  icon: string
  popular: boolean
}

interface DocumentTemplatesProps {
  userId: string
}

const defaultTemplates: DocumentTemplate[] = [
  {
    id: "1",
    title: "Rental Agreement",
    description: "Comprehensive rental agreement for residential properties",
    category: "Property",
    complexity: "Moderate",
    estimatedTime: 15,
    slug: "rental-agreement",
    icon: "Home",
    popular: true,
  },
  {
    id: "2",
    title: "Employment Contract",
    description: "Standard employment contract with terms and conditions",
    category: "Employment",
    complexity: "Complex",
    estimatedTime: 25,
    slug: "employment-contract",
    icon: "Briefcase",
    popular: true,
  },
  {
    id: "3",
    title: "Non-Disclosure Agreement",
    description: "Protect confidential information with a professional NDA",
    category: "Business",
    complexity: "Simple",
    estimatedTime: 10,
    slug: "nda",
    icon: "Shield",
    popular: false,
  },
  {
    id: "4",
    title: "Partnership Agreement",
    description: "Legal framework for business partnerships",
    category: "Business",
    complexity: "Complex",
    estimatedTime: 30,
    slug: "partnership-agreement",
    icon: "Users",
    popular: false,
  },
  {
    id: "5",
    title: "Legal Notice",
    description: "Formal legal notice for various purposes",
    category: "Legal",
    complexity: "Simple",
    estimatedTime: 8,
    slug: "legal-notice",
    icon: "FileText",
    popular: true,
  },
  {
    id: "6",
    title: "Power of Attorney",
    description: "Grant legal authority to act on your behalf",
    category: "Legal",
    complexity: "Moderate",
    estimatedTime: 20,
    slug: "power-of-attorney",
    icon: "FileText",
    popular: false,
  },
]

const iconMap = {
  Home,
  Briefcase,
  Shield,
  Users,
  FileText,
}

export default function DocumentTemplates({ userId }: DocumentTemplatesProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(defaultTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>(defaultTemplates)
  const supabase = createBrowserClient()

  const categories = ["All", "Property", "Employment", "Business", "Legal"]

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [searchTerm, selectedCategory, templates])

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("document_templates")
        .select("id, title, description, category, complexity, estimated_time, slug, icon, popular")
        .order("title")

      if (error) {
        console.log("[v0] Database query failed, using default templates:", error.message)
        return
      }

      if (data && data.length > 0) {
        const mappedTemplates = data.map((template: any) => ({
          id: template.id,
          title: template.title,
          description: template.description,
          category: template.category,
          complexity: template.complexity,
          estimatedTime: template.estimated_time,
          slug: template.slug,
          icon: template.icon,
          popular: template.popular,
        }))
        setTemplates(mappedTemplates)
        console.log("[v0] Loaded templates from database:", mappedTemplates.length)
      } else {
        console.log("[v0] No templates found in database, using defaults")
      }
    } catch (error) {
      console.log("[v0] Error loading templates, using defaults:", error)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((template) => template.category === selectedCategory)
    }

    setFilteredTemplates(filtered)
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Complex":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || FileText
    return IconComponent
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search document templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Popular Templates */}
      {selectedCategory === "All" && searchTerm === "" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Popular Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter((template) => template.popular)
              .map((template) => {
                const IconComponent = getIcon(template.icon)
                return (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200 group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:scale-110 transition-transform duration-200">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <Badge variant="secondary">{template.category}</Badge>
                        </div>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={getComplexityColor(template.complexity)}>{template.complexity}</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {template.estimatedTime} min
                        </div>
                      </div>
                      <Link href={`/documents/generate/${template.slug}`}>
                        <Button className="w-full bg-green-500 hover:bg-green-600">Generate Document</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          {selectedCategory === "All" ? "All Templates" : `${selectedCategory} Templates`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const IconComponent = getIcon(template.icon)
            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:scale-110 transition-transform duration-200">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    {template.popular && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getComplexityColor(template.complexity)}>{template.complexity}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {template.estimatedTime} min
                    </div>
                  </div>
                  <Link href={`/documents/generate/${template.slug}`}>
                    <Button className="w-full bg-green-500 hover:bg-green-600">Generate Document</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search terms or category filter</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/documents/history">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="w-4 h-4 mr-2" />
              View Document History
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="w-4 h-4 mr-2" />
              Get AI Help with Documents
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
