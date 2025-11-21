"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Trash2, Users, Mail, User as UserIcon } from "lucide-react"
import Link from "next/link"

interface Admin {
  id: string
  name: string
  email: string
  createdAt: string
  totalEmployees: number
  totalTasks: number
}

export default function CompanyAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/cmp/admins")
      if (res.ok) {
        const data = await res.json()
        setAdmins(data)
        setError(null)
      } else {
        setError("Failed to load admins")
      }
    } catch (error) {
      console.error("Error fetching admins:", error)
      setError("Failed to load admins")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/cmp/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: include cookies
        body: JSON.stringify(newAdmin),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess("Admin created successfully!")
        setNewAdmin({ name: "", email: "", password: "" })
        setShowAddAdmin(false)
        fetchAdmins()
      } else {
        console.error("Admin creation error:", data)
        setError(data.error || "Failed to create admin")
      }
    } catch (error) {
      console.error("Error creating admin:", error)
      setError("Failed to create admin. Please check your connection and try again.")
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return

    try {
      const res = await fetch(`/api/cmp/admins/${adminId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSuccess("Admin deleted successfully!")
        fetchAdmins()
      } else {
        setError("Failed to delete admin")
      }
    } catch (error) {
      console.error("Error deleting admin:", error)
      setError("Failed to delete admin")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Company Admins
            </h1>
            <p className="text-gray-600 text-xl font-medium">Manage your company administrators</p>
          </div>
          <Button
            onClick={() => setShowAddAdmin(!showAddAdmin)}
            className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-6 text-base font-semibold"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {showAddAdmin ? "Cancel" : "Add Admin"}
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

        {showAddAdmin && (
          <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle>Create New Admin</CardTitle>
              <CardDescription>Add a new administrator to your company</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Admin
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : admins.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No admins found. Create your first admin.</p>
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
                      <th className="px-4 py-2">Employees</th>
                      <th className="px-4 py-2">Tasks</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="bg-white rounded-lg shadow-sm">
                        <td className="px-4 py-3 font-semibold">{admin.name}</td>
                        <td className="px-4 py-3 text-gray-700">{admin.email}</td>
                        <td className="px-4 py-3">{admin.totalEmployees}</td>
                        <td className="px-4 py-3">{admin.totalTasks}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/app/cmp/admins/${admin.id}`}>
                              <Button variant="outline" size="sm">Edit</Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAdmin(admin.id)}
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

