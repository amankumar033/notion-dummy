import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  const { employeeId } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    const id = session.user.id

    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employee || employee.admin_id !== admin.id) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    await prisma.employee.delete({
      where: { id: employeeId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  const { employeeId } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    const adminId = session.user.id

    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const body = await req.json()
    const name: string | undefined = body?.name
    const email: string | undefined = body?.email
    const workId: string | null | undefined = body?.workId
    const password: string | undefined = body?.password

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employee || employee.admin_id !== admin.id) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    const data: any = {}
    if (typeof name === "string" && name.trim()) data.name = name.trim()
    if (typeof email === "string" && email.trim()) data.email = email.trim().toLowerCase()
    if (workId !== undefined) data.work_id = workId || null
    if (typeof password === "string" && password.trim().length >= 8) {
      data.password = await bcrypt.hash(password, 10)
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 })
    }

    try {
      const updated = await prisma.employee.update({
        where: { id: employeeId },
        data,
        select: { id: true, name: true, email: true, work_id: true },
      })
      return NextResponse.json({
        ...updated,
        workId: (updated as any).work_id,
      })
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
      throw err
    }
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    )
  }
}



