import { Card, CardContent } from "@/components/ui/card"
import { Activity as ActivityIcon } from "lucide-react"

export default async function ActivityPage() {
  // Activity feature temporarily disabled - will be reimplemented with new schema
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <ActivityIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Activity</h1>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Activity feature coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
