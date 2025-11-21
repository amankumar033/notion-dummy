import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAnySession } from "@/lib/get-session"

export async function GET(req: Request) {
  try {
    const sessionData = await getAnySession()
    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = sessionData.session
    const role = (session as any).role
    const id = (session as any).id

    // Check Admin
    if (role === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { id },
      })

      if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 })
      }

      const tasks = await prisma.task.findMany({
        where: {
          company_id: admin.company_id,
          admin_id: admin.id,
        },
      })

      const employees = await prisma.employee.findMany({
        where: {
          admin_id: admin.id,
        },
      })

      const totalTasks = tasks.length
      const completedTasks = tasks.filter((t) => t.status === "completed").length
      const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
      const notStartedTasks = tasks.filter((t) => t.status === "pending").length
      const totalEmployees = employees.length
      const assignedTasks = tasks.filter((t) => t.employee_id !== null).length

      return NextResponse.json({
        totalTasks,
        completedTasks,
        inProgressTasks,
        notStartedTasks,
        totalEmployees,
        assignedTasks,
        unassignedTasks: totalTasks - assignedTasks,
      })
    }

    // Check Employee
    if (role === "EMPLOYEE") {
      const employee = await prisma.employee.findUnique({
        where: { id },
      })

      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 })
      }

      const tasks = await prisma.task.findMany({
        where: {
          employee_id: employee.id,
        },
      })

      const totalTasks = tasks.length
      const completedTasks = tasks.filter((t) => t.status === "completed").length
      const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
      const notStartedTasks = tasks.filter((t) => t.status === "pending").length

      return NextResponse.json({
        totalTasks,
        completedTasks,
        inProgressTasks,
        notStartedTasks,
        totalEmployees: 0,
        assignedTasks: totalTasks,
        unassignedTasks: 0,
      })
    }

    // Check Company
    if (role === "COMPANY") {
      const tasks = await prisma.task.findMany({
        where: {
          company_id: id,
        },
      })

      const employees = await prisma.employee.findMany({
        where: {
          company_id: id,
        },
      })

      const totalTasks = tasks.length
      const completedTasks = tasks.filter((t) => t.status === "completed").length
      const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
      const notStartedTasks = tasks.filter((t) => t.status === "pending").length
      const totalEmployees = employees.length
      const assignedTasks = tasks.filter((t) => t.employee_id !== null).length

      return NextResponse.json({
        totalTasks,
        completedTasks,
        inProgressTasks,
        notStartedTasks,
        totalEmployees,
        assignedTasks,
        unassignedTasks: totalTasks - assignedTasks,
      })
    }

    return NextResponse.json({ 
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      notStartedTasks: 0,
      totalEmployees: 0,
      assignedTasks: 0,
      unassignedTasks: 0,
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
