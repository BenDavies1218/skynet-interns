"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, FileUp, LinkIcon, Plus } from "lucide-react"
import { extractSkillsFromResume } from "@/lib/api-utils"
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../../../components/ui/alert-dialog"
import { AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"

export default function NewWorkerPage() {
  const router = useRouter()
  const [resumeText, setResumeText] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [workerName, setWorkerName] = useState("")
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const handleExtractSkills = async () => {
    if (!resumeText) return

    setLoading(true)
    try {
      const extractedSkills = await extractSkillsFromResume(resumeText)
      setSkills(extractedSkills)
    } catch (error) {
      console.error("Error extracting skills:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await fetch('http://localhost:3000/api/worker/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: resumeText })
    })
    
    if (response.ok) {
      const data = await response.json()
      setWorkerName(data.name)
      setSkills(data.skills)
      setShowDialog(true)
    }
  }

  const handleCancel = () => {
    router.push("/workers")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Add New Worker</h1>
          <p className="text-muted-foreground">Create a new worker profile with skills and experience</p>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-labrys-lightgray">
            <TabsTrigger value="manual" className="data-[state=active]:bg-labrys-green data-[state=active]:text-black">
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-labrys-green data-[state=active]:text-black">
              Resume Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-labrys-green data-[state=active]:text-black">
              Import from URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="pt-4 animate-fade-in">
            <form onSubmit={handleSubmit}>
              <Card className="border-labrys-lightgray bg-labrys-darkgray card-hover">
                <CardHeader>
                  <CardTitle className="text-labrys-green">Worker Information</CardTitle>
                  <CardDescription>Enter the worker's CV below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="department">CV</Label>
                    <Input
                      id="department"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your CV here..."
                      required
                      className="bg-labrys-black border-labrys-lightgray focus:border-labrys-green"
                    />
                  </div>
                
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-labrys-lightgray hover:border-labrys-green hover:bg-labrys-lightgray"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="gradient-bg hover:opacity-90 transition-opacity">
                      Save Worker
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>
          <TabsContent value="resume" className="pt-4 animate-fade-in">
            <Card className="border-labrys-lightgray bg-labrys-darkgray card-hover">
              <CardHeader>
                <CardTitle className="text-labrys-green">Upload Resume</CardTitle>
                <CardDescription>Upload a resume to automatically extract skills and experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-labrys-lightgray p-12 transition-all hover:border-labrys-green">
                  <div className="icon-container">
                    <FileUp className="h-8 w-8 text-muted-foreground mb-4 icon" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Drag and drop your resume here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, and TXT files up to 5MB</p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 border-labrys-lightgray hover:border-labrys-green hover:bg-labrys-lightgray"
                  >
                    Browse Files
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-labrys-lightgray hover:border-labrys-green hover:bg-labrys-lightgray"
                  >
                    Cancel
                  </Button>
                  <Button disabled className="gradient-bg opacity-50">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="url" className="pt-4 animate-fade-in">
            <Card className="border-labrys-lightgray bg-labrys-darkgray card-hover">
              <CardHeader>
                <CardTitle className="text-labrys-green">Import from URL</CardTitle>
                <CardDescription>Provide a URL to a LinkedIn profile or online resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="resume-url">Resume URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="resume-url"
                      placeholder="https://linkedin.com/in/username"
                      className="bg-labrys-black border-labrys-lightgray focus:border-labrys-green"
                    />
                    <Button
                      variant="outline"
                      className="border-labrys-lightgray hover:border-labrys-green hover:bg-labrys-lightgray"
                    >
                      <LinkIcon className="mr-2 h-4 w-4 icon" />
                      Fetch
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="resume-text">Resume Text</Label>
                  <Textarea
                    id="resume-text"
                    placeholder="Or paste the resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={10}
                    className="bg-labrys-black border-labrys-lightgray focus:border-labrys-green"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Label>Extracted Skills</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExtractSkills}
                      disabled={!resumeText || loading}
                      className="border-labrys-lightgray hover:border-labrys-green hover:bg-labrys-lightgray disabled:opacity-50"
                    >
                      {loading ? "Extracting..." : "Extract Skills"}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 border rounded-md min-h-20 border-labrys-lightgray bg-labrys-black">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="flex items-center gap-1 bg-labrys-lightgray hover:bg-labrys-green hover:text-black transition-colors"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 rounded-full hover:bg-black/20 p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {loading ? "Extracting skills..." : "No skills extracted yet"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-labrys-lightgray hover:border-labrys-green hover:bg-labrys-lightgray"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => router.push("/workers")}
                    className="gradient-bg hover:opacity-90 transition-opacity"
                  >
                    Save Worker
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Alert Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Worker Added Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              <p><strong>Name:</strong> {workerName}</p>
              <p><strong>Skills:</strong></p>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map(skill => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => router.push("/workers")}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  )
}

