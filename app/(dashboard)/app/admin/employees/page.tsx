"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Trash2, Users, Mail, User as UserIcon } from "lucide-react"
import Link from "next/link"

interface Employee {
  id: string
  name: string
  email: string
  workId?: string | null
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  notStartedTasks: number
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", password: "", workId: "" })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/employees", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setEmployees(data)
        setError(null)
      } else {
        setError("Failed to load employees")
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      setError("Failed to load employees")
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          password: newEmployee.password,
          workId: newEmployee.workId || undefined,
        }),
      })

      if (res.ok) {
        setSuccess("Employee created successfully!")
        setNewEmployee({ name: "", email: "", password: "", workId: "" })
        setShowAddEmployee(false)
        fetchEmployees()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to create employee")
      }
    } catch (error) {
      console.error("Error creating employee:", error)
      setError("Failed to create employee")
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      const res = await fetch(`/api/admin/employees/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (res.ok) {
        setSuccess("Employee deleted successfully!")
        fetchEmployees()
      } else {
        setError("Failed to delete employee")
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      setError("Failed to delete employee")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Employees
            </h1>
            <p className="text-gray-600 text-xl font-medium">Manage your team members</p>
          </div>
          <Button
            onClick={() => setShowAddEmployee(!showAddEmployee)}
            className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-6 text-base font-semibold"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {showAddEmployee ? "Cancel" : "Add Employee"}
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-700">{success}</p>
            </CardContent>
          </Card>
        )}

        {showAddEmployee && (
          <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle>Create New Employee</CardTitle>
              <CardDescription>Add a new employee to your team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <Label htmlFor="workId">Work ID (optional)</Label>
                  <Input
                    id="workId"
                    value={newEmployee.workId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, workId: e.target.value })}
                    placeholder="Enter unique work identifier"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Employee
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : employees.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No employees found. Create your first employee.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead className="text-sm text-gray-600">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Work ID</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Completed</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="bg-white rounded-lg shadow-sm">
                        <td className="px-4 py-3 font-semibold">{employee.name}</td>
                        <td className="px-4 py-3 text-gray-700">{employee.email}</td>
                        <td className="px-4 py-3">{employee.workId || "-"}</td>
                        <td className="px-4 py-3">{employee.totalTasks}</td>
                        <td className="px-4 py-3 text-green-700">{employee.completedTasks}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/app/admin/employees/${employee.id}`}>
                              <Button variant="outline" size="sm">Edit</Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


