import NextAuth from "next-auth"
import { employeeAuthOptions } from "@/lib/auth-employee"

const handler = NextAuth(employeeAuthOptions)

export { handler as GET, handler as POST }


