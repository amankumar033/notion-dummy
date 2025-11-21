"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditTeamPage() {
  const params = useParams<{ teamId: string }>()
  const router = useRouter()
  const { teamId } = params
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", description: "", employeeIds: [] as string[] })
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    if (!teamId) return
    const load = async () => {
      try {
        setLoading(true)
        const [teamRes, employeesRes] = await Promise.all([
          fetch(`/api/admin/teams/${teamId}`, { credentials: "include" }),
          fetch("/api/admin/employees", { credentials: "include" }),
        ])

        if (teamRes.ok) {
          const teamData = await teamRes.json()
          setForm({
            name: teamData.name || "",
            description: teamData.description || "",
            employeeIds: teamData.members
              ?.filter((m: any) => m.employee_id)
              .map((m: any) => m.employee_id) || [],
          })
        } else {
          setError("Failed to load team")
        }

        if (employeesRes.ok) {
          const employeesData = await employeesRes.json()
          setEmployees(employeesData)
        }
      } catch (e) {
        setError("Failed to load team")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [teamId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamId) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`/api/admin/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          employeeIds: form.employeeIds,
          includeAdmin: true,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSuccess("Team updated successfully")
        setTimeout(() => router.push("/app/admin/teams"), 1000)
      } else {
        setError(data?.error || "Failed to update team")
      }
    } catch (e) {
      setError("Failed to update team")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/app/admin/teams">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Edit Team
            </h1>
            <p className="text-gray-600 text-xl font-medium">Update team details and members</p>
          </div>
        </div>

        <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
            <CardDescription>Update the team name, description, and members</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Select Employees</Label>
                <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200">
                  {employees.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">No employees available.</p>
                  ) : (
                    employees.map((employee) => {
                      const checked = form.employeeIds.includes(employee.id)
                      return (
                        <label
                          key={employee.id}
                          className="flex items-center justify-between px-4 py-2 border-b border-gray-100 last:border-none hover:bg-gray-50 cursor-pointer"
                        >
                          <div>
                            <p className="font-medium text-sm text-gray-800">{employee.name || employee.email}</p>
                            <p className="text-xs text-gray-500">
                              {employee.email}
                              {employee.workId ? ` · Work ID: ${employee.workId}` : ""}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setForm((prev) => ({
                                ...prev,
                                employeeIds: e.target.checked
                                  ? [...prev.employeeIds, employee.id]
                                  : prev.employeeIds.filter((id) => id !== employee.id),
                              }))
                            }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </label>
                      )
                    })
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/app/admin/teams">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


