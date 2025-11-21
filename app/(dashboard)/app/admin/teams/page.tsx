 "use client"
 
 import { useEffect, useState } from "react"
 import Link from "next/link"
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
 import { Button } from "@/components/ui/button"
 import { Input } from "@/components/ui/input"
 import { Label } from "@/components/ui/label"
import { Users2, Plus, UserCheck } from "lucide-react"
 
 export default function AdminTeamsPage() {
   const [teams, setTeams] = useState<any[]>([])
   const [loading, setLoading] = useState(true)
   const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", employeeIds: [] as string[] })
  const [employees, setEmployees] = useState<any[]>([])
   const [error, setError] = useState<string | null>(null)
 
   const fetchTeams = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/teams", {
        credentials: "include",
      })
       if (res.ok) {
         const data = await res.json()
         setTeams(data)
         setError(null)
       } else {
         setError("Failed to load teams")
       }
     } catch {
       setError("Failed to load teams")
     } finally {
       setLoading(false)
     }
   }
 
   useEffect(() => {
     fetchTeams()
    fetchEmployees()
   }, [])
 
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/admin/employees", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setEmployees(data)
      }
    } catch (err) {
      console.error("Failed to load employees", err)
    }
  }

   const handleCreate = async (e: React.FormEvent) => {
     e.preventDefault()
    try {
      const res = await fetch("/api/admin/teams", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          employeeIds: form.employeeIds,
          includeAdmin: true,
        }),
       })
       if (res.ok) {
        setForm({ name: "", description: "", employeeIds: [] })
         setShowCreate(false)
         fetchTeams()
       } else {
         const data = await res.json()
         setError(data.error || "Failed to create team")
       }
     } catch {
       setError("Failed to create team")
     }
   }
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
       <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-3">
               Teams
             </h1>
             <p className="text-gray-600 text-xl font-medium">Create and manage company teams</p>
           </div>
           <Button
             onClick={() => setShowCreate(!showCreate)}
             className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-full px-6 py-6"
           >
             <Plus className="mr-2 h-5 w-5" />
             {showCreate ? "Cancel" : "New Team"}
           </Button>
         </div>
 
         {showCreate && (
           <Card>
             <CardHeader>
               <CardTitle>Create Team</CardTitle>
               <CardDescription>Add a new team</CardDescription>
             </CardHeader>
             <CardContent>
               <form onSubmit={handleCreate} className="space-y-4">
                 <div>
                   <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                 </div>
                 <div>
                   <Label htmlFor="description">Description</Label>
                  <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <Label>Select Employees</Label>
                  <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200">
                    {employees.length === 0 ? (
                      <p className="p-3 text-sm text-gray-500">No employees available. Add employees first.</p>
                    ) : (
                      employees.map((employee) => {
                        const checked = form.employeeIds.includes(employee.id)
                        return (
                          <label
                            key={employee.id}
                            className="flex items-center justify-between px-4 py-2 border-b border-gray-100 last:border-none"
                          >
                            <div>
                              <p className="font-medium text-sm text-gray-800">{employee.name || employee.email}</p>
                              <p className="text-xs text-gray-500">
                                {employee.email}
                                {employee.workId ? ` · Work ID: ${employee.workId}` : ""}
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setForm((prev) => ({
                                  ...prev,
                                  employeeIds: e.target.checked
                                    ? [...prev.employeeIds, employee.id]
                                    : prev.employeeIds.filter((id) => id !== employee.id),
                                }))
                              }}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                          </label>
                        )
                      })
                    )}
                  </div>
                 </div>
                 <Button type="submit">Create</Button>
               </form>
             </CardContent>
           </Card>
         )}
 
         {loading ? (
           <div className="flex items-center justify-center py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
         ) : teams.length === 0 ? (
           <Card>
             <CardContent className="pt-6">No teams yet. Create your first team.</CardContent>
           </Card>
         ) : (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {teams.map((team) => (
               <Card key={team.id} className="shadow-lg">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Users2 className="h-5 w-5" />
                     {team.name}
                   </CardTitle>
                   <CardDescription>{team.description}</CardDescription>
                 </CardHeader>
                 <CardContent>
                  <div className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Members: {team._count?.members ?? team.members?.length ?? 0}
                  </div>
                  {team.members && team.members.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {team.members.map((member: any) => {
                        const memberName = member.employee?.name || member.admin?.name || "Unknown"
                        const memberEmail = member.employee?.email || member.admin?.email
                        return (
                          <div key={member.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                            <p className="font-medium text-gray-800">{memberName}</p>
                            {memberEmail && <p className="text-xs text-gray-500">{memberEmail}</p>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                   <div className="mt-4 flex gap-3">
                     <Link href={`/app/admin/teams/${team.id}`}>
                       <Button variant="outline" size="sm" className="w-full">
                         Edit
                       </Button>
                     </Link>
                     <Link href={`/app/admin/chat?type=team&teamId=${team.id}`} className="flex-1">
                       <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700">
                         Chat
                       </Button>
                     </Link>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         )}
 
         {error && (
           <Card className="border-red-200 bg-red-50">
             <CardContent className="pt-6">
               <p className="text-red-700">{error}</p>
             </CardContent>
           </Card>
         )}
       </div>
     </div>
   )
 }
 

