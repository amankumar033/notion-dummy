import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { adminAuthOptions } from "@/lib/auth-admin"
import { employeeAuthOptions } from "@/lib/auth-employee"
import { companyAuthOptions } from "@/lib/auth-company"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const tryGetSession = async () => {
      return (
        (await getServerSession(authOptions)) ||
        (await getServerSession(adminAuthOptions)) ||
        (await getServerSession(employeeAuthOptions)) ||
        (await getServerSession(companyAuthOptions))
      )
    }
    const session = await tryGetSession()
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    const id = session.user.id
    const companyId = (session.user as any).companyId

    if (!companyId) {
      return NextResponse.json({ error: "Company ID not found" }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const chatType = searchParams.get("chatType") || "all"
    const teamId = searchParams.get("teamId")
    const taskId = searchParams.get("taskId")
    const receiverId = searchParams.get("receiverId")

    const where: any = {
      company_id: companyId,
    }

    // Security: Ensure user can only see chats they're part of
    if (chatType === "personal") {
      where.chat_type = "personal"
      where.OR = [
        { sender_id: id },
        { receiver_id: id },
      ]
      if (receiverId) {
        where.AND = [
          {
            OR: [
              { sender_id: id, receiver_id: receiverId },
              { sender_id: receiverId, receiver_id: id },
            ],
          },
        ]
      }
    } else if (chatType === "team") {
      where.chat_type = "team"
      if (teamId) {
        where.team_id = teamId
      }
    } else if (chatType === "task") {
      where.chat_type = "task"
      if (taskId) {
        where.task_id = taskId
      }
    } else if (chatType === "group") {
      where.chat_type = "group"
    }

    const chats = await prisma.chat.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: 100, // Limit to last 100 messages
    })

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const tryGetSession = async () => {
      return (
        (await getServerSession(authOptions)) ||
        (await getServerSession(adminAuthOptions)) ||
        (await getServerSession(employeeAuthOptions)) ||
        (await getServerSession(companyAuthOptions))
      )
    }
    const session = await tryGetSession()
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    const id = session.user.id
    const companyId = (session.user as any).companyId

    if (!companyId) {
      return NextResponse.json({ error: "Company ID not found" }, { status: 400 })
    }

    const { message, chatType, receiverId, teamId, taskId } = await req.json()

    if (!message || !chatType) {
      return NextResponse.json(
        { error: "Message and chat type are required" },
        { status: 400 }
      )
    }

    // Security: Verify user has access to the chat
    if (chatType === "personal" && receiverId) {
      // Support admin<->admin and admin/employee combinations
      const [adminReceiver, employeeReceiver] = await Promise.all([
        prisma.admin.findUnique({ where: { id: receiverId } }),
        prisma.employee.findUnique({ where: { id: receiverId } }),
      ])
      const receiver = adminReceiver || employeeReceiver
      if (!receiver || (receiver as any).company_id !== companyId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    } else if (chatType === "team" && teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: true },
      })
      if (!team || team.company_id !== companyId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    } else if (chatType === "task" && taskId) {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })
      if (!task || task.company_id !== companyId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    const chat = await prisma.chat.create({
      data: {
        message,
        chat_type: chatType,
        company_id: companyId,
        sender_id: id,
        sender_type: role.toLowerCase(),
        receiver_id: receiverId || null,
        receiver_type: receiverId
          ? (await prisma.admin.findUnique({ where: { id: receiverId } })) ? "admin"
            : (await prisma.employee.findUnique({ where: { id: receiverId } })) ? "employee"
            : null
          : null,
        team_id: teamId || null,
        task_id: taskId || null,
      },
    })

    return NextResponse.json(chat, { status: 201 })
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
