"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { CustomDropdown } from "@/components/ui/custom-dropdown"

export default function EditTaskPage() {
  const params = useParams<{ taskId: string }>()
  const taskId = params?.taskId
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    deadline: "",
    employeeId: "",
    teamId: "",
  })

  useEffect(() => {
    const load = async () => {
      if (!taskId) return
      try {
        setLoading(true)
        const [taskRes, employeesRes, teamsRes] = await Promise.all([
          fetch(`/api/tasks?taskId=${taskId}`, { credentials: "include" }),
          fetch("/api/admin/employees", { credentials: "include" }),
          fetch("/api/admin/teams", { credentials: "include" }),
        ])
        if (employeesRes.ok) setEmployees(await employeesRes.json())
        if (teamsRes.ok) setTeams(await teamsRes.json())
        if (taskRes.ok) {
          const all = await taskRes.json()
          const t = (all || []).find((x: any) => x.id === taskId) || null
          if (!t) setError("Task not found")
          else {
            setForm({
              title: t.title ?? "",
              description: t.description ?? "",
              status: t.status ?? "pending",
              priority: t.priority ?? "medium",
              deadline: t.deadline ? new Date(t.deadline).toISOString().split("T")[0] : "",
              employeeId: t.employee?.id || "",
              teamId: t.team?.id || "",
            })
          }
        } else {
          setError("Failed to load task")
        }
      } catch {
        setError("Failed to load task")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [taskId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskId) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          status: form.status,
          priority: form.priority,
          deadline: form.deadline || null,
          employeeId: form.employeeId || null,
          teamId: form.teamId || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSuccess("Task updated")
        setTimeout(() => router.push("/app/admin/tasks"), 800)
      } else {
        setError(data?.error || "Failed to update task")
      }
    } catch {
      setError("Failed to update task")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <Link href="/app/admin/tasks" className="text-blue-600 hover:underline mb-4 inline-block">
          Back to Tasks
        </Link>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-gray-600">Loading...</div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {error && <div className="text-red-600 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full border rounded-md px-3 py-2"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Status</Label>
                    <CustomDropdown
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "completed", label: "Completed" },
                      ]}
                      value={form.status}
                      onChange={(v) => setForm({ ...form, status: v })}
                    />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <CustomDropdown
                      options={[
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                      ]}
                      value={form.priority}
                      onChange={(v) => setForm({ ...form, priority: v })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Deadline</Label>
                    <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                  </div>
                  <div>
                    <Label>Team</Label>
                    <CustomDropdown
                      options={[{ value: "", label: "No Team" }, ...teams.map((t) => ({ value: t.id, label: t.name }))]}
                      value={form.teamId}
                      onChange={(v) => setForm({ ...form, teamId: v })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Assignee</Label>
                  <CustomDropdown
                    options={[
                      { value: "", label: "Unassigned" },
                      ...employees.map((e) => ({ value: e.id, label: e.name || e.email })),
                    ]}
                    value={form.employeeId}
                    onChange={(v) => setForm({ ...form, employeeId: v })}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


