import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  try {
    const session = await getAdminSession()
    if (!session || (session as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (session as any).id
    const companyId = (session as any).companyId

    const admin = await prisma.admin.findUnique({
      where: { id },
      include: { company: true },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Filter employees by both admin_id and company_id to ensure they belong to the admin's company
    const employees = await prisma.employee.findMany({
      where: {
        admin_id: admin.id,
        company_id: companyId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const employeesWithStats = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      workId: emp.work_id,
      createdAt: emp.createdAt,
      totalTasks: emp._count.tasks,
      completedTasks: emp.tasks.filter((t) => t.status === "completed").length,
      inProgressTasks: emp.tasks.filter((t) => t.status === "in_progress").length,
      notStartedTasks: emp.tasks.filter((t) => t.status === "pending").length,
    }))

    return NextResponse.json(employeesWithStats)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession()
    if (!session || (session as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (session as any).id
    const companyId = (session as any).companyId

    const admin = await prisma.admin.findUnique({
      where: { id },
      include: { company: true },
    })

    if (!admin || !admin.company) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { name, email, password, workId } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }
    // Optional: ensure workId uniqueness if provided
    if (workId) {
      const existingWorkId = await prisma.employee.findFirst({
        where: {
          company_id: admin.company_id,
          work_id: workId,
        },
        select: { id: true },
      })
      if (existingWorkId) {
        return NextResponse.json(
          { error: "Work ID already in use within your company" },
          { status: 400 }
        )
      }
    }

    // Check if employee already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee with this email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create employee record with companyId and adminId
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        work_id: workId || null,
        company_id: admin.company_id,
        admin_id: admin.id,
      },
    })

    return NextResponse.json({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      workId: employee.work_id,
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    )
  }
}


