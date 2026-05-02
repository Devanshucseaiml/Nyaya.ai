"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserProfileDropdownProps = {
  user: any
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // Let the caller/header's auth listener react; no redirect needed here
  }

  const displayName = user?.user_metadata?.full_name || user?.email || "User"
  const initial = (user?.email?.[0] || displayName?.[0] || "U").toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-medium">
            {initial}
          </span>
          <span className="hidden md:inline text-sm font-medium text-gray-700 max-w-[160px] truncate">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
          </Link>
          <Link href="/dashboard/profile">
            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
          </Link>
          <Link href="/dashboard/history">
            <DropdownMenuItem className="cursor-pointer">History</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start p-0 h-auto">
            Sign out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


