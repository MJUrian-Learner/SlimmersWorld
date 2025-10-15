"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SlimmersLogo } from "@/components/slimmers-logo"
import { ArrowLeft, Circle, Play, Pause, RotateCcw, Clock, Users, Target } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AbRollerPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const router = useRouter()

  const exercises = [
    {
      name: "Ab Rollout",
      description: "Roll the ab wheel forward while maintaining core stability",
      sets: "3-4 sets",
      reps: "8-12 reps",
      rest: "60-90 seconds",
      difficulty: "Intermediate",
      targetMuscles: ["Abs", "Core", "Shoulders", "Back"],
      instructions: [
        "Start on knees, hold ab wheel at chest level",
        "Engage core and roll forward slowly",
        "Extend arms as far as comfortable",
        "Hold position briefly",
        "Roll back to starting position"
      ]
    },
    {
      name: "Standing Rollout",
      description: "Advanced standing ab wheel exercise",
      sets: "2-3 sets",
      reps: "5-8 reps",
      rest: "90-120 seconds",
      difficulty: "Advanced",
      targetMuscles: ["Abs", "Core", "Shoulders", "Glutes"],
      instructions: [
        "Stand with feet hip-width apart",
        "Hold ab wheel at waist level",
        "Hinge at hips and roll forward",
        "Keep core tight and spine neutral",
        "Roll back to standing position"
      ]
    },
    {
      name: "Knee Tucks",
      description: "Bring knees to chest while holding ab wheel",
      sets: "3-4 sets",
      reps: "10-15 reps",
      rest: "60-90 seconds",
      difficulty: "Beginner",
      targetMuscles: ["Lower Abs", "Hip Flexors", "Core"],
      instructions: [
        "Start in plank position with ab wheel under feet",
        "Keep hands on floor, core engaged",
        "Bring knees toward chest",
        "Extend legs back to plank position",
        "Maintain straight back throughout"
      ]
    }
  ]

  const nextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % exercises.length)
  }

  const prevExercise = () => {
    setCurrentExercise((prev) => (prev - 1 + exercises.length) % exercises.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-md mx-auto flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 p-2 text-primary-foreground hover:bg-primary-foreground/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SlimmersLogo />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Equipment Header */}
        <Card className="bg-card border-border">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Circle className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Ab Roller</CardTitle>
            <p className="text-muted-foreground">Intensive core strengthening equipment</p>
          </CardHeader>
        </Card>

        {/* Exercise Navigation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">
                Exercise {currentExercise + 1} of {exercises.length}
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={prevExercise}>
                  ←
                </Button>
                <Button variant="outline" size="sm" onClick={nextExercise}>
                  →
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {exercises[currentExercise].name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {exercises[currentExercise].description}
              </p>
              
              {/* Demo Video Placeholder */}
              <div className="relative aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Play className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Demo Video</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>

              {/* Exercise Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium text-foreground">{exercises[currentExercise].sets}</p>
                  <p className="text-xs text-muted-foreground">Sets</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <RotateCcw className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium text-foreground">{exercises[currentExercise].reps}</p>
                  <p className="text-xs text-muted-foreground">Reps</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium text-foreground">{exercises[currentExercise].rest}</p>
                  <p className="text-xs text-muted-foreground">Rest</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium text-foreground">{exercises[currentExercise].difficulty}</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
              </div>

              {/* Target Muscles */}
              <div className="mb-4">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  <h4 className="font-semibold text-foreground">Target Muscles</h4>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {exercises[currentExercise].targetMuscles.map((muscle, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-center">Instructions</h4>
                <ol className="space-y-2">
                  {exercises[currentExercise].instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="space-y-3">
          <Button onClick={nextExercise} className="w-full bg-primary hover:bg-primary/90">
            Next Exercise
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

