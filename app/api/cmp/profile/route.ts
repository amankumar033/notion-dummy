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
    const company = await prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({
      name: company.name,
      email: company.email,
      image: null,
      role: "COMPANY",
      id: company.id,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getCompanySession()
    if (!session || (session as any).role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (session as any).id
    const { name, email } = await req.json()

    const company = await prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    })

    return NextResponse.json({
      name: updatedCompany.name,
      email: updatedCompany.email,
      role: "COMPANY",
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}


