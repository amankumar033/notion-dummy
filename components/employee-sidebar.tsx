"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CheckSquare,
  User,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/app/employee/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/app/employee/tasks", icon: CheckSquare },
  { name: "Profile", href: "/app/employee/profile", icon: User },
  { name: "Settings", href: "/app/employee/settings", icon: Settings },
  { name: "Group Chat", href: "/app/employee/chat", icon: MessageCircle },
]

export function EmployeeSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-80 flex-col bg-gradient-to-b from-white via-blue-50/20 to-white border-r border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-xl">
      {/* Logo Section */}
      <div className="flex h-24 items-center border-b border-gray-200/80 px-8 bg-gradient-to-r from-white to-blue-50/30">
        <Link href="/app/employee/dashboard" className="flex items-center space-x-4 group">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
              TaskFlow
            </span>
            <p className="text-sm text-gray-500 font-medium">Employee Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-4 rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 scale-[1.02]"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 hover:text-blue-700 hover:shadow-md"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl" />
              )}
              <item.icon className={cn(
                "h-6 w-6 transition-all duration-300 relative z-10",
                isActive 
                  ? "text-white scale-110" 
                  : "text-gray-500 group-hover:text-blue-600 group-hover:scale-110"
              )} />
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <div className="ml-auto h-2.5 w-2.5 rounded-full bg-white/90 animate-pulse shadow-lg relative z-10" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200/80 p-6 bg-gradient-to-r from-white to-blue-50/20">
        <form
          action="/api/auth/signout"
          method="POST"
          className="w-full"
        >
          <button
            type="submit"
            className="flex w-full items-center space-x-4 rounded-2xl px-6 py-4 text-base font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 hover:text-blue-700 transition-all duration-300 group"
          >
            <LogOut className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  )
}

