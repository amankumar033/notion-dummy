import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params
    const session = await getAdminSession()
    if (!session || (session as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (session as any).id
    const companyId = (session as any).companyId

    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        company_id: companyId,
        admin_id: id,
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

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error("Error fetching team:", error)
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params
    const session = await getAdminSession()
    if (!session || (session as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (session as any).id
    const companyId = (session as any).companyId

    // Verify team belongs to this admin
    const existingTeam = await prisma.team.findFirst({
      where: {
        id: teamId,
        company_id: companyId,
        admin_id: id,
      },
    })

    if (!existingTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
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
            admin_id: id,
            company_id: companyId,
          },
          select: { id: true },
        })
      : []

    const validEmployeeIds = employees.map((e) => e.id)

    // Delete existing members
    await prisma.teamMember.deleteMany({
      where: { team_id: teamId },
    })

    // Update team and create new members
    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        name,
        description: description || null,
        members: {
          create: [
            ...(includeAdmin
              ? [
                  {
                    admin_id: id,
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

    return NextResponse.json(team)
  } catch (error) {
    console.error("Error updating team:", error)
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params
    const session = await getAdminSession()
    if (!session || (session as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (session as any).id
    const companyId = (session as any).companyId

    // Verify team belongs to this admin
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        company_id: companyId,
        admin_id: id,
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    await prisma.team.delete({
      where: { id: teamId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting team:", error)
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    )
  }
}


