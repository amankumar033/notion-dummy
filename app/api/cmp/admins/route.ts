import { NextResponse } from "next/server"
import { getCompanySession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const session = await getCompanySession()
    
    if (!session || (session as any).role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized: No session found. Please login." }, { status: 401 })
    }

    const id = (session as any).id

    const admins = await prisma.admin.findMany({
      where: { 
        company_id: id
      },
      include: {
        _count: {
          select: {
            Employee: true,
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const adminsWithStats = admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
      totalEmployees: (admin as any)._count?.Employee || 0,
      totalTasks: (admin as any)._count?.tasks || 0,
    }))

    return NextResponse.json(adminsWithStats)
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCompanySession()
    
    if (!session || (session as any).role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized: No session found. Please login." }, { status: 401 })
    }

    const companyId = (session as any).id

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = String(email).trim().toLowerCase()

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin record
    let admin
    try {
      admin = await prisma.admin.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          company: {
            connect: { id: companyId }
          },
        },
      })
    } catch (err: any) {
      // Handle unique constraint violation (race condition)
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return NextResponse.json(
          { error: "Admin with this email already exists" },
          { status: 409 }
        )
      }
      throw err
    }

    return NextResponse.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    )
  }
}

