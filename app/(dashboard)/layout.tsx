import { SessionProvider } from "@/components/session-provider"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout is for pages that don't have specific role layouts
  // Most pages should use /app/admin, /app/cmp, or /app/employee layouts
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        {children}
      </div>
    </SessionProvider>
  )
}
