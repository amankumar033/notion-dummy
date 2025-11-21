import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

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
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const teams = await prisma.team.findMany({
      where: {
        company_id: admin.company_id,
      },
      include: {
        members: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            employee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Error fetching teams:", error)
    return NextResponse.json(
      { error: "Failed to fetch teams" },
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
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const { name, description, employeeIds = [], includeAdmin = true } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      )
    }

    // Ensure employee ids belong to this admin/company
    const uniqueEmployeeIds: string[] = Array.from(
      new Set(
        (employeeIds || []).filter((id: unknown): id is string => typeof id === "string" && id.trim().length > 0)
      )
    )
    const employees = uniqueEmployeeIds.length
      ? await prisma.employee.findMany({
          where: {
            id: { in: uniqueEmployeeIds },
            admin_id: admin.id,
          },
          select: { id: true },
        })
      : []

    const validEmployeeIds = employees.map((e) => e.id)

    // Create team with companyId and adminId
    const team = await prisma.team.create({
      data: {
        name,
        description: description || null,
        company_id: admin.company_id,
        admin_id: admin.id,
        members: {
          create: [
            ...(includeAdmin
              ? [
                  {
                    admin_id: admin.id,
                  },
                ]
              : []),
            ...validEmployeeIds.map((employeeId: string) => ({
              employee_id: employeeId,
            })),
          ],
        },
      },
      include: {
        members: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            employee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error("Error creating team:", error)
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    )
  }
}


