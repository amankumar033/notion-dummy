import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminSession, getEmployeeSession } from "@/lib/get-session"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  try {
    // Try admin session first
    const adminSession = await getAdminSession()
    const employeeSession = await getEmployeeSession()

    if (!adminSession && !employeeSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let admin: any = null
    let employee: any = null

    if (adminSession && (adminSession as any).role === "ADMIN") {
      const id = (adminSession as any).id
      admin = await prisma.admin.findUnique({
        where: { id },
        include: { company: true },
      })
    } else if (employeeSession && (employeeSession as any).role === "EMPLOYEE") {
      const id = (employeeSession as any).id
      employee = await prisma.employee.findUnique({
        where: { id },
      })
    }

    if (!admin && !employee) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { title, description, status, priority, deadline, employeeId, teamId } = await req.json()

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check permissions
    if (admin && task.company_id !== admin.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    if (employee && task.employee_id !== employee.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(employeeId !== undefined && { employee_id: employeeId || null }),
        ...(teamId !== undefined && { team_id: teamId || null }),
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  try {
    const adminSession = await getAdminSession()
    if (!adminSession || (adminSession as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (adminSession as any).id

    const admin = await prisma.admin.findUnique({
      where: { id },
    })

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task || task.company_id !== admin.company_id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: taskId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
