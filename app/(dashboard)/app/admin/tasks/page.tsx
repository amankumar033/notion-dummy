"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Filter, CheckCircle2, Clock, CircleDot, Calendar, User } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomDropdown } from "@/components/ui/custom-dropdown"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  deadline: string | null
  employee: {
    id: string
    name: string | null
    email: string
  } | null
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    assignee: "all"
  })
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [filters])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status !== "all") params.append("status", filters.status)
      if (filters.priority !== "all") params.append("priority", filters.priority)
      if (filters.assignee !== "all") params.append("assignedToId", filters.assignee)

      const res = await fetch(`/api/tasks?${params.toString()}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (res.ok) {
        const data = await res.json()
        setTasks(data || [])
      } else {
        const errorData = await res.json().catch(() => ({ error: res.statusText }))
        console.error("Failed to fetch tasks:", errorData.error || res.statusText, "Status:", res.status)
        // Don't set tasks to empty, keep existing tasks if any
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <CircleDot className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-gradient-to-r from-red-50/30 to-white"
      case "medium":
        return "border-l-yellow-500 bg-gradient-to-r from-yellow-50/30 to-white"
      default:
        return "border-l-gray-300 bg-gradient-to-r from-gray-50/30 to-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== "all" && task.status !== filters.status) return false
    if (filters.priority !== "all" && task.priority !== filters.priority) return false
    if (filters.assignee !== "all" && task.employee?.id !== filters.assignee) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Tasks
            </h1>
            <p className="text-gray-600 text-xl font-medium">Manage and track all your tasks</p>
          </div>
          <Link href="/app/admin/tasks/new">
            <Button className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-6 text-base font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              New Task
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0">
          <CardHeader className="border-b border-gray-200/80 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <Filter className="h-6 w-6 text-blue-600" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Status</Label>
                <CustomDropdown
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "pending", label: "Pending" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "completed", label: "Completed" },
                  ]}
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                  placeholder="Select status"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Priority</Label>
                <CustomDropdown
                  options={[
                    { value: "all", label: "All Priorities" },
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                  value={filters.priority}
                  onChange={(value) => setFilters({ ...filters, priority: value })}
                  placeholder="Select priority"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Assignee</Label>
                <CustomDropdown
                  options={[
                    { value: "all", label: "All Assignees" },
                    ...Array.from(new Set(tasks.map(t => t.employee?.id).filter(Boolean))).map((id) => {
                      const task = tasks.find(t => t.employee?.id === id)
                      return {
                        value: id!,
                        label: task?.employee?.name || task?.employee?.email || "Unknown"
                      }
                    })
                  ]}
                  value={filters.assignee}
                  onChange={(value) => setFilters({ ...filters, assignee: value })}
                  placeholder="Select assignee"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading tasks...</p>
            </CardContent>
          </Card>
        ) : filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CircleDot className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 text-xl font-semibold mb-2">No tasks found</p>
              <p className="text-gray-500 mb-6">Get started by creating your first task</p>
              <Link href="/app/admin/tasks/new">
                <Button className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-6 text-base font-semibold">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)} shadow-lg hover:shadow-xl transition-all duration-300 border-0`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(task.status)}
                        <CardTitle
                          className="text-xl font-bold text-gray-900 cursor-pointer"
                          onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        >
                          {task.title}
                        </CardTitle>
                      </div>
                      {task.description && (
                        <CardDescription className="text-base mt-2 text-gray-600">{task.description}</CardDescription>
                      )}
                    </div>
                    <CustomDropdown
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "completed", label: "Completed" },
                      ]}
                      value={task.status}
                      onChange={(value) => updateTaskStatus(task.id, value)}
                      className="w-[160px]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm">
                    {task.employee && (
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <User className="h-5 w-5 text-blue-600" />
                        <span>{task.employee.name || task.employee.email}</span>
                      </div>
                    )}
                    {task.deadline && (
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="ml-auto flex items-center gap-3">
                      <Link href={`/app/admin/chat?type=task&taskId=${task.id}`}>
                        <Button variant="outline" size="sm">Chat</Button>
                      </Link>
                      <Link href={`/app/admin/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">Edit</Button>
                      </Link>
                      <span className={`px-4 py-2 rounded-xl font-semibold text-sm border-2 ${
                        task.priority === "high" ? "bg-red-100 text-red-700 border-red-200" :
                        task.priority === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                        "bg-gray-100 text-gray-700 border-gray-200"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  {expandedTaskId === task.id && (
                    <div className="mt-4">
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">All Tasks</Label>
                      <CustomDropdown
                        options={tasks.map(t => ({ value: t.id, label: t.title }))}
                        value={task.id}
                        onChange={() => {}}
                        placeholder="Select a task"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



