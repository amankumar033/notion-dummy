"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, Mail, User as UserIcon } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  admin: {
    id: string
    name: string
    email: string
  } | null
  createdAt: string
  totalTasks: number
}

export default function CompanyEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/cmp/employees")
      if (res.ok) {
        const data = await res.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
            Company Employees
          </h1>
          <p className="text-gray-600 text-xl font-medium">View all employees across all admins</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : employees.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No employees found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <Card key={employee.id} className="shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{employee.name}</CardTitle>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {employee.email}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {employee.admin && (
                      <div>
                        <p className="text-gray-500">Managed by</p>
                        <p className="font-semibold">{employee.admin.name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">Total Tasks</p>
                      <p className="font-semibold">{employee.totalTasks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



