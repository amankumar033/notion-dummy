import { NextResponse } from "next/server"
import { getCompanySession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  const { adminId } = await params
  try {
    const session = await getCompanySession()
    if (!session || (session as any).role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const companyId = (session as any).id

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.company_id !== companyId) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    await prisma.admin.delete({
      where: { id: adminId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  const { adminId } = await params
  try {
    const session = await getCompanySession()
    if (!session || (session as any).role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const companyId = (session as any).id

    const body = await req.json()
    const name: string | undefined = body?.name
    const email: string | undefined = body?.email
    const password: string | undefined = body?.password

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.company_id !== companyId) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const data: Record<string, any> = {}
    if (typeof name === "string" && name.trim().length > 0) data.name = name.trim()
    if (typeof email === "string" && email.trim().length > 0) data.email = email.trim().toLowerCase()
    if (typeof password === "string" && password.trim().length >= 8) {
      const bcrypt = (await import("bcryptjs")).default
      data.password = await bcrypt.hash(password, 10)
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 })
    }

    try {
      const updated = await prisma.admin.update({
        where: { id: adminId },
        data,
        select: { id: true, name: true, email: true }
      })
      return NextResponse.json(updated)
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
      throw err
    }
  } catch (error) {
    console.error("Error updating admin:", error)
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    )
  }
}


