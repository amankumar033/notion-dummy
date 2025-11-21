"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, CircleDot, Calendar, User, Filter } from "lucide-react"
import { CustomDropdown } from "@/components/ui/custom-dropdown"
import { Label } from "@/components/ui/label"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  employee: {
    id: string
    name: string | null
    email: string
  } | null
}

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== "all") params.append("status", filter)

      const res = await fetch(`/api/tasks?${params.toString()}`, {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnStatus = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    if (taskId) {
      handleDrop(taskId, status)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "IN_PROGRESS":
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <CircleDot className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "border-l-red-500 bg-gradient-to-r from-red-50/30 to-white"
      case "MEDIUM":
        return "border-l-yellow-500 bg-gradient-to-r from-yellow-50/30 to-white"
      default:
        return "border-l-gray-300 bg-gradient-to-r from-gray-50/30 to-white"
    }
  }

  const notStartedTasks = tasks.filter(t => t.status === "NOT_STARTED")
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS")
  const completedTasks = tasks.filter(t => t.status === "COMPLETED")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
              My Tasks
            </h1>
            <p className="text-gray-600 text-xl font-medium">Drag and drop tasks to change their status</p>
          </div>
          <div className="w-64">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Filter</Label>
            <CustomDropdown
              options={[
                { value: "all", label: "All Tasks" },
                { value: "NOT_STARTED", label: "Not Started" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "COMPLETED", label: "Completed" },
              ]}
              value={filter}
              onChange={(value) => setFilter(value)}
              placeholder="Filter tasks"
            />
          </div>
        </div>

        {/* Drag and Drop Columns */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Not Started Column */}
            <Card 
              className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-gray-50/20 backdrop-blur-sm border-0 min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnStatus(e, "NOT_STARTED")}
            >
              <CardHeader className="border-b border-gray-200/80 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <CircleDot className="h-5 w-5 text-gray-600" />
                  Not Started ({notStartedTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {notStartedTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`p-4 rounded-xl border-l-4 ${getPriorityColor(task.priority)} shadow-md hover:shadow-lg transition-all duration-200 cursor-move`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      {getStatusIcon(task.status)}
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
                {notStartedTasks.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No tasks</p>
                )}
              </CardContent>
            </Card>

            {/* In Progress Column */}
            <Card 
              className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0 min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnStatus(e, "IN_PROGRESS")}
            >
              <CardHeader className="border-b border-gray-200/80 bg-gradient-to-r from-blue-50/50 to-cyan-50/30">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Clock className="h-5 w-5 text-blue-600" />
                  In Progress ({inProgressTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {inProgressTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`p-4 rounded-xl border-l-4 ${getPriorityColor(task.priority)} shadow-md hover:shadow-lg transition-all duration-200 cursor-move`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      {getStatusIcon(task.status)}
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
                {inProgressTasks.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No tasks</p>
                )}
              </CardContent>
            </Card>

            {/* Completed Column */}
            <Card 
              className="shadow-lg border-gray-200/80 bg-gradient-to-br from-white to-green-50/20 backdrop-blur-sm border-0 min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnStatus(e, "COMPLETED")}
            >
              <CardHeader className="border-b border-gray-200/80 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Completed ({completedTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`p-4 rounded-xl border-l-4 ${getPriorityColor(task.priority)} shadow-md hover:shadow-lg transition-all duration-200 cursor-move opacity-75`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-through">{task.title}</h3>
                      {getStatusIcon(task.status)}
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2 line-through">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No tasks</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

