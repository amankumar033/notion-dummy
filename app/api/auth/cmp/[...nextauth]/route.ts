import NextAuth from "next-auth"
import { companyAuthOptions } from "@/lib/auth-company"

const handler = NextAuth(companyAuthOptions)

export { handler as GET, handler as POST }


