import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DocumentTemplates from "@/components/document-templates"

export default async function DocumentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Document Generator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate professional legal documents with AI assistance. Choose from templates or create custom documents
              tailored to your needs.
            </p>
          </div>

          <Suspense fallback={<div className="text-center">Loading templates...</div>}>
            <DocumentTemplates userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
