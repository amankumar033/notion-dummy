"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function EditEmployeePage() {
  const params = useParams<{ employeeId: string }>()
  const employeeId = params?.employeeId
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", email: "", workId: "", password: "" })

  useEffect(() => {
    const load = async () => {
      if (!employeeId) return
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/employees`, { credentials: "include" })
        if (res.ok) {
          const employees = await res.json()
          const target = (employees || []).find((e: any) => e.id === employeeId)
          if (!target) {
            setError("Employee not found")
          } else {
            setForm({
              name: target.name ?? "",
              email: target.email ?? "",
              workId: target.workId ?? "",
              password: "",
            })
          }
        } else {
          setError("Failed to load employee")
        }
      } catch {
        setError("Failed to load employee")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [employeeId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeId) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`/api/admin/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          workId: form.workId || null,
          password: form.password || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSuccess("Employee updated")
        setTimeout(() => router.push("/app/admin/employees"), 800)
      } else {
        setError(data?.error || "Failed to update employee")
      }
    } catch {
      setError("Failed to update employee")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <Link href="/app/admin/employees" className="text-blue-600 hover:underline mb-4 inline-block">
          Back to Employees
        </Link>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Edit Employee</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-gray-600">Loading...</div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {error && <div className="text-red-600 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="workId">Work ID</Label>
                  <Input
                    id="workId"
                    value={form.workId}
                    onChange={(e) => setForm({ ...form, workId: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="password">New Password (optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Leave blank to keep existing password"
                    minLength={8}
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


