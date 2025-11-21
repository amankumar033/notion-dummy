 "use client"
 
 import { useEffect, useState } from "react"
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
 import Link from "next/link"
 
 export default function EmployeeTeamsPage() {
   const [teams, setTeams] = useState<any[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
 
  const fetchTeams = async () => {
     try {
       setLoading(true)
      const res = await fetch("/api/employee/teams", { credentials: "include" })
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
   }, [])
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
       <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
         <h1 className="text-4xl font-bold text-gray-800">My Teams</h1>
         {loading ? (
           <div className="flex items-center justify-center py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
         ) : teams.length === 0 ? (
           <Card>
             <CardContent className="pt-6">No teams found.</CardContent>
           </Card>
         ) : (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {teams.map((team) => (
               <Card key={team.id} className="shadow">
                 <CardHeader>
                   <CardTitle>{team.name}</CardTitle>
                   <CardDescription>{team.description}</CardDescription>
                 </CardHeader>
                 <CardContent>
                  {team.members && team.members.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {team.members.map((member: any) => {
                        const name = member.employee?.name || member.admin?.name
                        const email = member.employee?.email || member.admin?.email
                        return (
                          <div key={member.id} className="rounded bg-gray-50 px-3 py-2 text-sm">
                            <p className="font-medium text-gray-800">{name || "Member"}</p>
                            {email && <p className="text-xs text-gray-500">{email}</p>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                   <Link href={`/app/employee/chat?type=team&teamId=${team.id}`} className="text-blue-600 hover:underline">
                     Open Team Chat
                   </Link>
                 </CardContent>
               </Card>
             ))}
           </div>
         )}
         {error && <div className="text-red-600">{error}</div>}
       </div>
     </div>
   )
 }
 

