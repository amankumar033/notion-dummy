import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Check } from "lucide-react"
import { PLANS } from "@/lib/stripe"

export const dynamic = 'force-dynamic'

export default function PricingPage() {
  // Convert USD to INR (approximate rate: 1 USD = 83 INR)
  const convertToRupee = (usd: number) => Math.round(usd * 83)
  
  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 min-h-screen">
      <div className="container py-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-700 via-cyan-600 to-purple-700 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="max-w-[700px] text-gray-700 text-xl leading-relaxed">
            Choose the plan that works best for your team. All plans support cash payment.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {Object.entries(PLANS).map(([key, plan]) => {
            const rupeePrice = convertToRupee(plan.price)
            return (
              <Card 
                key={key} 
                className={`group relative border-gray-300/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 bg-white/95 backdrop-blur-sm overflow-hidden ${
                  key === "PRO" 
                    ? "border-blue-500 border-2 hover:border-blue-600 scale-105 ring-4 ring-blue-500/20" 
                    : "hover:border-blue-400"
                }`}
              >
                {key === "PRO" && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-700 to-cyan-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-gray-900">₹{rupeePrice}</span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 text-lg">/month</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/app/dashboard" className="block w-full">
                    <Button
                      className={`w-full rounded-full h-12 text-base font-semibold transition-all duration-300 ${
                        key === "PRO" 
                          ? "bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl" 
                          : "border-2 border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-700"
                      }`}
                      variant={key === "PRO" ? "default" : "outline"}
                    >
                      {plan.price === 0 ? "Get Started Free" : "Get Started"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}

