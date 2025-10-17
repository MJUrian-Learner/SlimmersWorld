"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Play, Users } from "lucide-react";
import { abRollerExercises } from "@/data/exercises";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ExercisesPage() {
  const router = useRouter();

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
              <span className="hidden sm:inline">Back to Exercises</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  Ab Roller
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Core strengthening workouts
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Master Your Ab Workouts
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Build strength with our comprehensive guide to ab exercises. Each
            exercise includes detailed instructions, proper form guidance, and
            targeted muscle groups.
          </p>
        </div>

        {/* Ab Roller Wheel Information Section */}
        <section className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
          <Card className="mx-auto max-w-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="flex relative items-center justify-center w-full h-full">
                  <Image
                    fill
                    src="/images/ab-roller-wheel.jpg"
                    alt="Ab Roller Wheel"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">
                    AB ROLLER WHEEL
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 text-pretty leading-relaxed">
                    An ab roller, also known as an ab wheel, is a fitness tool
                    designed to engage core muscles, particularly the abs,
                    obliques, and lower back, during exercises like rollouts. It
                    typically consists of a wheel with handles, allowing you to
                    roll forward and backward to strengthen your core.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      Where are Ab Roller Wheel used?
                    </h4>
                    <p className="text-sm text-muted-foreground text-pretty">
                      An ab roller, or rollout wheel, is primarily used to
                      strengthen and build core muscles, particularly the abs,
                      lower back, and obliques. It also engages other muscle
                      groups like the glutes, lats, and triceps. By rolling out
                      and back, you challenge your core to stabilize and
                      maintain a neutral spine, which can help improve overall
                      core strength and endurance. 
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Exercise Library Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
            Exercise Library
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(abRollerExercises).map(([id, exercise]) => (
              <Card
                key={id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                <CardHeader className="pb-3 flex-shrink-0 px-4 sm:px-6">
                  <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-4">
                    {exercise.video ? (
                      <video
                        src={exercise.video}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={exercise.animatedImage || exercise.image}
                        alt={exercise.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg line-clamp-2 min-h-[3rem] flex items-center">
                    {exercise.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col flex-grow px-4 sm:px-6">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {exercise.muscles.map((muscle) => (
                      <Badge
                        key={muscle}
                        variant="secondary"
                        className="text-xs px-2 py-1"
                      >
                        {muscle}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        {exercise.steps.length} steps
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link href={`/exercises/ab-roller-wheel/${id}`}>
                      <Button className="w-full h-10" size="sm">
                        View Exercise
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {Object.keys(abRollerExercises).length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No exercises available
            </h3>
            <p className="text-muted-foreground">
              Check back later for new exercises to be added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
