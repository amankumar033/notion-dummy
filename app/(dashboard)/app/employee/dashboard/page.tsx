"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, CircleDot, FileText, User } from "lucide-react"
import Link from "next/link"

interface Analytics {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  notStartedTasks: number
}

interface UserInfo {
  name: string | null
  email: string
  image: string | null
  role: string
}

export default function EmployeeDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserInfo()
    fetchAnalytics()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/employee/profile", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setUserInfo(data)
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const completionRate = analytics && analytics.totalTasks > 0 
    ? ((analytics.completedTasks / analytics.totalTasks) * 100).toFixed(1)
    : "0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header with Profile */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Employee Dashboard
            </h1>
            <p className="text-gray-600 text-xl font-medium">Your tasks and activities</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Profile Icon */}
            <Link href="/app/employee/profile">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer border-4 border-white">
                {userInfo?.image ? (
                  <img src={userInfo.image} alt={userInfo.name || "User"} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span>{userInfo?.name?.[0]?.toUpperCase() || userInfo?.email[0].toUpperCase() || "U"}</span>
                )}
              </div>
            </Link>
            {userInfo && (
              <div className="text-right">
                <p className="font-semibold text-gray-900">{userInfo.name || "Employee"}</p>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {userInfo.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm group border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Total Tasks</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{analytics?.totalTasks || 0}</div>
                <p className="text-xs text-gray-500 mt-1">All assigned tasks</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 border-gray-200/80 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-green-50/20 backdrop-blur-sm group border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Completed</CardTitle>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{analytics?.completedTasks || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Tasks finished</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 border-gray-200/80 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-yellow-50/20 backdrop-blur-sm group border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">In Progress</CardTitle>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{analytics?.inProgressTasks || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Currently working</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-gray-500 border-gray-200/80 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/20 backdrop-blur-sm group border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Not Started</CardTitle>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <CircleDot className="h-5 w-5 text-gray-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-600">{analytics?.notStartedTasks || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Pending tasks</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/app/employee/tasks">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  My Tasks
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  View and manage all your assigned tasks
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/app/employee/profile">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200/80 bg-gradient-to-br from-white to-purple-50/20 backdrop-blur-sm border-0 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <User className="h-6 w-6 text-purple-600" />
                  Profile & Settings
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Manage your profile and account settings
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

