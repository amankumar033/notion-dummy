"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function NewAdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      toast({
        title: "Not Logged In",
        description: "Please login as a company to create admins.",
        variant: "destructive",
      })
      router.push("/auth/login")
    } else if (status === "authenticated") {
      const role = (session?.user as any)?.role
      if (role !== "COMPANY") {
        toast({
          title: "Unauthorized",
          description: `You must be logged in as a COMPANY to create admins. Current role: ${role || "Unknown"}`,
          variant: "destructive",
        })
        router.push("/app/cmp/dashboard")
      }
    }
  }, [status, session, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check session before submitting
    if (status !== "authenticated") {
      toast({
        title: "Not Logged In",
        description: "Please login first.",
        variant: "destructive",
      })
      return
    }

    const role = (session?.user as any)?.role
    if (role !== "COMPANY") {
      toast({
        title: "Unauthorized",
        description: `You must be logged in as a COMPANY. Current role: ${role || "Unknown"}`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/cmp/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: include cookies for session
        body: JSON.stringify(formData),
      })

      const errorData = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: "Admin created successfully!",
        })
        router.push("/app/cmp/admins")
      } else {
        console.error("Admin creation error:", errorData)
        toast({
          title: "Error",
          description: errorData.error || "Failed to create admin. Please make sure you're logged in as a company.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating admin:", error)
      toast({
        title: "Error",
        description: "Failed to create admin. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <Link href="/app/cmp/admins" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Admins
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create New Admin</CardTitle>
              <CardDescription>Add a new administrator to your company</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-700 to-cyan-600"
                  >
                    {loading ? "Creating..." : "Create Admin"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

