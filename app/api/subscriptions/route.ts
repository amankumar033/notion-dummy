import { NextResponse } from "next/server"

export async function GET(req: Request) {
  // Return free plan in demo mode
  return NextResponse.json({ plan: "FREE", status: "FREE" })
}

export async function POST(req: Request) {
  // Return free plan in demo mode
  return NextResponse.json({ 
    plan: "FREE", 
    status: "FREE",
    message: "Demo mode - subscriptions disabled" 
  })
}

