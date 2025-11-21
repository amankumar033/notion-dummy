import { NextResponse } from "next/server"
import { getAnySession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const sessionData = await getAnySession()
    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = sessionData.session
    const role = (session as any).role
    const id = (session as any).id

    // Check Company
    if (role === "COMPANY") {
      const company = await prisma.company.findUnique({
        where: { id },
      })
      if (company) {
        return NextResponse.json({
          name: company.name,
          email: company.email,
          image: null,
          role: "COMPANY",
          id: company.id,
        })
      }
    }

    // Check Admin
    if (role === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { id },
        include: { company: true },
      })
      if (admin) {
        return NextResponse.json({
          name: admin.name,
          email: admin.email,
          image: null,
          role: "ADMIN",
          companyId: admin.company_id,
          id: admin.id,
        })
      }
    }

    // Check Employee
    if (role === "EMPLOYEE") {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: { company: true, admin: true },
      })
      if (employee) {
        return NextResponse.json({
          name: employee.name,
          email: employee.email,
          image: null,
          role: "EMPLOYEE",
          companyId: employee.company_id,
          adminId: employee.admin_id,
          id: employee.id,
        })
      }
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 })
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
    const sessionData = await getAnySession()
    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = sessionData.session
    const role = (session as any).role
    const id = (session as any).id
    const { name, email } = await req.json()

    // Check Company
    if (role === "COMPANY") {
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
    }

    // Check Admin
    if (role === "ADMIN") {
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
    }

    // Check Employee
    if (role === "EMPLOYEE") {
      const employee = await prisma.employee.findUnique({
        where: { id },
      })
      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 })
      }

      const updatedEmployee = await prisma.employee.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
        },
      })

      return NextResponse.json({
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        role: "EMPLOYEE",
      })
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
