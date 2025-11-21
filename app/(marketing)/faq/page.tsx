import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { HelpCircle, ChevronDown } from "lucide-react"

export const dynamic = 'force-dynamic'

const faqs = [
  {
    question: "What is TaskFlow?",
    answer: "TaskFlow is a modern project management tool that helps teams organize work, track progress, and collaborate seamlessly with Kanban boards and real-time updates."
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up for a free account and you can start creating boards and managing your projects immediately. No credit card required."
  },
  {
    question: "Can I use TaskFlow for free?",
    answer: "Yes! We offer a free plan that includes basic features. You can upgrade to our PRO plan for advanced features and more storage."
  },
  {
    question: "How does team collaboration work?",
    answer: "TaskFlow supports real-time collaboration. Multiple team members can work on the same board simultaneously, and changes are synced instantly across all devices."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption and security practices to protect your data. All workspaces are isolated with role-based access control."
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export your boards and data at any time. Contact support if you need assistance with data export."
  }
]

export default function FAQPage() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 min-h-screen">
      <div className="container py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <HelpCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-700 via-cyan-600 to-purple-700 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-700 text-xl max-w-2xl mx-auto">
              Find answers to common questions about TaskFlow
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="group border-gray-300/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/95 backdrop-blur-sm hover:border-blue-400 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors pr-8">
                      {faq.question}
                    </CardTitle>
                    <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

