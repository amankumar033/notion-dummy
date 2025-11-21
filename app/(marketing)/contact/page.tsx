import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Footer } from "@/components/footer"
import { Mail, Send, Phone, MapPin } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 min-h-screen">
      <div className="container py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <Mail className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-700 via-cyan-600 to-purple-700 bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <p className="text-gray-700 text-xl max-w-2xl mx-auto">
              Have a question? We'd love to hear from you. Get in touch with our team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-gray-300/80 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-sm text-gray-600">support@taskflow.com</p>
              </CardContent>
            </Card>
            <Card className="border-gray-300/80 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-sm text-gray-600">+91 123 456 7890</p>
              </CardContent>
            </Card>
            <Card className="border-gray-300/80 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-sm text-gray-600">Mumbai, India</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-300/80 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Send us a message</CardTitle>
              <CardDescription className="text-gray-700 text-base">
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-900 font-semibold">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      required 
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900 font-semibold">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-900 font-semibold">Message</Label>
                  <textarea
                    id="message"
                    className="flex min-h-[140px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}

