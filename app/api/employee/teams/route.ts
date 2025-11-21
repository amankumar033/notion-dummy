import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getEmployeeSession } from "@/lib/get-session"

export async function GET(req: Request) {
  try {
    const session = await getEmployeeSession()
    if (!session || (session as any).role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employeeId = (session as any).id

    const teamMemberships = await prisma.teamMember.findMany({
      where: { employee_id: employeeId },
      include: {
        team: {
          include: {
            members: {
              include: {
                employee: {
                  select: { id: true, name: true, email: true },
                },
                admin: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
      },
    })

    const teams = teamMemberships.map((membership) => membership.team)

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Error fetching employee teams:", error)
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    )
  }
}

