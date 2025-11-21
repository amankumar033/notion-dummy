import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { adminAuthOptions } from "@/lib/auth-admin"
import { employeeAuthOptions } from "@/lib/auth-employee"
import { companyAuthOptions } from "@/lib/auth-company"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const tryGetSession = async () => {
      return (
        (await getServerSession(authOptions)) ||
        (await getServerSession(adminAuthOptions)) ||
        (await getServerSession(employeeAuthOptions)) ||
        (await getServerSession(companyAuthOptions))
      )
    }

    const session = await tryGetSession()
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    const userId = session.user.id

    if (role === "ADMIN") {
      const admin = await prisma.admin.findUnique({ where: { id: userId }, select: { company_id: true } })

      const [employees, admins] = await Promise.all([
        prisma.employee.findMany({
          where: { company_id: admin?.company_id },
          select: { id: true, name: true, email: true, work_id: true },
          orderBy: { name: "asc" },
        }),
        prisma.admin.findMany({
          where: { company_id: admin?.company_id, NOT: { id: userId } },
          select: { id: true, name: true, email: true },
          orderBy: { name: "asc" },
        }),
      ])

      return NextResponse.json({
        employees,
        admins,
      })
    }

    if (role === "EMPLOYEE") {
      const employee = await prisma.employee.findUnique({
        where: { id: userId },
        select: {
          company_id: true,
          admin_id: true,
        },
      })

      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 })
      }

      const coworkers = await prisma.employee.findMany({
        where: {
          company_id: employee.company_id,
          NOT: { id: userId },
        },
        select: {
          id: true,
          name: true,
          email: true,
          work_id: true,
        },
        orderBy: { name: "asc" },
      })

      const admin = employee.admin_id
        ? await prisma.admin.findUnique({
            where: { id: employee.admin_id },
            select: { id: true, name: true, email: true },
          })
        : null

      return NextResponse.json({
        employees: coworkers,
        admin: admin ? { ...admin, role: "ADMIN" } : null,
      })
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  } catch (error) {
    console.error("Error fetching chat contacts:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat contacts" },
      { status: 500 }
    )
  }
}



