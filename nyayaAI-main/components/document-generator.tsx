"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Eye, Loader2, Wand2, Save } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"

interface DocumentGeneratorProps {
  templateSlug: string
  userId: string
}

interface FormField {
  id: string
  label: string
  type: "text" | "textarea" | "select" | "date" | "number"
  required: boolean
  options?: string[]
  placeholder?: string
}

interface DocumentTemplate {
  id: string
  title: string
  description: string
  category: string
  fields: FormField[]
  template_content: string
}

export default function DocumentGenerator({ templateSlug, userId }: DocumentGeneratorProps) {
  const [template, setTemplate] = useState<DocumentTemplate | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAIEnhancing, setIsAIEnhancing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadTemplate()
  }, [templateSlug])

  const loadTemplate = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("[v0] Loading template for slug:", templateSlug)
      
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .eq("slug", templateSlug)
        .single()

      if (error) {
        console.error("[v0] Database error loading template:", error.message)
        setError(`Template not found: ${templateSlug}`)
        setIsLoading(false)
        return
      }

      if (data) {
        console.log("[v0] Template loaded from database:", data.title)
        const mappedTemplate: DocumentTemplate = {
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category,
          fields: data.fields || [],
          template_content: data.template_content || '',
        }
        setTemplate(mappedTemplate)
      } else {
        setError(`Template not found: ${templateSlug}`)
      }
    } catch (error) {
      console.error("[v0] Error loading template:", error)
      setError(`Failed to load template: ${templateSlug}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const generateDocument = () => {
    if (!template) return

    setIsGenerating(true)

    // Replace placeholders with form data
    let content = template.template_content
    template.fields.forEach((field) => {
      const value = formData[field.id] || `[${field.label}]`
      content = content.replace(new RegExp(`{${field.id}}`, "g"), value)
    })

    // Simulate processing time
    setTimeout(() => {
      setGeneratedContent(content)
      setIsGenerating(false)
      setShowPreview(true)
    }, 1500)
  }

  const enhanceWithAI = async () => {
    if (!generatedContent || !template) return

    setIsAIEnhancing(true)

    try {
      const response = await fetch("/api/enhance-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: generatedContent,
          template: template?.title,
          formData,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to enhance document: ${response.statusText}`)
      }

      const enhancedContent = await response.text()
      setGeneratedContent(enhancedContent)
      
      // Show success message
      // setMessage({
      //   type: 'success',
      //   text: 'Document enhanced successfully with AI!'
      // })

      // Clear success message after 3 seconds
      // setTimeout(() => setMessage(null), 3000)

    } catch (error) {
      console.error("Error enhancing document:", error)
      // setMessage({
      //   type: 'error',
      //   text: 'Failed to enhance document. Please try again.'
      // })
    } finally {
      setIsAIEnhancing(false)
    }
  }

  const saveDocument = async () => {
    if (!generatedContent || !userId) return

    try {
      const { data, error } = await supabase
        .from("generated_documents")
        .insert({
          user_id: userId,
          template_id: template?.id,
          title: template?.title || "Generated Document",
          content: generatedContent,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error saving document:", error)
        
        // If table doesn't exist, show helpful message
        if (error.code === '42P01') {
          setMessage({
            type: 'error',
            text: 'Database tables not set up. Please contact support.'
          })
        } else {
          setMessage({
            type: 'error',
            text: 'Failed to save document. Please try again.'
          })
        }
        
        // Clear error message after 5 seconds
        setTimeout(() => setMessage(null), 5000)
        return
      }

      console.log("Document saved successfully")
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Document saved successfully! You can find it in your dashboard.'
      })

      // Clear success message after 5 seconds
      setTimeout(() => setMessage(null), 5000)

      return data
    } catch (error) {
      console.error("Error saving document:", error)
      
      setMessage({
        type: 'error',
        text: 'Failed to save document. Please try again.'
      })

      // Clear error message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const downloadDocument = async () => {
    if (!generatedContent) return

    const blob = new Blob([generatedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template?.title || "document"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Save to database
    await saveDocument()
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading template...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  if (!template) {
    return <div className="text-center py-12">No template found for this slug.</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/documents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{template.title}</h1>
        <p className="text-lg text-gray-600">{template.description}</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === "success" 
            ? "border-green-200 bg-green-50 text-green-800" 
            : "border-red-200 bg-red-50 text-red-800"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>Fill in the required information to generate your document</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {template.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {field.type === "text" && (
                  <Input
                    id={field.id}
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    rows={3}
                  />
                )}

                {field.type === "select" && (
                  <Select
                    value={formData[field.id] || ""}
                    onValueChange={(value) => handleInputChange(field.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "date" && (
                  <Input
                    id={field.id}
                    type="date"
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === "number" && (
                  <Input
                    id={field.id}
                    type="number"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <Button
                onClick={generateDocument}
                disabled={isGenerating}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Generate Document
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
            <CardDescription>
              {showPreview ? "Review your generated document" : "Fill the form to see preview"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showPreview ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{generatedContent}</pre>
                </div>

                <div className="flex gap-2">
                  <Button onClick={downloadDocument} className="flex-1 bg-green-500 hover:bg-green-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download & Save
                  </Button>
                  
                  {generatedContent && (
                    <Button 
                      onClick={saveDocument} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Only
                    </Button>
                  )}
                  
                  {generatedContent && (
                    <Button
                      onClick={enhanceWithAI}
                      disabled={isAIEnhancing}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      {isAIEnhancing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Enhance with AI
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Complete the form and click "Generate Document" to see preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
