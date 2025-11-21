 "use client"
 
 import { useEffect, useRef, useState } from "react"
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { Input } from "@/components/ui/input"
 import { Button } from "@/components/ui/button"
 import { Label } from "@/components/ui/label"
 import { useSearchParams } from "next/navigation"
 
 type ChatType = "personal" | "group" | "team" | "task"
 
 export default function EmployeeChatPage() {
   const params = useSearchParams()
   const [chatType, setChatType] = useState<ChatType>((params.get("type") as ChatType) || "personal")
   const [teamId, setTeamId] = useState<string>(params.get("teamId") || "")
   const [receiverId, setReceiverId] = useState<string>("")
   const [message, setMessage] = useState("")
   const [messages, setMessages] = useState<any[]>([])
   const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  const [adminContact, setAdminContact] = useState<any | null>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [taskId, setTaskId] = useState<string>("")
   const pollingRef = useRef<NodeJS.Timeout | null>(null)
 
   const fetchMessages = async () => {
     try {
       const qs = new URLSearchParams()
       qs.set("chatType", chatType)
       if (chatType === "team" && teamId) qs.set("teamId", teamId)
       if (chatType === "personal" && receiverId) qs.set("receiverId", receiverId)
 
       const res = await fetch(`/api/chat?${qs.toString()}`, { credentials: "include" })
       if (res.ok) {
         const data = await res.json()
         setMessages(data)
       }
     } catch {}
   }
 
   useEffect(() => {
     fetchMessages()
     if (pollingRef.current) clearInterval(pollingRef.current)
     pollingRef.current = setInterval(fetchMessages, 1000)
     return () => {
       if (pollingRef.current) clearInterval(pollingRef.current)
     }
   }, [chatType, teamId, receiverId])
 
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/chat/contacts", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setContacts(data.employees ?? [])
          setAdminContact(data.admin ?? null)
        }
      } catch (error) {
        console.error("Failed to load contacts", error)
      }
    }

    const fetchTeamsList = async () => {
      try {
        const res = await fetch("/api/employee/teams", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setTeams(data)
        }
      } catch (error) {
        console.error("Failed to load teams", error)
      }
    }
    const fetchTasksList = async () => {
      try {
        const res = await fetch("/api/tasks", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setTasks(data)
        }
      } catch (error) {
        console.error("Failed to load tasks", error)
      }
    }

    fetchContacts()
    fetchTeamsList()
    fetchTasksList()
  }, [])

  useEffect(() => {
    if (chatType !== "team") {
      setTeamId("")
    }
    if (chatType !== "personal") {
      setReceiverId("")
    }
  }, [chatType])

   const sendMessage = async (e: React.FormEvent) => {
     e.preventDefault()
    if (!message.trim()) return
    if (chatType === "personal" && !receiverId) return
    if (chatType === "team" && !teamId) return
    if (chatType === "task" && !taskId) return
     setLoading(true)
     try {
       const res = await fetch("/api/chat", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         credentials: "include",
         body: JSON.stringify({
           message,
           chatType,
           receiverId: chatType === "personal" ? receiverId || null : null,
           teamId: chatType === "team" ? teamId || null : null,
          taskId: chatType === "task" ? taskId || null : null,
         }),
       })
       if (res.ok) {
         setMessage("")
         fetchMessages()
       }
     } finally {
       setLoading(false)
     }
   }
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
       <div className="container py-8 px-4 sm:px-6 lg:px-8">
         <Card className="shadow-lg">
           <CardHeader>
             <CardTitle>Chat</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid md:grid-cols-3 gap-4">
               <div className="space-y-3">
                 <Label>Chat Type</Label>
                 <select
                   className="border rounded-md px-3 py-2"
                   value={chatType}
                   onChange={(e) => setChatType(e.target.value as ChatType)}
                 >
                   <option value="personal">Personal</option>
                   <option value="team">Team</option>
                   <option value="group">Group</option>
                   <option value="task">Task</option>
                 </select>
 
                 {chatType === "team" && (
                   <div>
                    <Label>Team</Label>
                    <select
                      className="border rounded-md px-3 py-2 w-full"
                      value={teamId}
                      onChange={(e) => setTeamId(e.target.value)}
                    >
                      <option value="">Select team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                   </div>
                 )}
                {chatType === "task" && (
                  <div>
                    <Label>Task</Label>
                    <select
                      className="border rounded-md px-3 py-2 w-full"
                      value={taskId}
                      onChange={(e) => setTaskId(e.target.value)}
                    >
                      <option value="">Select task</option>
                      {tasks.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                 {chatType === "personal" && (
                   <div>
                    <Label>Select Contact</Label>
                    <select
                      className="border rounded-md px-3 py-2 w-full"
                      value={receiverId}
                      onChange={(e) => setReceiverId(e.target.value)}
                    >
                      <option value="">Select person</option>
                      {adminContact && (
                        <option value={adminContact.id}>
                          {adminContact.name || adminContact.email} (Admin)
                        </option>
                      )}
                      {contacts.map((contact) => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name || contact.email} {contact.work_id ? `(${contact.work_id})` : ""}
                        </option>
                      ))}
                    </select>
                   </div>
                 )}
               </div>
 
               <div className="md:col-span-2 flex flex-col">
                 <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto border rounded-md p-3 bg-white">
                   {messages.length === 0 ? (
                     <div className="text-gray-500 text-sm">No messages.</div>
                   ) : (
                     <div className="space-y-2">
                       {messages.map((m: any) => (
                         <div key={m.id} className="text-sm">
                           <span className="font-semibold">{m.sender_type}</span>: {m.message}
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
                <form onSubmit={sendMessage} className="mt-3 flex gap-2">
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !message.trim() ||
                      (chatType === "personal" && !receiverId) ||
                      (chatType === "team" && !teamId) ||
                      (chatType === "task" && !taskId)
                    }
                  >
                    Send
                  </Button>
                </form>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   )
 }
 

