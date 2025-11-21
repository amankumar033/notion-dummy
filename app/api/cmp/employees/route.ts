import { NextResponse } from "next/server"
import { getCompanySession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getCompanySession()
    if (!session || (session as any).role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const companyId = (session as any).id

    const employees = await prisma.employee.findMany({
      where: { company_id: companyId },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const employeesWithStats = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      admin: emp.admin,
      createdAt: emp.createdAt,
      totalTasks: emp._count.tasks,
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


