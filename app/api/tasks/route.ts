import { NextResponse } from "next/server"
import { getAdminSession, getEmployeeSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    // Try to get admin session first
    let admin = null
    let employee = null
    let adminSession = await getAdminSession()
    
    if (adminSession && (adminSession as any).role === "ADMIN") {
      const id = (adminSession as any).id
      if (id) {
        admin = await prisma.admin.findUnique({
          where: { id },
          include: { company: true },
        })
      }
    }
    
    // If no admin session, try employee session
    if (!admin) {
      const employeeSession = await getEmployeeSession()
      if (employeeSession && (employeeSession as any).role === "EMPLOYEE") {
        const id = (employeeSession as any).id
        if (id) {
          employee = await prisma.employee.findUnique({
            where: { id },
          })
        }
      }
    }

    if (!admin && !employee) {
      console.error("GET /api/tasks: No valid session found")
      return NextResponse.json({ error: "Unauthorized: Please login" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const assignedToId = searchParams.get("assignedToId")
    const priority = searchParams.get("priority")

    const where: any = {}

    if (admin) {
      const companyId = (adminSession as any).companyId || admin.company_id
      where.company_id = companyId
      where.admin_id = admin.id
    } else if (employee) {
      where.employee_id = employee.id
    }

    if (status) {
      where.status = status
    }
    if (assignedToId && admin) {
      where.employee_id = assignedToId
    }
    if (priority) {
      where.priority = priority
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { getAdminSession } = await import("@/lib/get-session")
    const session = await getAdminSession()
    if (!session || (session as any).role !== "ADMIN") {
      console.error("Task creation failed: No valid admin session")
      return NextResponse.json({ error: "Unauthorized: Please login as admin" }, { status: 401 })
    }

    const id = (session as any).id
    if (!id) {
      console.error("Task creation failed: No admin ID in session")
      return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 401 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id },
      include: { company: true },
    })

    if (!admin) {
      console.error("Task creation failed: Admin not found in database", id)
      return NextResponse.json({ error: "Unauthorized: Admin not found" }, { status: 403 })
    }

    // Use company_id from admin record (more reliable than session)
    const companyId = admin.company_id
    if (!companyId) {
      console.error("Task creation failed: No company_id for admin", admin.id)
      return NextResponse.json({ error: "Invalid admin: No company associated" }, { status: 400 })
    }

    const { title, description, status, priority, deadline, employeeId, teamId, enableChat, chatType } = await req.json()

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    // Validate employeeId if provided
    if (employeeId) {
      const employee = await prisma.employee.findFirst({
        where: {
          id: employeeId,
          company_id: companyId,
          admin_id: admin.id,
        },
      })
      if (!employee) {
        return NextResponse.json(
          { error: "Invalid employee: Employee not found or doesn't belong to your company" },
          { status: 400 }
        )
      }
    }

    // Validate teamId if provided
    if (teamId) {
      const team = await prisma.team.findFirst({
        where: {
          id: teamId,
          company_id: companyId,
          admin_id: admin.id,
        },
      })
      if (!team) {
        return NextResponse.json(
          { error: "Invalid team: Team not found or doesn't belong to your company" },
          { status: 400 }
        )
      }
    }

    console.log("Creating task with data:", {
      title: title.trim(),
      company_id: companyId,
      admin_id: admin.id,
      employee_id: employeeId || null,
      team_id: teamId || null,
    })

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || "pending",
        priority: priority || "medium",
        deadline: deadline ? new Date(deadline) : null,
        company_id: companyId,
        admin_id: admin.id,
        employee_id: employeeId || null,
        team_id: teamId || null,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    console.log("Task created successfully:", task.id)

    // Create chat if enabled
    if (enableChat && chatType) {
      // Chat will be created when first message is sent
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    console.error("Error creating task:", error)
    // Return more detailed error message
    const errorMessage = error?.message || "Failed to create task"
    return NextResponse.json(
      { error: errorMessage, details: error?.code || "UNKNOWN_ERROR" },
      { status: 500 }
    )
  }
}
