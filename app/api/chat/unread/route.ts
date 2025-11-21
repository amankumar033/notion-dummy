import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = session.user.id
    const companyId = (session.user as any).companyId

    if (!companyId) {
      return NextResponse.json({ count: 0 })
    }

    // Count unread messages where user is receiver or in team/task chats
    const unreadCount = await prisma.chat.count({
      where: {
        company_id: companyId,
        is_read: false,
        OR: [
          { receiver_id: id },
          { chat_type: { in: ["team", "task", "group"] } },
        ],
        NOT: {
          sender_id: id, // Don't count own messages
        },
      },
    })

    return NextResponse.json({ count: unreadCount })
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return NextResponse.json({ count: 0 })
  }
}



