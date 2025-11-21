import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const role = (session.user as any).role
    const id = session.user.id

    // Check Company
    if (role === "COMPANY") {
      const company = await prisma.company.findUnique({
        where: { id },
      })
      if (company) {
        const isPasswordValid = await bcrypt.compare(currentPassword, company.password)
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 400 }
          )
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.company.update({
          where: { id: company.id },
          data: { password: hashedPassword },
        })
        return NextResponse.json({ success: true })
      }
    }

    // Check Admin
    if (role === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { id },
      })
      if (admin) {
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password)
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 400 }
          )
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.admin.update({
          where: { id: admin.id },
          data: { password: hashedPassword },
        })
        return NextResponse.json({ success: true })
      }
    }

    // Check Employee
    if (role === "EMPLOYEE") {
      const employee = await prisma.employee.findUnique({
        where: { id },
      })
      if (employee) {
        const isPasswordValid = await bcrypt.compare(currentPassword, employee.password)
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 400 }
          )
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.employee.update({
          where: { id: employee.id },
          data: { password: hashedPassword },
        })
        return NextResponse.json({ success: true })
      }
    }

    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    )
  }
}
