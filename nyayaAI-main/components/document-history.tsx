"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Eye, Trash2, Calendar, FileText } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface GeneratedDocument {
  id: string
  title: string
  content: string
  template_id: string
  form_data: Record<string, any>
  created_at: string
  template?: {
    title: string
    category: string
  }
}

interface DocumentHistoryProps {
  userId: string
}

export default function DocumentHistory({ userId }: DocumentHistoryProps) {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<GeneratedDocument[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadDocuments()
  }, [userId])

  useEffect(() => {
    filterDocuments()
  }, [searchTerm, documents])

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("generated_documents")
        .select(`
          *,
          document_templates (
            title,
            category
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading documents:", error)
        return
      }

      if (data) {
        setDocuments(data)
      }
    } catch (error) {
      console.error("Error loading documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterDocuments = () => {
    if (!searchTerm) {
      setFilteredDocuments(documents)
      return
    }

    const filtered = documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.template?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.template?.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredDocuments(filtered)
  }

  const downloadDocument = (document: GeneratedDocument) => {
    const blob = new Blob([document.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${document.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const { error } = await supabase.from("generated_documents").delete().eq("id", documentId)

      if (error) throw error

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const previewDocument = (document: GeneratedDocument) => {
    setSelectedDocument(document)
    setShowPreview(true)
  }

  if (loading) {
    return <div className="text-center py-12">Loading documents...</div>
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{document.template?.category || "Document"}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(document.created_at).toLocaleDateString()}
                </div>
              </div>
              <CardTitle className="text-lg">{document.title}</CardTitle>
              <CardDescription className="text-sm">{document.template?.title || "Custom Document"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => previewDocument(document)} className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadDocument(document)} className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteDocument(document.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No documents found" : "No documents yet"}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? "Try adjusting your search terms" : "Generate your first document to get started"}
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedDocument.title}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadDocument(selectedDocument)}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg">
                {selectedDocument.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
