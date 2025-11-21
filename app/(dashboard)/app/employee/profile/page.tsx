"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Shield, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserInfo {
  name: string | null
  email: string
  image: string | null
  role: string
}

export default function EmployeeProfilePage() {
  const { toast } = useToast()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/employee/profile", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setUserInfo(data)
      } else {
        console.error("Failed to fetch profile:", res.statusText)
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      })
      return
    }

    setChangingPassword(true)
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to change password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setChangingPassword(false)
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
        {/* Header */}
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
            Profile & Settings
          </h1>
          <p className="text-gray-600 text-xl font-medium">Manage your profile and account settings</p>
        </div>

        {/* Profile Information */}
        <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
          <CardHeader className="border-b border-gray-200/80 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Profile Information</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  View your account details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-xl border border-gray-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Email</span>
                </div>
                <p className="text-base text-gray-900 ml-8 font-medium">{userInfo?.email || "N/A"}</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-xl border border-gray-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Name</span>
                </div>
                <p className="text-base text-gray-900 ml-8 font-medium">{userInfo?.name || "Not set"}</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-xl border border-gray-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Role</span>
                </div>
                <span className="ml-8 inline-block px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                  {userInfo?.role || "EMPLOYEE"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
          <CardHeader className="border-b border-gray-200/80 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Change Password</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Update your account password
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 mb-2 block">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                  minLength={8}
                />
              </div>
              <Button
                type="submit"
                disabled={changingPassword}
                className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-6 text-base font-semibold"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

