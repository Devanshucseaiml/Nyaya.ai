"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageCircle, 
  FileText, 
  Search, 
  Download, 
  Trash2, 
  Calendar,
  Clock,
  User,
  Bot,
  ArrowLeft,
  Plus,
  Bookmark,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { createBrowserClient } from "@/lib/supabase/client"

interface HistoryViewProps {
  user: any
  chatSessions: any[]
  generatedDocuments: any[]
  bookmarks: any[]
}

export default function HistoryView({ user, chatSessions, generatedDocuments, bookmarks }: HistoryViewProps) {
  const [activeTab, setActiveTab] = useState("chats")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const supabase = createBrowserClient()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const filteredChatSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.chat_messages?.some((msg: any) => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const filteredDocuments = generatedDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_templates?.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.kyr_articles?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.kyr_articles?.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.kyr_articles?.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteChatSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this chat session? This action cannot be undone.")) return
    
    setIsDeleting(sessionId)
    try {
      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", sessionId)

      if (error) throw error

      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error("Error deleting chat session:", error)
      alert("Failed to delete chat session")
    } finally {
      setIsDeleting(null)
    }
  }

  const deleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) return
    
    setIsDeleting(documentId)
    try {
      const { error } = await supabase
        .from("generated_documents")
        .delete()
        .eq("id", documentId)

      if (error) throw error

      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error("Error deleting document:", error)
      alert("Failed to delete document")
    } finally {
      setIsDeleting(null)
    }
  }

  const removeBookmark = async (bookmarkId: string) => {
    if (!confirm("Are you sure you want to remove this bookmark?")) return
    
    setIsDeleting(bookmarkId)
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId)

      if (error) throw error

      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error("Error removing bookmark:", error)
      alert("Failed to remove bookmark")
    } finally {
      setIsDeleting(null)
    }
  }

  const downloadDocument = (document: any) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              My History
            </h1>
            <p className="text-muted-foreground">View and manage your AI chat sessions, generated documents, and bookmarks</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search chats, documents, and bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Chat Sessions</p>
                  <p className="text-2xl font-bold">{chatSessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold">{generatedDocuments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Bookmarks</p>
                  <p className="text-2xl font-bold">{bookmarks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{chatSessions.length + generatedDocuments.length + bookmarks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chats">AI Chat Sessions ({filteredChatSessions.length})</TabsTrigger>
            <TabsTrigger value="documents">Generated Documents ({filteredDocuments.length})</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks ({filteredBookmarks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="space-y-6">
            {filteredChatSessions.length > 0 ? (
              <div className="space-y-4">
                {filteredChatSessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">{session.title}</h3>
                            <Badge variant="secondary">
                              {session.chat_messages?.length || 0} messages
                            </Badge>
                          </div>
                          
                          {session.chat_messages && session.chat_messages.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">
                                Last updated: {formatDate(session.updated_at)}
                              </div>
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm">
                                  <span className="font-medium">
                                    {session.chat_messages[0].role === 'user' ? 'You' : 'AI'}:
                                  </span>{" "}
                                  {session.chat_messages[0].content.length > 150 
                                    ? `${session.chat_messages[0].content.substring(0, 150)}...`
                                    : session.chat_messages[0].content
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button size="sm" asChild>
                            <Link href="/chat">
                              Continue Chat
                            </Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteChatSession(session.id)}
                            disabled={isDeleting === session.id}
                          >
                            {isDeleting === session.id ? (
                              <>
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm ? "No matching chat sessions" : "No chat sessions yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? "Try adjusting your search terms" : "Start chatting with our AI legal assistant"}
                  </p>
                  <Button asChild>
                    <Link href="/chat">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Chat
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {filteredDocuments.length > 0 ? (
              <div className="space-y-4">
                {filteredDocuments.map((document) => (
                  <Card key={document.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">{document.document_templates?.category || "Document"}</Badge>
                            <h3 className="font-semibold text-lg">{document.title}</h3>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div>Template: {document.document_templates?.title || "Custom Document"}</div>
                            <div>Generated: {formatDate(document.created_at)}</div>
                            <div className="p-3 bg-muted rounded-lg">
                              <p>
                                {document.content.length > 200 
                                  ? `${document.content.substring(0, 200)}...`
                                  : document.content
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadDocument(document)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                          >
                            <Link href={`/documents/generate/${document.document_templates?.slug || 'custom'}`}>
                              Regenerate
                            </Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteDocument(document.id)}
                            disabled={isDeleting === document.id}
                          >
                            {isDeleting === document.id ? (
                              <>
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm ? "No matching documents" : "No documents generated yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? "Try adjusting your search terms" : "Create your first legal document using our templates"}
                  </p>
                  <Button asChild>
                    <Link href="/documents">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate Document
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            {filteredBookmarks.length > 0 ? (
              <div className="space-y-4">
                {filteredBookmarks.map((bookmark) => (
                  <Card key={bookmark.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Bookmark className="h-5 w-5 text-orange-600" />
                            <h3 className="font-semibold text-lg">{bookmark.kyr_articles?.title}</h3>
                            <Badge variant="outline">{bookmark.kyr_articles?.category}</Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div>Bookmarked: {formatDate(bookmark.created_at)}</div>
                            {bookmark.kyr_articles?.summary && (
                              <div className="p-3 bg-muted rounded-lg">
                                <p>
                                  {bookmark.kyr_articles.summary.length > 200 
                                    ? `${bookmark.kyr_articles.summary.substring(0, 200)}...`
                                    : bookmark.kyr_articles.summary
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            asChild
                          >
                            <Link href={`/kyr/article/${bookmark.kyr_articles?.slug}`}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Read Article
                            </Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeBookmark(bookmark.id)}
                            disabled={isDeleting === bookmark.id}
                          >
                            {isDeleting === bookmark.id ? (
                              <>
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm ? "No matching bookmarks" : "No bookmarks yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? "Try adjusting your search terms" : "Bookmark KYR articles to read them later"}
                  </p>
                  <Button asChild>
                    <Link href="/kyr">
                      <Plus className="w-4 h-4 mr-2" />
                      Browse KYR Articles
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}



