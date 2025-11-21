import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    const id = session.user.id

    // Check Admin
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id },
      include: { company: true },
    })

    if (!admin || !admin.company) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch employees from Employee table
    const employees = await prisma.employee.findMany({
      where: {
        admin_id: admin.id,
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
      orderBy: { createdAt: "desc" }
    })

    const employeesWithStats = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      image: null,
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    const id = session.user.id

    // Check Admin
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id },
      include: { company: true },
    })

    if (!admin || !admin.company) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if employee already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email }
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee with this email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create employee record
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        admin_id: admin.id,
        company_id: admin.company_id,
      },
    })

    return NextResponse.json({
      id: employee.id,
      name: employee.name,
      email: employee.email,
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    const id = session.user.id

    // Check Admin
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id },
    })

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get("id")

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      )
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employee || employee.admin_id !== admin.id) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Delete employee record
    await prisma.employee.delete({
      where: { id: employeeId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
