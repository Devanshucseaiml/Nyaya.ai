"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Shield, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

const categories = [
  "Consumer Rights",
  "Labor Rights",
  "Property Rights",
  "Family Law",
  "Criminal Law",
  "Constitutional Rights",
  "Other",
]

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Lakshadweep",
]

export function ShareStoryForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    storyContent: "",
    legalOutcome: "",
    lessonsLearned: "",
    locationState: "",
    caseDuration: "",
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags((prev) => [...prev, newTag.trim().toLowerCase()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting case story...")

      const storyData = {
        title: formData.title,
        category: formData.category,
        story_content: formData.storyContent,
        legal_outcome: formData.legalOutcome,
        lessons_learned: formData.lessonsLearned,
        tags: tags,
        location_state: formData.locationState,
        case_duration: formData.caseDuration,
        is_approved: false, // Stories need approval before being visible
      }

      const { error } = await supabase.from("case_stories").insert([storyData])

      if (error) {
        console.log("[v0] Error submitting story:", error.message)
        alert("There was an error submitting your story. Please try again.")
      } else {
        console.log("[v0] Story submitted successfully")
        setSubmitSuccess(true)
        // Reset form
        setFormData({
          title: "",
          category: "",
          storyContent: "",
          legalOutcome: "",
          lessonsLearned: "",
          locationState: "",
          caseDuration: "",
        })
        setTags([])
      }
    } catch (error) {
      console.log("[v0] Error submitting story:", error)
      alert("There was an error submitting your story. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Sharing!</h2>
            <p className="text-gray-600 mb-4">
              Your story has been submitted and is under review. Once approved, it will help others in similar
              situations.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Review Process</span>
              </div>
              <p className="text-blue-700 text-sm">
                Our team reviews all submissions to ensure quality and remove any identifying information before
                publishing. This usually takes 1-2 business days.
              </p>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setSubmitSuccess(false)} variant="outline">
              Share Another Story
            </Button>
            <Button onClick={() => router.push("/stories")} className="bg-green-600 hover:bg-green-700">
              Browse Stories
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Anonymous Story Submission
        </CardTitle>
        <p className="text-sm text-gray-600">
          Your identity will remain completely anonymous. We review all submissions before publishing.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Story Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Brief title describing your case"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Legal Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="storyContent">Your Story *</Label>
            <Textarea
              id="storyContent"
              value={formData.storyContent}
              onChange={(e) => handleInputChange("storyContent", e.target.value)}
              placeholder="Describe your legal situation, what happened, and the challenges you faced..."
              rows={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Please avoid including specific names, addresses, or other identifying information.
            </p>
          </div>

          <div>
            <Label htmlFor="legalOutcome">Legal Outcome</Label>
            <Textarea
              id="legalOutcome"
              value={formData.legalOutcome}
              onChange={(e) => handleInputChange("legalOutcome", e.target.value)}
              placeholder="What was the final outcome? How was the case resolved?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="lessonsLearned">Key Lessons & Advice *</Label>
            <Textarea
              id="lessonsLearned"
              value={formData.lessonsLearned}
              onChange={(e) => handleInputChange("lessonsLearned", e.target.value)}
              placeholder="What would you advise others facing a similar situation? What did you learn?"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="locationState">State/Region</Label>
              <Select
                value={formData.locationState}
                onValueChange={(value) => handleInputChange("locationState", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="caseDuration">Case Duration</Label>
              <Input
                id="caseDuration"
                value={formData.caseDuration}
                onChange={(e) => handleInputChange("caseDuration", e.target.value)}
                placeholder="e.g., 6 months, 2 years"
              />
            </div>
          </div>

          <div>
            <Label>Tags (Optional)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add relevant tags..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Tags help others find relevant stories. Maximum 10 tags.</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Before Submitting:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Remove any names, addresses, or identifying information</li>
              <li>• Focus on the legal aspects and lessons learned</li>
              <li>• Your story will be reviewed before being published</li>
              <li>• All submissions remain completely anonymous</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.title ||
              !formData.category ||
              !formData.storyContent ||
              !formData.lessonsLearned
            }
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Story Anonymously"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
