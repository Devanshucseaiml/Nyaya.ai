import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DocumentHistory from "@/components/document-history"

export default async function DocumentHistoryPage() {
  const supabase = await createServerClient()

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Document History</h1>
            <p className="text-lg text-gray-600">View and manage your generated legal documents</p>
          </div>

          <Suspense fallback={<div className="text-center">Loading documents...</div>}>
            <DocumentHistory userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
