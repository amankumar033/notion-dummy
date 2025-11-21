"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Calendar, User, MessageSquare, Paperclip, Send } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name?: string | null
    email: string
  }
}

interface File {
  id: string
  url: string
  name: string
  size: number
  type: string
  uploadedBy: {
    id: string
    name?: string | null
    email: string
  }
}

interface CardDetail {
  id: string
  title: string
  description?: string | null
  dueDate?: Date | null
  assignedTo?: {
    id: string
    name?: string | null
    email: string
  } | null
  comments: Comment[]
  files: File[]
}

interface CardDetailViewProps {
  card: CardDetail
  boardId: string
}

export function CardDetailView({ card: initialCard, boardId }: CardDetailViewProps) {
  const [card, setCard] = useState(initialCard)
  const [description, setDescription] = useState(card.description || "")
  const [comment, setComment] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSaveDescription = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) throw new Error("Failed to update description")

      toast({ title: "Success", description: "Description updated" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to update description", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment, cardId: card.id, userId: null }),
      })

      if (!response.ok) throw new Error("Failed to add comment")

      const newComment = await response.json()
      setCard((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }))
      setComment("")
      toast({ title: "Success", description: "Comment added" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to add comment", variant: "destructive" })
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Link href={`/app/boards/${boardId}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Board
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{card.title}</CardTitle>
          <div className="flex gap-4 mt-4">
            {card.dueDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Due: {formatDate(card.dueDate)}
              </div>
            )}
            {card.assignedTo && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {card.assignedTo.name || card.assignedTo.email}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="mt-2 flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
            />
            <Button onClick={handleSaveDescription} className="mt-2" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments
            </h3>
            <div className="space-y-4 mb-4">
              {card.comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{comment.user.name || comment.user.email}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Attachments
            </h3>
            {card.files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attachments</p>
            ) : (
              <div className="space-y-2">
                {card.files.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border rounded hover:bg-accent"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

