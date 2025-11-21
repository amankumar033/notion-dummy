import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, MessageCircle, LogIn } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-300/50 bg-white/90 px-4 shadow-md backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 sm:px-6 lg:px-10">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 z-10 group">
          <div className="relative">
            <LayoutDashboard className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">TaskFlow</span>
        </Link>
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-1 bg-gray-100/90 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-300/60">
          <Link href="/">
            <Button variant="ghost" className="text-gray-800 hover:text-blue-700 hover:bg-blue-100/60 rounded-full transition-all duration-200 font-medium">
              Home
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" className="text-gray-800 hover:text-blue-700 hover:bg-blue-100/60 rounded-full transition-all duration-200 font-medium">
              Pricing
            </Button>
          </Link>
          <Link href="/faq">
            <Button variant="ghost" className="text-gray-800 hover:text-blue-700 hover:bg-blue-100/60 rounded-full transition-all duration-200 font-medium">
              FAQ
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="text-gray-800 hover:text-blue-700 hover:bg-blue-100/60 rounded-full transition-all duration-200 font-medium">
              Contact
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-4 z-10">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-gray-800 hover:text-blue-700 hover:bg-blue-100/60 flex items-center gap-2 rounded-full transition-all duration-200 font-medium">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white border-0 rounded-full px-5 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
              Request Demo
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

