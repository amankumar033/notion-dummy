import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: string
      companyId?: string
      adminId?: string
    }
  }

  interface User {
    id: string
    role?: string
    companyId?: string
    adminId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
    companyId?: string
    adminId?: string
  }
}

