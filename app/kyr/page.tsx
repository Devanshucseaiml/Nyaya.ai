import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import KYRBrowse from "@/components/kyr-browse"

export default async function KYRPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Know Your Rights</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore your fundamental rights and legal protections under Indian law. Empower yourself with knowledge to
              navigate legal challenges confidently.
            </p>
          </div>

          <Suspense fallback={<div className="text-center">Loading rights...</div>}>
            <KYRBrowse />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
