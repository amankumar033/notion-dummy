import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      )
    }

    // Check Company
    let company = await prisma.company.findUnique({
      where: { email },
    })
    if (company) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await prisma.company.update({
        where: { id: company.id },
        data: { password: hashedPassword },
      })
      return NextResponse.json({ success: true })
    }

    // Check Admin
    let admin = await prisma.admin.findUnique({
      where: { email },
    })
    if (admin) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: hashedPassword },
      })
      return NextResponse.json({ success: true })
    }

    // Check Employee
    let employee = await prisma.employee.findUnique({
      where: { email },
    })
    if (employee) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await prisma.employee.update({
        where: { id: employee.id },
        data: { password: hashedPassword },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
