"use client"

import { useState } from "react"
import Link from "next/link"
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Card {
  id: string
  title: string
  description?: string | null
  listId: string
  order: number
  dueDate?: Date | null
  assignedTo?: {
    id: string
    name?: string | null
    email: string
  } | null
}

interface List {
  id: string
  title: string
  boardId: string
  order: number
  cards: Card[]
}

interface Board {
  id: string
  title: string
  description?: string | null
  lists: List[]
}

interface BoardViewProps {
  board: Board
}

function SortableCard({ card, boardId }: { card: Card; boardId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Link
        href={`/app/boards/${boardId}/card/${card.id}`}
        className="block"
        onClick={(e) => {
          // Prevent navigation when dragging
          if (isDragging) {
            e.preventDefault()
          }
        }}
      >
        <UICard className="mb-2 cursor-pointer hover:shadow-md transition-shadow" {...listeners}>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">{card.title}</CardTitle>
          </CardHeader>
        </UICard>
      </Link>
    </div>
  )
}

function SortableList({ list, boardId }: { list: List; boardId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: list.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="w-80 flex-shrink-0">
      <UICard>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{list.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {list.cards.map((card) => (
              <SortableCard key={card.id} card={card} boardId={list.boardId} />
            ))}
          </SortableContext>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full mt-2" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Card</DialogTitle>
              </DialogHeader>
              <CreateCardForm listId={list.id} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </UICard>
    </div>
  )
}

function CreateCardForm({ listId }: { listId: string }) {
  const [title, setTitle] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, listId }),
      })

      if (!response.ok) throw new Error("Failed to create card")

      toast({ title: "Success", description: "Card created successfully" })
      window.location.reload()
    } catch (error) {
      toast({ title: "Error", description: "Failed to create card", variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Button type="submit">Create Card</Button>
    </form>
  )
}

export function BoardView({ board: initialBoard }: BoardViewProps) {
  const [board, setBoard] = useState(initialBoard)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find the cards
    let activeCard: Card | undefined
    let activeListId: string | undefined
    let overListId: string | undefined

    for (const list of board.lists) {
      const card = list.cards.find((c) => c.id === activeId)
      if (card) {
        activeCard = card
        activeListId = list.id
        break
      }
      if (list.id === activeId) {
        // Dragging a list
        return
      }
    }

    // Check if dropping on a list
    for (const list of board.lists) {
      if (list.id === overId) {
        overListId = list.id
        break
      }
      const card = list.cards.find((c) => c.id === overId)
      if (card) {
        overListId = card.listId
        break
      }
    }

    if (!activeCard || !activeListId || !overListId) return

    // Update card position
    try {
      const response = await fetch(`/api/cards/${activeCard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId: overListId,
        }),
      })

      if (!response.ok) throw new Error("Failed to update card")

      // Update local state
      setBoard((prev) => {
        const newLists = prev.lists.map((list) => {
          if (list.id === activeListId) {
            return {
              ...list,
              cards: list.cards.filter((c) => c.id !== activeId),
            }
          }
          if (list.id === overListId) {
            return {
              ...list,
              cards: [...list.cards, { ...activeCard!, listId: overListId }],
            }
          }
          return list
        })
        return { ...prev, lists: newLists }
      })
    } catch (error) {
      console.error("Failed to update card:", error)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        {board.description && <p className="text-muted-foreground">{board.description}</p>}
      </div>
      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            <SortableContext items={board.lists.map((l) => l.id)}>
              {board.lists.map((list) => (
                <SortableList key={list.id} list={list} boardId={board.id} />
              ))}
            </SortableContext>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-fit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New List</DialogTitle>
                </DialogHeader>
                <CreateListForm boardId={board.id} />
              </DialogContent>
            </Dialog>
          </div>
          <DragOverlay>
            {activeId ? (
              <UICard>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Dragging...</CardTitle>
                </CardHeader>
              </UICard>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

function CreateListForm({ boardId }: { boardId: string }) {
  const [title, setTitle] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, boardId }),
      })

      if (!response.ok) throw new Error("Failed to create list")

      toast({ title: "Success", description: "List created successfully" })
      window.location.reload()
    } catch (error) {
      toast({ title: "Error", description: "Failed to create list", variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="List title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Button type="submit">Create List</Button>
    </form>
  )
}

