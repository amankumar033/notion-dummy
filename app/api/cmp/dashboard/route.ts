import { NextResponse } from "next/server"
import { getCompanySession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getCompanySession()
    if (!session || (session as any).role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (session as any).id

    // Get company
    const company = await prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    // Get stats
    const [totalAdmins, totalEmployees, totalTasks, companyTasks] = await Promise.all([
      prisma.admin.count({
        where: { company_id: company.id },
      }),
      prisma.employee.count({
        where: { company_id: company.id },
      }),
      prisma.task.count(),
      prisma.task.count({
        where: { company_id: company.id },
      }),
    ])

    return NextResponse.json({
      totalAdmins,
      totalEmployees,
      totalTasks,
      companyTasks,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}


