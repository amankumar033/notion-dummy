import { NextResponse } from "next/server"
import { adminAuthOptions } from "@/lib/auth-admin"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { encode } from "next-auth/jwt"
import { cookies } from "next/headers"

const isProduction = process.env.NODE_ENV === "production"
const adminSessionCookieName = isProduction
  ? "__Secure-next-auth.session-token.admin"
  : "next-auth.session-token.admin"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Authenticate using admin auth logic
    const admin = await (prisma as any).admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create token using NextAuth's encode function
    const token = await encode({
      token: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "ADMIN",
        companyId: admin.company_id,
      },
      secret: adminAuthOptions.secret!,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(adminSessionCookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "ADMIN",
        companyId: admin.company_id,
      },
    })
  } catch (error) {
    console.error("Admin Signin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

