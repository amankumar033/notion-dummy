"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon } from "lucide-react"

export default function EmployeeSettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
            Settings
          </h1>
          <p className="text-gray-600 text-xl font-medium">Manage your account settings</p>
        </div>

        <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-bold text-gray-900">Account Settings</CardTitle>
            </div>
            <CardDescription className="text-base text-gray-700 mt-2">
              Additional settings and preferences will be available here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

