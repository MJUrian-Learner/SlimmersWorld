export interface ExerciseStep {
  number: number;
  title: string;
  description: string;
}

export interface Exercise {
  name: string;
  image: string;
  video?: string;
  animatedImage?: string;
  muscles: string[];
  steps: ExerciseStep[];
}

export const dumbbellExercises: Record<string, Exercise> = {
  "lateral-raises": {
    name: "Lateral Raises",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yqhtXJEFZOP8JaKd961D8DojtVrOAJ.png",
    video:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supawork-3570a202f6f34743bf6795a5a035ffc7-k00S5o7sTDGilqn46eY4RUvhV6KTlL.mp4",
    animatedImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lateral-WfEv4ZltH83n8zYKa3syZVai6Casov.gif",
    muscles: ["Shoulders", "Deltoids", "Upper Back"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Stand with feet shoulder-width apart, holding a dumbbell in each hand, palms facing your body.",
      },
      {
        number: 2,
        title: "Engage Core",
        description: "Engage your core muscles and maintain good posture.",
      },
      {
        number: 3,
        title: "Raise Dumbbells",
        description:
          "Slowly raise the dumbbells out to the sides, keeping your elbows slightly bent and your arms almost straight.",
      },
      {
        number: 4,
        title: "Repeat",
        description: "Repeat for the desired number of repetitions.",
      },
    ],
  },
  "bicep-curl": {
    name: "Dumbbell Bicep Curl",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KCjZ75UMjHnOuXGT9FgPk5zM61PBKv.png",
    video:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supawork-e172b60f8a204f83ac827dec83e21afa-bluaquEFQHO30B4AqTVjHfTkGbKzhE.mp4",
    animatedImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dumbbellbicepcurls-1Hobx2anLiZ3pDMpnvKTaFa91lzErR.gif",
    muscles: ["Biceps", "Forearms"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Stand with your feet shoulder-width apart and hold a dumbbell in each hand with your palms facing forward.",
      },
      {
        number: 2,
        title: "Curl Up",
        description:
          "Keep your elbows close to your sides and slowly lift the dumbbells towards your shoulders, while exhaling.",
      },
      {
        number: 3,
        title: "Lower Down",
        description:
          "Pause for a moment at the top of the movement, then slowly lower the dumbbells back down to the starting position, while inhaling.",
      },
      {
        number: 4,
        title: "Repeat",
        description: "Repeat for the desired number of repetitions.",
      },
    ],
  },
  "tricep-extension": {
    name: "Seated Overhead Tricep Extension",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QMJLSpCMM5pzwhYiGwnIxlrks1c1lB.png",
    video:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supawork-3570a202f6f34743bf6795a5a035ffc7-0gnE4a4s9o7i8G0Z3oIoC5CGSLWPxZ.mp4",
    animatedImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gDpj9.gif",
    muscles: ["Triceps", "Shoulders"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Holding a dumbbell, sit on a flat bench or chair and rest the dumbbell on its side on one knee.",
      },
      {
        number: 2,
        title: "Grip Position",
        description:
          "Grasp the base of the bar of the dumbbell with both hands, one hand on top of the other.",
      },
      {
        number: 3,
        title: "Lift Overhead",
        description:
          "Adjust your grip so that your hands make a heart shape under the plate.",
      },
      {
        number: 4,
        title: "Lower Behind Head",
        description:
          "Lift the dumbbell around your shoulder and hold it behind your head with arms vertical and elbows flexed.",
      },
      {
        number: 5,
        title: "Repeat",
        description: "Repeat for the desired number of repetitions.",
      },
    ],
  },
  "wrist-curl": {
    name: "Dumbbell Wrist Curl",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DB_WRIST_CURL-h0NTrVkNdAYHemtu3slTrWktyyPJfZ.gif",
    video:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DB_WRIST_CURL%28REMOVED%29-3qccF5VCPcZR7UeFR5Zeh7FEkKBsuP.mp4",
    animatedImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DB_WRIST_CURL-h0NTrVkNdAYHemtu3slTrWktyyPJfZ.gif",
    muscles: ["Forearms", "Wrists"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Sit on a bench and hold a dumbbell in each hand with an underhand grip (palms facing up).",
      },
      {
        number: 2,
        title: "Rest Forearms",
        description:
          "Rest your forearms on your thighs with your wrists hanging over your knees.",
      },
      {
        number: 3,
        title: "Curl Wrists",
        description:
          "Slowly curl your wrists upward, lifting the dumbbells as high as possible while keeping your forearms stationary.",
      },
      {
        number: 4,
        title: "Lower Down",
        description:
          "Pause at the top, then slowly lower the dumbbells back to the starting position.",
      },
      {
        number: 5,
        title: "Repeat",
        description: "Repeat for the desired number of repetitions.",
      },
    ],
  },
};

export const kettlebellExercises: Record<string, Exercise> = {
  swing: {
    name: "Kettlebell Swing",
    image: "/images/kettlebell_swing.png",
    muscles: ["Hamstrings", "Glutes", "Core"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Stand with your feet shoulder width apart and grip the kettlebell with both hands, allowing it to hang loosely. Bend your knees and drop your buttocks backward slightly, leaning your torso forward from the hip and keeping your back straight.",
      },
      {
        number: 2,
        title: "Swing Back",
        description:
          "Keeping your arms straight but relaxed, drive forward with your hips to stand tall, so that the kettlebell swings forward and up.",
      },
      {
        number: 3,
        title: "Swing Down",
        description:
          "Allow the kettlebell to swing up as far as momentum carries it, and then back down toward the hips. As it approaches, drop your hips and lean your torso forwards, and keeping your back straight, to return to the start position.",
      },
      {
        number: 4,
        title: "Repeat",
        description: "Repeat for the desired number of repetitions",
      },
    ],
  },
  squats: {
    name: "Kettlebell Squats",
    image: "/images/kettlebell_squats.png",
    muscles: ["Quadriceps", "Hamstrings", "Glutes"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Stand with your feet hip-width apart, toes slightly outward, and hold the kettlebell handle with both hands. ",
      },
      {
        number: 2,
        title: "Engage Core",
        description:
          "Lower your body into a squat by bending your knees and pushing your hips back",
      },
      {
        number: 3,
        title: "Lower Down",
        description:
          "Ensure your knees track over your toes, keeping your back straight and chest lifted. ",
      },
      {
        number: 4,
        title: "Return to Start",
        description:
          "Drive through your heels to return to the starting position, squeezing your glutes. ",
      },
      {
        number: 5,
        title: "Repeat",
        description: "Repeat for the desired number of repetitions",
      },
    ],
  },
};

export const abRollerExercises: Record<string, Exercise> = {
  "basic-rollout": {
    name: "Basic Ab Roller Rollout",
    image: "/images/ab-roller-wheel.jpg",
    muscles: ["Abdominals", "Core", "Obliques", "Lower Back"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Kneel on a mat with the ab roller in front of you. Grip the handles firmly with both hands, keeping your arms straight.",
      },
      {
        number: 2,
        title: "Engage Core",
        description:
          "Tighten your core muscles and maintain a neutral spine. Your body should form a straight line from your knees to your head.",
      },
      {
        number: 3,
        title: "Roll Forward",
        description:
          "Slowly roll the wheel forward by extending your arms and allowing your body to move forward. Keep your core engaged to prevent your back from arching.",
      },
      {
        number: 4,
        title: "Full Extension",
        description:
          "Roll out as far as you can while maintaining control and a straight back. Avoid letting your hips sag or your back arch excessively.",
      },
      {
        number: 5,
        title: "Roll Back",
        description:
          "Using your core muscles, slowly pull the wheel back to the starting position. Focus on using your abs, not your arms, to control the movement.",
      },
      {
        number: 6,
        title: "Repeat",
        description:
          "Repeat for the desired number of repetitions, maintaining proper form throughout.",
      },
    ],
  },
  "standing-rollout": {
    name: "Standing Ab Roller Rollout",
    image: "/images/ab-roller-wheel.jpg",
    muscles: ["Abdominals", "Core", "Shoulders", "Back"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Stand with your feet hip-width apart, holding the ab roller with both hands. Bend forward at the waist and place the roller on the floor in front of your feet.",
      },
      {
        number: 2,
        title: "Initial Stance",
        description:
          "Keep your legs straight or with a slight bend at the knees. Engage your core and maintain a neutral spine.",
      },
      {
        number: 3,
        title: "Roll Forward",
        description:
          "Slowly roll the wheel forward by extending your arms. Allow your body to move forward while keeping your legs as straight as possible.",
      },
      {
        number: 4,
        title: "Controlled Descent",
        description:
          "Continue rolling until your body is nearly parallel to the floor, maintaining tension in your core throughout the movement.",
      },
      {
        number: 5,
        title: "Return to Start",
        description:
          "Using your core and back muscles, slowly roll the wheel back toward your feet, returning to the starting position.",
      },
      {
        number: 6,
        title: "Repeat",
        description:
          "Repeat for the desired number of repetitions. This is an advanced variation, so start slowly.",
      },
    ],
  },
  "oblique-rollout": {
    name: "Oblique Ab Roller Rollout",
    image: "/images/ab-roller-wheel.jpg",
    muscles: ["Obliques", "Abdominals", "Core", "Shoulders"],
    steps: [
      {
        number: 1,
        title: "Starting Position",
        description:
          "Kneel on a mat with the ab roller in front of you. Grip the handles firmly with both hands, similar to the basic rollout position.",
      },
      {
        number: 2,
        title: "Angled Setup",
        description:
          "Instead of rolling straight forward, position yourself to roll at a 45-degree angle to target your obliques.",
      },
      {
        number: 3,
        title: "Diagonal Roll",
        description:
          "Roll the wheel diagonally forward and to one side, engaging your obliques to control the movement.",
      },
      {
        number: 4,
        title: "Full Extension",
        description:
          "Extend as far as comfortable while maintaining control. Feel the stretch and engagement in your oblique muscles.",
      },
      {
        number: 5,
        title: "Return Control",
        description:
          "Pull the wheel back to the starting position using your obliques and core. Focus on the side muscles working.",
      },
      {
        number: 6,
        title: "Switch Sides",
        description:
          "Complete the set on one side, then repeat the movement rolling to the opposite diagonal direction.",
      },
    ],
  },
};
