"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kettlebellExercises } from "@/data/exercises";
import { ArrowLeft, Clock, Dumbbell, Home, Play, Target } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";

export default function ExercisePage() {
  const router = useRouter();
  const params = useParams();
  const exercise =
    kettlebellExercises[params.id as keyof typeof kettlebellExercises];

  if (!exercise) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={router.back}
              variant="ghost"
              size="sm"
              className="h-10 px-3 sm:px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Kettlebells</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        {/* Exercise Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-balance">
            {exercise.name}
          </h1>
          <div className="flex flex-wrap gap-2 justify-center">
            {exercise.muscles.map((muscle) => (
              <Badge key={muscle} variant="secondary" className="px-4 py-1.5">
                <Target className="w-3 h-3 mr-1" />
                {muscle}
              </Badge>
            ))}
          </div>
        </div>

        {/* Exercise Demo */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Exercise Demonstration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="aspect-video relative bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {exercise.video ? (
                <video
                  src={exercise.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-contain w-full h-full"
                  controls
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={exercise.animatedImage || exercise.image}
                  alt={`${exercise.name} demonstration`}
                  className="object-contain w-full h-full"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Equipment</h3>
              <p className="text-sm text-muted-foreground">Dumbbells</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Duration</h3>
              <p className="text-sm text-muted-foreground">3-5 minutes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Difficulty</h3>
              <p className="text-sm text-muted-foreground">Beginner</p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Step-by-Step Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-6">
              {exercise.steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Start with lighter weights to focus on proper form</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Keep your core engaged throughout the movement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Control the weight on both the lifting and lowering phases
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Breathe naturally - exhale on exertion, inhale on return
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/exercises/kettlebell">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exercise Library
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
