"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, CheckSquare, FileText, Plus } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalAdmins: number
  totalEmployees: number
  totalTasks: number
  companyTasks: number
}

export default function CompanyDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [companyInfo, setCompanyInfo] = useState<any>(null)

  useEffect(() => {
    fetchDashboardData()
    fetchCompanyInfo()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/cmp/dashboard")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanyInfo = async () => {
    try {
      const res = await fetch("/api/user/profile")
      if (res.ok) {
        const data = await res.json()
        setCompanyInfo(data)
      }
    } catch (error) {
      console.error("Error fetching company info:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Company Dashboard
            </h1>
            <p className="text-gray-600 text-xl font-medium">
              {companyInfo?.name || "Company"} Overview
            </p>
          </div>
          <Link href="/app/cmp/admins/new">
            <Button className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-6 text-base font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              Create Admin
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm group border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Total Admins</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalAdmins || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Company administrators</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm group border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Total Employees</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalEmployees || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Active employees</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50/30 backdrop-blur-sm group border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Total Tasks</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalTasks || 0}</div>
                <p className="text-xs text-gray-500 mt-1">All company tasks</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm group border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Company Tasks</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats?.companyTasks || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Tasks in your company</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/app/cmp/admins">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  Manage Admins
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Create and manage company administrators
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/app/cmp/employees">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200/80 bg-gradient-to-br from-white to-green-50/20 backdrop-blur-sm border-0 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-green-600" />
                  View Employees
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  View all employees across all admins
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/app/cmp/tasks">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200/80 bg-gradient-to-br from-white to-yellow-50/20 backdrop-blur-sm border-0 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <CheckSquare className="h-6 w-6 text-yellow-600" />
                  Company Tasks
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  View all tasks in your company
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}


