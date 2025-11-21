import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { ArrowRight, LogIn, UserPlus, Sparkles, TrendingUp, Users, Zap, CheckCircle2, Star, Shield, BarChart3, Clock, FileText, Settings } from "lucide-react"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative container flex flex-col items-center justify-start gap-6 pt-20 pb-16 md:pb-20 min-h-[95vh] overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/40 via-gray-50/30 to-gray-100/20" />
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.2]"
          style={{
            backgroundImage: 'url(/bg.png)',
          }}
        />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000" />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40" />
        
        <div className="relative z-10 flex max-w-[980px] flex-col items-center gap-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600/15 via-cyan-600/15 to-purple-600/15 border border-blue-300/60 text-blue-700 text-sm font-semibold mb-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Modern Project Management
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-blue-700 via-cyan-600 to-purple-700 bg-clip-text text-transparent">
              Project Management
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          
          {/* Description */}
          <p className="max-w-[700px] text-xl text-gray-800 sm:text-2xl leading-relaxed font-light">
            TaskFlow helps teams organize work, track progress, and collaborate
            seamlessly. Built for modern teams who move fast.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-900">10K+ Teams</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-gray-900">99.9% Uptime</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/auth/login">
              <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 rounded-full group">
                <LogIn className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Login
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-2 border-gray-400 text-gray-800 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-700 transition-all duration-300 rounded-full backdrop-blur-sm bg-white/70 group">
                <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600/15 via-cyan-600/15 to-purple-600/15 border border-blue-300/60 text-blue-700 text-sm font-semibold mb-4 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Features
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Everything you need to manage projects
            </span>
          </h2>
          <p className="max-w-[700px] text-xl text-gray-700 font-light">
            Powerful features that help your team stay organized and productive
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <Card className="group border-gray-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm hover:border-blue-400 hover:bg-white/95 hover:backdrop-blur-xl hover:scale-[1.02] hover:rotate-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none z-0" />
            <CardHeader className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Kanban Boards</CardTitle>
              <CardDescription className="text-base text-gray-700 mt-2">
                Visualize your workflow with drag-and-drop boards that make project management intuitive
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="group border-gray-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm hover:border-green-400 hover:bg-white/95 hover:backdrop-blur-md">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Team Collaboration</CardTitle>
              <CardDescription className="text-base text-gray-700 mt-2">
                Work together in real-time with your team members and stay synchronized
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="group border-gray-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm hover:border-purple-400 hover:bg-white/95 hover:backdrop-blur-md">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Real-time Updates</CardTitle>
              <CardDescription className="text-base text-gray-700 mt-2">
                See changes instantly across all devices with our lightning-fast sync
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="group border-gray-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm hover:border-orange-400 hover:bg-white/95 hover:backdrop-blur-md">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">Secure & Private</CardTitle>
              <CardDescription className="text-base text-gray-700 mt-2">
                Enterprise-grade security with end-to-end encryption to keep your data safe
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="group border-gray-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm hover:border-indigo-400 hover:bg-white/95 hover:backdrop-blur-md">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Analytics & Reports</CardTitle>
              <CardDescription className="text-base text-gray-700 mt-2">
                Track progress with detailed analytics and generate comprehensive reports
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="group border-gray-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm hover:border-teal-400 hover:bg-white/95 hover:backdrop-blur-md">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Time Tracking</CardTitle>
              <CardDescription className="text-base text-gray-700 mt-2">
                Monitor time spent on tasks and projects with built-in time tracking tools
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* What is Project Management Section */}
      <section className="container py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900 mb-4">
              What is Project Management?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Understanding the fundamentals of effective project management
            </p>
          </div>

          {/* First Row - Image Left, Text Right */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto h-auto rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/pm1.png"
                  alt="Project Management Cycle"
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">The Project Management Cycle</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Project management follows a continuous cycle of four key phases: <strong className="text-blue-700">Design</strong>, 
                <strong className="text-blue-700"> Develop</strong>, <strong className="text-blue-700">Analyze</strong>, and 
                <strong className="text-blue-700"> Evaluate</strong>. This iterative process ensures that projects are 
                continuously improved and adapted to meet changing requirements.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Each phase builds upon the previous one, creating a feedback loop that drives innovation and ensures 
                project success. This cyclical approach allows teams to refine their strategies and deliver better 
                outcomes with each iteration.
              </p>
            </div>
          </div>

          {/* Second Row - Text Left, Image Right */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <h3 className="text-3xl font-bold text-gray-900">Project Management Processes</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Effective project management involves five core processes: <strong className="text-blue-700">Initiating</strong>, 
                <strong className="text-blue-700"> Planning</strong>, <strong className="text-blue-700">Executing</strong>, 
                <strong className="text-blue-700"> Monitoring and Controlling</strong>, and <strong className="text-blue-700">Closing</strong>.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                These processes form a comprehensive framework that guides projects from conception to completion. 
                Each process plays a crucial role in ensuring projects are delivered on time, within budget, and 
                meet all quality standards.
              </p>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Structured approach to project delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Clear milestones and deliverables</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Continuous monitoring and improvement</span>
                </li>
              </ul>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="relative w-full max-w-md mx-auto h-auto rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/pm2.png"
                  alt="Project Management Processes"
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <Card className="relative bg-blue-700 text-white border-0 shadow-2xl overflow-hidden group">
          <CardHeader className="text-center pb-4 relative z-10">
            <CardTitle className="text-4xl md:text-5xl font-bold mb-4">Ready to get started?</CardTitle>
            <CardDescription className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              Join thousands of teams already using TaskFlow to streamline their workflow and boost productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row justify-center gap-4 pt-6 relative z-10">
            <Link href="/auth/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto bg-white text-blue-700 hover:bg-gray-100 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group/btn font-semibold">
                <LogIn className="mr-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                Login Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-2 border-white/60 text-blue-700 hover:bg-white/25 hover:border-white rounded-full backdrop-blur-sm transition-all duration-300 group/btn font-semibold">
                <UserPlus className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

