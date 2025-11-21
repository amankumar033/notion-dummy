import { CompanySidebar } from "@/components/company-sidebar"
import { SessionProvider } from "@/components/session-provider"

export const dynamic = 'force-dynamic'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider basePath="/api/auth/cmp">
      <div className="flex h-screen">
        <CompanySidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}


