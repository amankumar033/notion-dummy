"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function EditAdminPage() {
  const params = useParams<{ adminId: string }>()
  const adminId = params?.adminId
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  useEffect(() => {
    const load = async () => {
      if (!adminId) return
      try {
        setLoading(true)
        // Reuse list API and pick one item for simplicity
        const res = await fetch("/api/cmp/admins", { credentials: "include" })
        if (res.ok) {
          const admins = await res.json()
          const target = (admins || []).find((a: any) => a.id === adminId)
          if (!target) {
            setError("Admin not found")
          } else {
            setForm((prev) => ({
              ...prev,
              name: target.name ?? "",
              email: target.email ?? "",
            }))
          }
        } else {
          setError("Failed to load admin")
        }
      } catch (e) {
        setError("Failed to load admin")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [adminId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminId) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`/api/cmp/admins/${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: form.name, email: form.email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSuccess("Admin updated")
        setTimeout(() => router.push("/app/cmp/admins"), 800)
      } else {
        setError(data?.error || "Failed to update admin")
      }
    } catch (e) {
      setError("Failed to update admin")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <Link href="/app/cmp/admins" className="text-blue-600 hover:underline mb-4 inline-block">
          Back to Admins
        </Link>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Edit Admin</CardTitle>
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


