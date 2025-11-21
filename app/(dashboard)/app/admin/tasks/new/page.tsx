"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomDropdown } from "@/components/ui/custom-dropdown"
import { ChevronRight, Home, Upload, X, Search, MessageCircle, Paperclip, Users2 } from "lucide-react"
import Link from "next/link"

export default function NewTaskPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  // Chat options removed; all tasks are chattable by default in chat screens
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    deadline: "",
    employeeId: "",
    teamId: "",
  })

  useEffect(() => {
    fetchEmployees()
    fetchTeams()
  }, [])

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/admin/employees")
      if (res.ok) {
        const data = await res.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    }
  }

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/admin/teams")
      if (res.ok) {
        const data = await res.json()
        setTeams(data)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          deadline: formData.deadline || null,
          employeeId: formData.employeeId || null,
          teamId: formData.teamId || null,
          // chat flags removed
        })
      })

      if (res.ok) {
        const data = await res.json()
        console.log("Task created successfully:", data)
        // Small delay to ensure database commit
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push("/app/admin/tasks")
        router.refresh() // Force refresh to reload tasks
      } else {
        const errorData = await res.json().catch(() => ({ error: "Failed to create task" }))
        console.error("Task creation error:", errorData)
        alert(errorData.error || "Failed to create task. Please check the console for details.")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task. Please check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center space-x-2 text-sm">
          <Link href="/app/admin/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link href="/app/admin/tasks" className="text-gray-600 hover:text-blue-600 transition-colors">
            Tasks
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Create Task</span>
        </nav>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
              <CardHeader className="border-b border-gray-200/80 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Create New Task</CardTitle>
                  <CardDescription className="text-base text-gray-600 mt-1">Add a new task to assign to your team</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Status</Label>
                      <CustomDropdown
                        options={[
                          { value: "pending", label: "Pending" },
                          { value: "in_progress", label: "In Progress" },
                          { value: "completed", label: "Completed" },
                        ]}
                        value={formData.status}
                        onChange={(value) => setFormData({ ...formData, status: value })}
                        placeholder="Select status"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Priority</Label>
                      <CustomDropdown
                        options={[
                          { value: "low", label: "Low" },
                          { value: "medium", label: "Medium" },
                          { value: "high", label: "High" },
                        ]}
                        value={formData.priority}
                        onChange={(value) => setFormData({ ...formData, priority: value })}
                        placeholder="Select priority"
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="deadline" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Deadline
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Assign To Team</Label>
                      <CustomDropdown
                        options={[
                          { value: "", label: "No Team" },
                          ...teams.map((team) => ({
                            value: team.id,
                            label: team.name
                          }))
                        ]}
                        value={formData.teamId}
                        onChange={(value) => setFormData({ ...formData, teamId: value })}
                        placeholder="Select team"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Assign To Employee</Label>
                    <CustomDropdown
                      options={[
                        { value: "", label: "Unassigned" },
                        ...employees.map((emp) => ({
                          value: emp.id,
                          label: emp.name ? `${emp.name}${emp.workId ? ` (${emp.workId})` : ""}` : emp.email,
                        })),
                      ]}
                      value={formData.employeeId}
                      onChange={(value) => setFormData({ ...formData, employeeId: value })}
                      placeholder="Select employee"
                    />
                  </div>
                  
                  {/* File Upload Section */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Attachments</Label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                        isDragOver
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or click to select
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Select Files
                      </label>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024).toFixed(2)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chat options removed */}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-6 text-base font-semibold"
                    >
                      {loading ? "Creating..." : "Create Task"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="rounded-full px-6 py-6 text-base font-semibold border-2"
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
    </div>
  )
}


