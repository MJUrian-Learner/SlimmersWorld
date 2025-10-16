"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Dumbbell,
  Play,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";
import { dumbbellExercises, kettlebellExercises } from "@/data/exercises";
import Image from "next/image";

export default function ExercisesOverviewPage() {
  // Calculate total exercises
  const totalExercises =
    Object.keys(dumbbellExercises).length +
    Object.keys(kettlebellExercises).length;

  // Get featured exercises from each category
  const featuredDumbbellExercises = Object.entries(dumbbellExercises).slice(
    0,
    3
  );
  const featuredKettlebellExercises = Object.entries(kettlebellExercises).slice(
    0,
    2
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Exercise Library</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Complete Exercise Library
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Discover our comprehensive collection of exercises designed to help
            you achieve your fitness goals. From strength training to core
            workouts, we've got you covered.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {totalExercises} Total Exercises
              </span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                3 Equipment Categories
              </span>
            </div>
          </div>
        </div>

        {/* Equipment Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            Browse by Equipment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dumbbells Category */}
            <Link href="/exercises/dumbbells">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-4">
                    <Image
                      fill
                      src="/images/dumbbell.jpg"
                      alt="Dumbbells"
                      className="object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                    />
                  </div>
                  <CardTitle className="text-xl text-center">
                    Dumbbells
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Build strength with versatile dumbbell exercises targeting
                    all major muscle groups.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {Object.keys(dumbbellExercises).length} exercises
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      All levels
                    </span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Explore Dumbbell Exercises
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Kettlebells Category */}
            <Link href="/exercises/kettlebell">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-4">
                    <Image
                      fill
                      src="/images/kettlebell.png"
                      alt="Kettlebell"
                      className="object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                    />
                  </div>
                  <CardTitle className="text-xl text-center">
                    Kettlebells
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Dynamic workouts combining cardio and strength training for
                    functional fitness.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {Object.keys(kettlebellExercises).length} exercises
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      All levels
                    </span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Explore Kettlebell Exercises
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Ab Roller Wheel Category */}
            <Link href="/exercises/ab-roller-wheel">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                      <Target className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center">
                    Ab Roller Wheel
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Intensive core workouts to strengthen abs, obliques, and
                    stabilizer muscles.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary" className="text-xs">
                      Core focused
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Beginner+
                    </span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Explore Core Exercises
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Featured Exercises Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            Featured Exercises
          </h2>

          {/* Dumbbell Exercises Preview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Popular Dumbbell Exercises
              </h3>
              <Link href="/exercises/dumbbells">
                <Button variant="ghost" size="sm">
                  View All <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredDumbbellExercises.map(([id, exercise]) => (
                <Card
                  key={id}
                  className="group hover:shadow-md transition-all duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-3">
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
                        <div className="bg-white/90 rounded-full p-2">
                          <Play className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2 min-h-[2.5rem] flex items-center">
                      {exercise.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Users className="h-3 w-3" />
                      <span>{exercise.steps.length} steps</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {exercise.muscles.slice(0, 2).map((muscle) => (
                        <Badge
                          key={muscle}
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.muscles.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          +{exercise.muscles.length - 2}
                        </Badge>
                      )}
                    </div>
                    <Link href={`/exercises/dumbbells/${id}`}>
                      <Button size="sm" className="w-full text-xs">
                        View Exercise
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Kettlebell Exercises Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Popular Kettlebell Exercises
              </h3>
              <Link href="/exercises/kettlebell">
                <Button variant="ghost" size="sm">
                  View All <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredKettlebellExercises.map(([id, exercise]) => (
                <Card
                  key={id}
                  className="group hover:shadow-md transition-all duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-3">
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
                        <div className="bg-white/90 rounded-full p-2">
                          <Play className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2 min-h-[2.5rem] flex items-center">
                      {exercise.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Users className="h-3 w-3" />
                      <span>{exercise.steps.length} steps</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {exercise.muscles.slice(0, 3).map((muscle) => (
                        <Badge
                          key={muscle}
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.muscles.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          +{exercise.muscles.length - 3}
                        </Badge>
                      )}
                    </div>
                    <Link href={`/exercises/kettlebell/${id}`}>
                      <Button size="sm" className="w-full text-xs">
                        View Exercise
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-primary/5 rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-3">
            Ready to Start Your Workout?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Choose your equipment and start building strength with our guided
            exercise routines.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/exercises/dumbbells">
              <Button size="lg">
                <Dumbbell className="mr-2 h-5 w-5" />
                Start with Dumbbells
              </Button>
            </Link>
            <Link href="/exercises/kettlebell">
              <Button variant="outline" size="lg">
                <Target className="mr-2 h-5 w-5" />
                Try Kettlebells
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
