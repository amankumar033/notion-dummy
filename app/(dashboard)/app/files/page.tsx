import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default async function FilesPage() {
  // Files feature - will be updated to use new schema
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Files</h1>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Files feature coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
