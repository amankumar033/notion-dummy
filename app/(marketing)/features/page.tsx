import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LayoutDashboard,
  Users,
  Zap,
  Shield,
  FileText,
  MessageSquare,
  Calendar,
  Bell,
} from "lucide-react"

const features = [
  {
    title: "Kanban Boards",
    description: "Visualize your workflow with intuitive drag-and-drop boards",
    icon: LayoutDashboard,
  },
  {
    title: "Team Collaboration",
    description: "Work together in real-time with your team members",
    icon: Users,
  },
  {
    title: "Real-time Updates",
    description: "See changes instantly across all devices with WebSocket support",
    icon: Zap,
  },
  {
    title: "Secure Workspaces",
    description: "Multi-tenant architecture with role-based access control",
    icon: Shield,
  },
  {
    title: "File Attachments",
    description: "Attach files to cards and keep everything organized",
    icon: FileText,
  },
  {
    title: "Comments & Discussions",
    description: "Communicate directly on tasks with threaded comments",
    icon: MessageSquare,
  },
  {
    title: "Due Dates & Reminders",
    description: "Set due dates and get notified about upcoming deadlines",
    icon: Calendar,
  },
  {
    title: "Activity Feed",
    description: "Track all team activity in one centralized location",
    icon: Bell,
  },
]

export const dynamic = 'force-dynamic'

export default function FeaturesPage() {
  return (
    <div className="container py-20">
      <div className="flex flex-col items-center gap-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Powerful Features
        </h1>
        <p className="max-w-[700px] text-muted-foreground text-lg">
          Everything you need to manage projects efficiently
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

