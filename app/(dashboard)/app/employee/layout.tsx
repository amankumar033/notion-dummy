import { EmployeeSidebar } from "@/components/employee-sidebar"
import { SessionProvider } from "@/components/session-provider"

export const dynamic = 'force-dynamic'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider basePath="/api/auth/employee">
      <div className="flex h-screen">
        <EmployeeSidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}

