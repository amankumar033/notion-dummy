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
    const admin = await prisma.admin.findUnique({
      where: { id },
      include: { company: true },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({
      name: admin.name,
      email: admin.email,
      image: null,
      role: "ADMIN",
      companyId: admin.company_id,
      id: admin.id,
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
    const session = await getAdminSession()
    if (!session || (session as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (session as any).id
    const { name, email } = await req.json()

    const admin = await prisma.admin.findUnique({
      where: { id },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    })

    return NextResponse.json({
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: "ADMIN",
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}


