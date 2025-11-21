import { NextResponse } from "next/server"
import { companyAuthOptions } from "@/lib/auth-company"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { encode } from "next-auth/jwt"
import { cookies } from "next/headers"

const isProduction = process.env.NODE_ENV === "production"
const companySessionCookieName = isProduction
  ? "__Secure-next-auth.session-token.cmp"
  : "next-auth.session-token.cmp"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Authenticate using company auth logic
    const company = await (prisma as any).company.findUnique({
      where: { email },
    })

    if (!company) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, company.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create token using NextAuth's encode function
    const token = await encode({
      token: {
        id: company.id,
        email: company.email,
        name: company.name,
        role: "COMPANY",
      },
      secret: companyAuthOptions.secret!,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(companySessionCookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: company.id,
        email: company.email,
        name: company.name,
        role: "COMPANY",
      },
    })
  } catch (error) {
    console.error("CMP Signin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
