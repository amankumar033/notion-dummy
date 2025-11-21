import { NextResponse } from "next/server"
import { employeeAuthOptions } from "@/lib/auth-employee"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { encode } from "next-auth/jwt"
import { cookies } from "next/headers"

const isProduction = process.env.NODE_ENV === "production"
const employeeSessionCookieName = isProduction
  ? "__Secure-next-auth.session-token.employee"
  : "next-auth.session-token.employee"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Authenticate using employee auth logic
    const employee = await prisma.employee.findUnique({
      where: { email },
    })

    if (!employee) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create token using NextAuth's encode function
    const token = await encode({
      token: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: "EMPLOYEE",
        companyId: (employee as any).company_id,
        adminId: (employee as any).admin_id || undefined,
      },
      secret: employeeAuthOptions.secret!,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(employeeSessionCookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: "EMPLOYEE",
        companyId: (employee as any).company_id,
        adminId: (employee as any).admin_id,
      },
    })
  } catch (error) {
    console.error("Employee Signin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

